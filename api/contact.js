// Vercel Serverless Function: /api/contact
// Secure Server-Side Email Dispatcher for Portfolio Contact Form

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed. Use POST.",
    });
  }

  try {
    const { name, email, subject, message, _gotcha } = req.body || {};

    // 1. Anti-spam Honeypot Check
    // If hidden _gotcha field is filled, silently discard spam submission
    if (_gotcha && _gotcha.trim().length > 0) {
      console.warn("[Anti-Spam] Bot submission blocked via honeypot trap.");
      return res.status(200).json({
        success: true,
        message: "Message processed.",
      });
    }

    // 2. Server-side Field Validation & Sanitization
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

    // 3. Destination Admin Email Configuration
    // Configurable securely via Vercel Environment Variables: ADMIN_NOTIFICATION_EMAIL
    const recipientEmail =
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.NOTIFICATION_RECIPIENT_EMAIL ||
      "sreekarbhanu14@gmail.com";

    // 4. Formatted HTML Email Body matching editorial beige identity
    const submissionDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

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
    .footer { padding: 18px 28px; background: #faf6eb; border-top: 1px solid rgba(23, 21, 18, 0.1); font-size: 12px; color: rgba(23, 21, 18, 0.6); display: flex; justify-content: space-between; align-items: center; }
    .btn-reply { display: inline-block; background: #ed432f; color: #ffffff !important; text-decoration: none; padding: 10px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1px; border-radius: 2px; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Portfolio Inquiry</h2>
      <p>Bhanu Sreekar · Portfolio Contact System</p>
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
      <span>Auto-generated notification from your portfolio contact form</span>
      <span>Vercel + Firebase</span>
    </div>
  </div>
</body>
</html>
    `;

    // 5. Send Transactional Email Notification
    // Primary: Resend API (Free tier: 3,000 emails/month, zero setup fees)
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.EMAIL_FROM || "Portfolio Inquiry <onboarding@resend.dev>";

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
        }),
      });

      const emailResult = await emailResponse.json();

      if (!emailResponse.ok) {
        console.error("[Email Notification Failed - Resend Error]:", emailResult);
        return res.status(200).json({
          success: true,
          delivered: false,
          warning: "Message stored in database; email delivery pending service credentials.",
        });
      }

      console.log(`[Email Delivered Successfully]: Message from ${trimmedEmail} forwarded to ${recipientEmail}`);
      return res.status(200).json({
        success: true,
        delivered: true,
        id: emailResult.id,
      });
    }

    // Fallback: If RESEND_API_KEY is not yet configured in Vercel environment variables,
    // log notification cleanly so message remains securely recorded in Firebase Realtime Database
    console.warn(
      `[Email Config Notice]: RESEND_API_KEY is not yet set in Vercel environment variables. ` +
      `Message from ${trimmedEmail} was saved to Firebase Realtime Database. Configure RESEND_API_KEY in Vercel to activate instant Gmail delivery.`
    );

    return res.status(200).json({
      success: true,
      delivered: false,
      notice: "Message saved to database. Email notification requires RESEND_API_KEY in Vercel environment variables.",
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    // Return 200 with error details so frontend is not broken and database entry is preserved
    return res.status(200).json({
      success: true,
      delivered: false,
      error: error.message || "Failed to dispatch email",
    });
  }
}
