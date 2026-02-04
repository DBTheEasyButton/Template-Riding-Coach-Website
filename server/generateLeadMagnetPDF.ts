import { jsPDF } from 'jspdf';

// TEMPLATE: Lead Magnet PDF Generator
// This file generates a sample PDF for lead capture downloads
// Replace the content below with your own coaching guide content

const NAVY = [31, 58, 89] as const;
const ORANGE = [249, 156, 13] as const;
const DARK = [51, 65, 85] as const;
const LIGHT_GRAY = [248, 250, 252] as const;
const WHITE = [255, 255, 255] as const;

interface PDFOptions {
  margin: number;
  pageWidth: number;
  pageHeight: number;
  contentWidth: number;
  bottomMargin: number;
}

function drawPageHeader(doc: jsPDF, title: string, opts: PDFOptions): number {
  let y = opts.margin + 5;
  
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(title, opts.margin, y);
  
  y += 5;
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(2);
  doc.line(opts.margin, y, opts.margin + 60, y);
  
  return y + 15;
}

function drawHighlightBox(doc: jsPDF, lines: string[], y: number, opts: PDFOptions): number {
  const padding = 12;
  const lineHeight = 9;
  const boxHeight = lines.length * lineHeight + padding * 2;
  
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 6, 6, 'F');
  
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  
  let textY = y + padding + 7;
  lines.forEach(line => {
    doc.text(line, opts.pageWidth / 2, textY, { align: 'center' });
    textY += lineHeight;
  });
  
  return y + boxHeight + 10;
}

function drawInfoCard(doc: jsPDF, title: string, content: string, y: number, opts: PDFOptions): number {
  const padding = 8;
  doc.setFontSize(9);
  const contentLines = doc.splitTextToSize(content, opts.contentWidth - padding * 2 - 4);
  const boxHeight = 14 + contentLines.length * 4.5 + padding * 2;
  
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 4, 4, 'F');
  
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, 4, boxHeight, 2, 2, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(title, opts.margin + padding + 4, y + padding + 5);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text(contentLines, opts.margin + padding + 4, y + padding + 14);
  
  return y + boxHeight + 6;
}

function drawBulletList(doc: jsPDF, items: string[], y: number, opts: PDFOptions): number {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  
  items.forEach(item => {
    doc.setFillColor(...ORANGE);
    doc.circle(opts.margin + 4, y - 1, 2, 'F');
    const lines = doc.splitTextToSize(item, opts.contentWidth - 14);
    doc.text(lines, opts.margin + 12, y);
    y += lines.length * 5 + 4;
  });
  
  return y + 5;
}

// TEMPLATE: Main PDF generation function
// Customize this function to create your own lead magnet content
export function generateLeadMagnetPDF(): Buffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const opts: PDFOptions = {
    margin: 20,
    pageWidth: 210,
    pageHeight: 297,
    contentWidth: 170,
    bottomMargin: 25
  };

  let y = 0;

  // ==================== PAGE 1: TITLE ====================
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, opts.pageWidth, opts.pageHeight, 'F');

  // TEMPLATE: Add your logo here
  // Example:
  // const logoPath = path.join(process.cwd(), 'attached_assets', 'your-logo.png');
  // if (fs.existsSync(logoPath)) {
  //   const logoData = fs.readFileSync(logoPath);
  //   const logoBase64 = logoData.toString('base64');
  //   doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', logoX, 45, logoWidth, logoHeight);
  // }

  doc.setTextColor(...WHITE);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text("FREE TRAINING", opts.pageWidth / 2, 100, { align: 'center' });
  doc.text("GUIDE", opts.pageWidth / 2, 116, { align: 'center' });

  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(3);
  doc.line(50, 126, 160, 126);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Your subtitle goes here', opts.pageWidth / 2, 145, { align: 'center' });
  doc.text('describing what this guide covers', opts.pageWidth / 2, 156, { align: 'center' });

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('By [Your Name]', opts.pageWidth / 2, 185, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('[Your Credentials]', opts.pageWidth / 2, 198, { align: 'center' });
  doc.text('[Your Coaching Business]', opts.pageWidth / 2, 211, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(170, 170, 170);
  doc.text('https://your-coaching-business.com', opts.pageWidth / 2, 265, { align: 'center' });

  // ==================== PAGE 2: INTRODUCTION ====================
  doc.addPage();
  y = drawPageHeader(doc, 'INTRODUCTION', opts);

  y = drawHighlightBox(doc, [
    'Welcome to your free training guide!',
    'Replace this with your key message.'
  ], y, opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const introText = 'This is a template PDF generator. Replace this content with your own coaching guide, training tips, or educational material that provides value to your potential clients.';
  const introLines = doc.splitTextToSize(introText, opts.contentWidth);
  doc.text(introLines, opts.margin, y);
  y += introLines.length * 5 + 10;

  doc.text('In this guide, you will learn:', opts.margin, y);
  y += 8;

  y = drawBulletList(doc, [
    'Key concept 1 - Replace with your content',
    'Key concept 2 - Replace with your content',
    'Key concept 3 - Replace with your content',
    'Key concept 4 - Replace with your content'
  ], y, opts);

  // ==================== PAGE 3: MAIN CONTENT ====================
  doc.addPage();
  y = drawPageHeader(doc, 'SECTION 1', opts);

  y = drawInfoCard(doc, 'Topic 1', 'Add your detailed content here. This template provides a professional layout for your coaching guide. Replace all placeholder text with your own expertise and teaching points.', y, opts);

  y = drawInfoCard(doc, 'Topic 2', 'Continue adding your content. Use these info cards to break up complex topics into digestible sections that are easy for readers to follow.', y, opts);

  y = drawInfoCard(doc, 'Topic 3', 'Include practical tips and actionable advice that demonstrates your expertise and provides genuine value to potential clients.', y, opts);

  // ==================== PAGE 4: PRACTICAL TIPS ====================
  doc.addPage();
  y = drawPageHeader(doc, 'PRACTICAL TIPS', opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Here are some practical steps you can take:', opts.margin, y);
  y += 10;

  y = drawBulletList(doc, [
    'Step 1: Replace with your first actionable tip',
    'Step 2: Replace with your second actionable tip',
    'Step 3: Replace with your third actionable tip',
    'Step 4: Replace with your fourth actionable tip',
    'Step 5: Replace with your fifth actionable tip'
  ], y, opts);

  y += 10;
  y = drawHighlightBox(doc, [
    'Add your key takeaway message here.',
    'This should summarize the main value proposition.'
  ], y, opts);

  // ==================== PAGE 5: CALL TO ACTION ====================
  doc.addPage();
  y = drawPageHeader(doc, 'NEXT STEPS', opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const closingText = 'Thank you for downloading this guide! If you found this helpful and would like to take your training to the next level, I would love to work with you.';
  const closingLines = doc.splitTextToSize(closingText, opts.contentWidth);
  doc.text(closingLines, opts.margin, y);
  y += closingLines.length * 5 + 15;

  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 50, 6, 6, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('Ready for More?', opts.margin + 10, y + 15);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...WHITE);
  doc.text('Book a lesson or clinic to work with me in person.', opts.margin + 10, y + 28);
  doc.text('Visit: https://your-coaching-business.com/coaching', opts.margin + 10, y + 40);

  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}
