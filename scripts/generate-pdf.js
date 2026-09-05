import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

// Colors
const GOLD = '#D4AF37';
const DARK = '#111111';
const LIGHT_GRAY = '#F5F5F5';
const TEXT_DARK = '#222222';

// Page 1: Header Banner
doc.setFillColor(17, 17, 17);
doc.rect(0, 0, 210, 40, 'F');

doc.setFillColor(212, 175, 55);
doc.rect(0, 40, 210, 3, 'F');

doc.setTextColor(255, 215, 0);
doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
doc.text('THE 5-MINUTE AI PROMPT BLUEPRINT', 105, 18, { align: 'center' });

doc.setTextColor(255, 255, 255);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('Save 15+ Hours/Week Automating Marketing, Sales & Operations', 105, 26, { align: 'center' });

doc.setFontSize(8);
doc.setTextColor(212, 175, 55);
doc.text('Sirwise AI Web3 Academy | RC BN3583773 | www.gasv.store', 105, 33, { align: 'center' });

// Body Content
let y = 52;

// Welcome Section
doc.setFillColor(245, 245, 245);
doc.roundedRect(12, y, 186, 22, 3, 3, 'F');

doc.setTextColor(34, 34, 34);
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('WELCOME TO YOUR OFFICIAL AI BLUEPRINT', 16, y + 7);

doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
const welcomeText = 'This short guide contains battle-tested prompt frameworks compatible with ChatGPT, Google Gemini, and Claude. Copy & paste these exact templates to cut your daily business tasks down from hours to minutes.';
const splitWelcome = doc.splitTextToSize(welcomeText, 178);
doc.text(splitWelcome, 16, y + 13);

y += 30;

// Prompt Helper Function
function addPromptBlock(num, title, goal, promptText) {
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(17, 17, 17);
  doc.rect(12, y, 186, 8, 'F');
  doc.setTextColor(255, 215, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`PROMPT ${num}: ${title.toUpperCase()}`, 16, y + 5.5);

  y += 10;

  doc.setTextColor(0, 100, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Goal: ${goal}`, 16, y);

  y += 5;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(200, 200, 200);

  const lines = doc.splitTextToSize(promptText, 176);
  const blockHeight = lines.length * 4.5 + 6;

  doc.roundedRect(12, y, 186, blockHeight, 2, 2, 'FD');

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(8.5);
  doc.setFont('courier', 'normal');
  doc.text(lines, 16, y + 5);

  y += blockHeight + 10;
}

addPromptBlock(
  1,
  'High-Converting Social Media Copy Generator',
  'Create 5 engaging social media posts for your business in 30 seconds.',
  `Act as a direct-response marketing expert. Write 5 short, high-converting social media posts promoting [INSERT YOUR PRODUCT/SERVICE NAME].
- Target Audience: [INSERT TARGET AUDIENCE, e.g., Small Business Owners / Creators]
- Main Benefit: [INSERT MAIN BENEFIT, e.g., Saves 5 hours a week]
- Tone: Professional, energetic, and persuasive.
- Structure: Start each post with a strong hook, followed by 3 key bullet points showing the value, and end with a clear Call to Action (CTA) directing readers to visit [INSERT YOUR WEBSITE URL].`
);

addPromptBlock(
  2,
  '60-Second Client Proposal Writer',
  'Turn raw client requirements into a professional service proposal instantly.',
  `Act as a senior business consultant. Generate a structured, professional project proposal based on these details:
- Client Problem: [INSERT CLIENT PROBLEM]
- Offered Solution: [INSERT YOUR SOLUTION]
- Key Deliverables: [LIST 2-3 DELIVERABLES]
- Timeline: [INSERT TIMELINE, e.g., 7 Days]
Structure the output into 4 clear sections: Executive Summary, Project Scope, Timeline & Milestones, and Next Steps. Keep the language concise and compelling.`
);

addPromptBlock(
  3,
  'Automated Customer Support & FAQ Engine',
  'Generate clear answers for customer questions to use in emails or WhatsApp.',
  `Act as a helpful customer support representative for [INSERT YOUR COMPANY NAME]. Write a polite, reassuring response to a customer asking: '[INSERT CUSTOMER QUESTION]'.
- Ensure the answer addresses their main concern clearly.
- Provide reassurance about security and instant delivery.
- Keep the response under 100 words and end with an offer to help further.`
);

addPromptBlock(
  4,
  'Viral Headline & Hook Generator',
  'Generate attention-grabbing titles for emails, ads, or landing pages.',
  `Generate 10 magnetic headlines for a page selling [INSERT PRODUCT NAME]. Use proven psychological triggers (curiosity, urgency, speed, and simplicity). Avoid spammy words. Focus on the transformation the customer gets after using the product.`
);

// What is next section
if (y > 230) {
  doc.addPage();
  y = 20;
}

doc.setFillColor(255, 215, 0);
doc.rect(12, y, 186, 26, 'F');

doc.setTextColor(0, 0, 0);
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('WHAT IS NEXT? UPGRADE TO FULL ACADEMY ACCESS', 16, y + 7);

doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.text('Ready to take your business to the next level? Upgrade to the full 8-Module Masterclass for $49.99:', 16, y + 13);
doc.text('• Learning Academy: https://www.gasv.store/#academy', 16, y + 18);
doc.text('• Digital Store & Checkout: https://www.gasv.store', 16, y + 22);

// Footer
doc.setFillColor(17, 17, 17);
doc.rect(0, 280, 210, 17, 'F');
doc.setTextColor(255, 215, 0);
doc.setFontSize(8);
doc.text('© Goyedagosmess Enterprise | Sirwise AI Web3 Academy | RC BN3583773 | goyedagosmess@gmail.com', 105, 289, { align: 'center' });

// Ensure output directories exist
const dir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

// Write to multiple filename targets for 100% resolution
const targets = [
  path.join(dir, '5-Minute-AI-Prompt-Blueprint-Master-SER-Sirwise.pdf'),
  path.join(dir, '5-Minute-AI-Prompt-Blueprint-TEASER-Sirwise.pdf'),
  path.join(dir, '5-minute-ai-prompt-blueprint.pdf'),
  path.join(dir, '5-Minute-AI-Prompt-Blueprint.pdf'),
  path.join(process.cwd(), 'public', '5-Minute-AI-Prompt-Blueprint-Master-SER-Sirwise.pdf')
];

for (const target of targets) {
  fs.writeFileSync(target, pdfBuffer);
  console.log(`✅ Saved valid PDF binary (${pdfBuffer.length} bytes) to: ${target}`);
}
