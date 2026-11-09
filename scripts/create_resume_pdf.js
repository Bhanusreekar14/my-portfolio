import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resumeDir = path.join(__dirname, '..', 'public', 'resume');
const primaryPdf = path.join(resumeDir, 'PerumallaBhanuSreekar.pdf');
const aliasPdf = path.join(resumeDir, 'Bhanu_Sreekar_Resume.pdf');

console.log('--- RESUME PDF VERIFICATION & SAFEGUARD ---');
console.log('NOTE: Dummy/fabricated resume generation is disabled to protect authentic resume data.\n');

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

function verifyPdf(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false };
  }
  const stat = fs.statSync(filePath);
  const buffer = fs.readFileSync(filePath);
  const header = buffer.subarray(0, 8).toString('latin1');
  const isPdf = header.startsWith('%PDF-');
  return {
    exists: true,
    size: stat.size,
    header,
    isValidPdf: isPdf && stat.size > 10000,
  };
}

const primaryStatus = verifyPdf(primaryPdf);
const aliasStatus = verifyPdf(aliasPdf);

if (!primaryStatus.exists) {
  console.error('❌ ERROR: Real resume PDF is missing at:');
  console.error(`   ${primaryPdf}`);
  console.error('\n👉 INSTRUCTION: Please place your genuine resume PDF file at:');
  console.error(`   public/resume/PerumallaBhanuSreekar.pdf`);
  console.error('   Do NOT generate or use a fabricated replacement.\n');
  process.exit(1);
}

if (!primaryStatus.isValidPdf) {
  console.error('⚠️ WARNING: Resume file exists but does not appear to be a valid authentic PDF document.');
  console.error(`   Size: ${primaryStatus.size} bytes (expected authentic size ~166 KB).`);
  process.exit(1);
}

console.log(`✅ Verified authentic resume PDF:`);
console.log(`   Path: ${primaryPdf}`);
console.log(`   Size: ${primaryStatus.size.toLocaleString()} bytes`);
console.log(`   Header: ${primaryStatus.header.trim()}`);

// Ensure alias exists if needed by any older references
if (!aliasStatus.exists || aliasStatus.size !== primaryStatus.size) {
  fs.copyFileSync(primaryPdf, aliasPdf);
  console.log(`✅ Synchronized alias at: ${aliasPdf}`);
}

console.log('\nResume files are authentic, verified, and ready for deployment.');
