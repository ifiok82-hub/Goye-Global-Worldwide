import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

export async function GET() {
  try {
    const primaryName = '5-Minute-AI-Prompt-Blueprint-Master-SER-Sirwise.pdf';
    const filePath = path.join(process.cwd(), 'public', 'downloads', primaryName);

    let pdfBuffer: Buffer;
    if (fs.existsSync(filePath)) {
      pdfBuffer = fs.readFileSync(filePath);
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
      pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    }

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length.toString(),
        'Content-Disposition': `attachment; filename="${primaryName}"`,
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
