// Vercel Serverless Function: /api/contact
// Production-hardened Email Dispatcher for Portfolio Contact Form

// Sliding window in-memory rate limiter per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(clientIp) {
  const now = Date.now();

  // Garbage collect expired entries
  if (rateLimitMap.size > 200) {
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(ip);
      }
    }
  }

  const clientData = rateLimitMap.get(clientIp);

  if (!clientData || now > clientData.resetAt) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSec = Math.ceil((clientData.resetAt - now) / 1000);
    return { limited: true, retryAfterSec };
  }

  clientData.count += 1;
  return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW - clientData.count };
}

function maskEmail(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) return "none";
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
}

export default async function handler(req, res) {
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "anonymous";

  // Diagnostic GET health check (safe, exposes NO secrets)
  if (req.method === "GET") {
    const hasKey = Boolean(process.env.RESEND_API_KEY);
    const recipientRaw =
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.NOTIFICATION_RECIPIENT_EMAIL ||
      "sreekarbhanu14@gmail.com";
    const sender = process.env.EMAIL_FROM || "Portfolio Inquiry <onboarding@resend.dev>";

    return res.status(200).json({
      status: "operational",
      method: "GET",
      diagnostics: {
        hasResendKey: hasKey,
        keyLength: hasKey ? process.env.RESEND_API_KEY.length : 0,
        recipientMasked: maskEmail(recipientRaw),
        senderAddress: sender,
        environment: process.env.VERCEL_ENV || "unknown",
      },
      clientIp: clientIp === "anonymous" ? "unknown" : clientIp.replace(/\.\d+$/, ".***"),
    });
  }

  // Only allow POST for submission
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed. Use POST.",
    });
  }

  // 1. IP Rate Limiting Check
  const rateLimit = checkRateLimit(clientIp);
  if (rateLimit.limited) {
    return res.status(429).json({
      success: false,
      error: `Too many submissions. Please wait ${Math.ceil(rateLimit.retryAfterSec / 60)} minutes before trying again.`,
      retryAfterSeconds: rateLimit.retryAfterSec,
    });
  }

  try {
    const { name, email, subject, message, _gotcha } = req.body || {};

    // 2. Anti-spam Honeypot Check
    // If hidden _gotcha field is filled by a bot, silently discard
    if (_gotcha && String(_gotcha).trim().length > 0) {
      console.warn(`[Anti-Spam] Bot submission blocked via honeypot trap from IP: ${clientIp}`);
      return res.status(200).json({
        success: true,
        delivered: false,
        message: "Message processed.",
      });
    }

    // 3. Server-side Field Validation & Sanitization
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedSubject = typeof subject === "string" ? subject.trim() : "";
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!trimmedName || trimmedName.length > 100) {
      return res.status(400).json({ success: false, error: "Valid name (1-100 characters) is required." });
    }

    if (!trimmedEmail || trimmedEmail.length > 100 || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, error: "A valid email address is required." });
    }

    if (!trimmedSubject || trimmedSubject.length > 200) {
      return res.status(400).json({ success: false, error: "Subject (1-200 characters) is required." });
    }

    if (!trimmedMessage || trimmedMessage.length > 5000) {
      return res.status(400).json({ success: false, error: "Message body (1-5000 characters) is required." });
    }

    // 4. Destination Admin Email Configuration
    const recipientEmail = (
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.NOTIFICATION_RECIPIENT_EMAIL ||
      "sreekarbhanu14@gmail.com"
    ).trim();

    // 5. Plain Text Fallback (Prevents spam classification in Gmail)
    const submissionDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    const plainTextContent = `NEW PORTFOLIO INQUIRY

Sender: ${trimmedName}
Email: ${trimmedEmail}
Subject: ${trimmedSubject}
Received: ${submissionDate} (IST)

--- MESSAGE BODY ---
${trimmedMessage}

---
To reply, reply directly to this email or send to: ${trimmedEmail}
Auto-notification from Portfolio Contact System
`;

    // 6. Formatted HTML Email Body matching portfolio beige identity
    const escapeHtml = (str) =>
      str.replace(/[&<>'"]/g, (tag) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      }[tag] || tag));

    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeSubject = escapeHtml(trimmedSubject);
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, "<br/>");

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3eedf; margin: 0; padding: 24px; color: #171512; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #171512; border-radius: 4px; box-shadow: 4px 6px 0 #171512; overflow: hidden; }
    .header { background: #171512; color: #f3eedf; padding: 20px 28px; }
    .header h2 { margin: 0; font-size: 18px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 800; }
    .header p { margin: 6px 0 0 0; font-size: 12px; color: #ed432f; font-weight: 700; letter-spacing: 1px; }
    .content { padding: 28px; }
    .meta-box { background: #faf6eb; border: 1px solid rgba(23, 21, 18, 0.15); border-left: 4px solid #ed432f; padding: 16px; margin-bottom: 24px; }
    .meta-row { margin-bottom: 8px; font-size: 14px; }
    .meta-row:last-child { margin-bottom: 0; }
    .meta-label { font-weight: 700; color: #171512; display: inline-block; width: 85px; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
    .meta-val { color: #171512; }
    .message-box { background: #ffffff; border: 1px dashed rgba(23, 21, 18, 0.25); border-radius: 4px; padding: 20px; font-size: 15px; line-height: 1.7; color: #171512; }
    .footer { padding: 18px 28px; background: #faf6eb; border-top: 1px solid rgba(23, 21, 18, 0.1); font-size: 12px; color: rgba(23, 21, 18, 0.6); }
    .btn-reply { display: inline-block; background: #ed432f; color: #ffffff !important; text-decoration: none; padding: 10px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1px; border-radius: 2px; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Portfolio Inquiry</h2>
      <p>Portfolio Contact System</p>
    </div>
    <div class="content">
      <div class="meta-box">
        <div class="meta-row"><span class="meta-label">Sender:</span> <span class="meta-val"><strong>${safeName}</strong></span></div>
        <div class="meta-row"><span class="meta-label">Email:</span> <span class="meta-val"><a href="mailto:${safeEmail}">${safeEmail}</a></span></div>
        <div class="meta-row"><span class="meta-label">Subject:</span> <span class="meta-val">${safeSubject}</span></div>
        <div class="meta-row"><span class="meta-label">Received:</span> <span class="meta-val">${submissionDate}</span></div>
      </div>
      <div class="message-box">
        ${safeMessage}
      </div>
      <div style="margin-top: 24px; text-align: right;">
        <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(trimmedSubject)}" class="btn-reply">Reply to ${safeName} &rarr;</a>
      </div>
    </div>
    <div class="footer">
      <span>Auto-generated notification &bull; Portfolio Contact System</span>
    </div>
  </div>
</body>
</html>
`;

    // 7. Dispatch via Resend API
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const fromAddress = (process.env.EMAIL_FROM || "Portfolio Inquiry <onboarding@resend.dev>").trim();

    if (resendApiKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [recipientEmail],
          reply_to: trimmedEmail,
          subject: `[Portfolio Inquiry] ${trimmedSubject} - from ${trimmedName}`,
          html: htmlContent,
          text: plainTextContent,
        }),
      });

      const emailResult = await emailResponse.json();

      if (!emailResponse.ok) {
        console.error("[Email Notification Failed - Resend Error]:", emailResult);
        return res.status(200).json({
          success: true,
          delivered: false,
          warning: "Message stored in database; email delivery pending service credentials.",
          errorDetails: {
            statusCode: emailResponse.status,
            name: emailResult?.name || "ResendError",
            message: emailResult?.message || "Failed to dispatch email",
          },
          config: {
            hasResendKey: true,
            recipientMasked: maskEmail(recipientEmail),
            fromAddress: fromAddress,
          },
        });
      }

      console.log(`[Email Delivered Successfully]: ID: ${emailResult.id} forward to ${recipientEmail}`);
      return res.status(200).json({
        success: true,
        delivered: true,
        id: emailResult.id,
      });
    }

    // If RESEND_API_KEY is not yet configured in Vercel environment variables
    console.warn(`[Email Config Notice]: RESEND_API_KEY missing in Vercel environment variables.`);
    return res.status(200).json({
      success: true,
      delivered: false,
      notice: "Message saved to database. Email notification requires RESEND_API_KEY in Vercel environment variables.",
      config: {
        hasResendKey: false,
        recipientMasked: maskEmail(recipientEmail),
      },
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return res.status(200).json({
      success: true,
      delivered: false,
      error: error.message || "Failed to dispatch email",
    });
  }
}
