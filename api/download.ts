import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

export default function handler(req: any, res: any) {
  try {
    const primaryName = '5-Minute-AI-Prompt-Blueprint-Master-SER-Sirwise.pdf';
    const filePath = path.join(process.cwd(), 'public', 'downloads', primaryName);

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Disposition', `attachment; filename="${primaryName}"`);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      const stream = fs.createReadStream(filePath);
      return stream.pipe(res);
    } else {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
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

      const buffer = Buffer.from(doc.output('arraybuffer'));
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Content-Disposition', `attachment; filename="${primaryName}"`);
      return res.status(200).send(buffer);
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to stream PDF', details: err.message });
  }
}
