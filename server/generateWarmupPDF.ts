import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

// Exact website colors
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
  
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(title, opts.margin, y);
  
  y += 5;
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(2);
  doc.line(opts.margin, y, opts.margin + 60, y);
  
  return y + 15;
}

function drawBigHighlightBox(doc: jsPDF, lines: string[], y: number, opts: PDFOptions): number {
  const padding = 14;
  const lineHeight = 10;
  const boxHeight = lines.length * lineHeight + padding * 2;
  
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 6, 6, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  
  let textY = y + padding + 8;
  lines.forEach(line => {
    doc.text(line, opts.pageWidth / 2, textY, { align: 'center' });
    textY += lineHeight;
  });
  
  return y + boxHeight + 12;
}

function drawQuoteBox(doc: jsPDF, quote: string, y: number, opts: PDFOptions): number {
  const padding = 12;
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(quote, opts.contentWidth - padding * 2 - 10);
  const boxHeight = lines.length * 7 + padding * 2;
  
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 5, 5, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(lines, opts.margin + padding, y + padding + 6);
  
  return y + boxHeight + 10;
}

function drawNavyQuoteBox(doc: jsPDF, title: string, lines: string[], y: number, opts: PDFOptions): number {
  const padding = 12;
  const titleHeight = title ? 14 : 0;
  const lineHeight = 8;
  const boxHeight = titleHeight + lines.length * lineHeight + padding * 2;
  
  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 5, 5, 'F');
  
  let textY = y + padding;
  
  if (title) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ORANGE);
    doc.text(title, opts.margin + padding, textY + 6);
    textY += titleHeight;
  }
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...WHITE);
  lines.forEach(line => {
    doc.text(line, opts.margin + padding, textY + 5);
    textY += lineHeight;
  });
  
  return y + boxHeight + 10;
}

function drawInfoCard(doc: jsPDF, title: string, content: string, y: number, opts: PDFOptions): number {
  const padding = 10;
  doc.setFontSize(10);
  const contentLines = doc.splitTextToSize(content, opts.contentWidth - padding * 2);
  const boxHeight = 16 + contentLines.length * 5 + padding * 2;
  
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 4, 4, 'F');
  
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, 4, boxHeight, 2, 2, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(title, opts.margin + padding + 4, y + padding + 6);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text(contentLines, opts.margin + padding + 4, y + padding + 16);
  
  return y + boxHeight + 8;
}

function drawNumberedList(doc: jsPDF, items: string[], y: number, opts: PDFOptions): number {
  items.forEach((item, index) => {
    const circleX = opts.margin + 10;
    const circleY = y - 1;
    
    doc.setFillColor(...ORANGE);
    doc.circle(circleX, circleY, 5, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(String(index + 1), circleX - 2, y + 1);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(item, opts.contentWidth - 28);
    doc.text(lines, opts.margin + 22, y);
    y += lines.length * 5 + 8;
  });
  
  return y;
}

function drawIconList(doc: jsPDF, items: string[], y: number, opts: PDFOptions): number {
  doc.setFontSize(10);
  
  items.forEach(item => {
    doc.setFillColor(...ORANGE);
    doc.triangle(opts.margin + 6, y - 3, opts.margin + 6, y + 3, opts.margin + 12, y, 'F');
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(item, opts.contentWidth - 22);
    doc.text(lines, opts.margin + 18, y + 1);
    y += lines.length * 5 + 6;
  });
  
  return y + 2;
}

function drawCheckList(doc: jsPDF, items: string[], y: number, opts: PDFOptions): number {
  doc.setFontSize(10);
  
  items.forEach(item => {
    doc.setFillColor(...ORANGE);
    doc.roundedRect(opts.margin + 4, y - 4, 8, 8, 1, 1, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(String.fromCharCode(0x2713), opts.margin + 6, y + 1);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    doc.text(item, opts.margin + 18, y);
    y += 10;
  });
  
  return y + 3;
}

function drawStepCard(doc: jsPDF, stepNum: string, title: string, items: string[], note: string, y: number, opts: PDFOptions): number {
  const padding = 8;
  const itemHeight = items.length * 6;
  const noteHeight = note ? 8 : 0;
  const boxHeight = 18 + itemHeight + noteHeight + padding;
  
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 4, 4, 'F');
  
  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin + padding, y + padding, 28, 12, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(stepNum, opts.margin + padding + 4, y + padding + 8);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(title, opts.margin + padding + 34, y + padding + 8);
  
  let itemY = y + padding + 18;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  
  items.forEach(item => {
    doc.setTextColor(...ORANGE);
    doc.text('-', opts.margin + padding + 4, itemY);
    doc.setTextColor(...DARK);
    doc.text(item, opts.margin + padding + 10, itemY);
    itemY += 6;
  });
  
  if (note) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...NAVY);
    doc.setFontSize(8);
    doc.text(note, opts.margin + padding + 4, itemY + 1);
  }
  
  return y + boxHeight + 5;
}

export function generateWarmupSystemPDF(): Buffer {
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

  try {
    const logoPath = path.join(process.cwd(), 'attached_assets', 'optimized', 'Dan Bizzarro Method_1749676680719.png');
    if (fs.existsSync(logoPath)) {
      const logoData = fs.readFileSync(logoPath);
      const logoBase64 = logoData.toString('base64');
      const logoWidth = 100;
      const logoHeight = 50;
      const logoX = 55;
      doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', logoX, 40, logoWidth, logoHeight);
    }
  } catch (err) {
    console.log('Could not load logo:', err);
  }

  doc.setTextColor(...WHITE);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text("THE EVENTER'S", opts.pageWidth / 2, 110, { align: 'center' });
  doc.text("WARM-UP SYSTEM", opts.pageWidth / 2, 126, { align: 'center' });

  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(3);
  doc.line(50, 136, 160, 136);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('A simple, reliable warm-up routine for', opts.pageWidth / 2, 155, { align: 'center' });
  doc.text('Dressage, Show Jumping, and Cross-Country', opts.pageWidth / 2, 166, { align: 'center' });

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('By Dan Bizzarro', opts.pageWidth / 2, 195, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('International Event Rider & Coach', opts.pageWidth / 2, 208, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(170, 170, 170);
  doc.text('https://danbizzarromethod.com', opts.pageWidth / 2, 265, { align: 'center' });

  // ==================== PAGE 2: INTRODUCTION ====================
  doc.addPage();
  y = drawPageHeader(doc, '1. INTRODUCTION', opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);

  const intro = "Warming up shouldn't feel chaotic. Yet for most riders, it does. Busy arenas, tight timings, nerves, and a horse who may feel nothing like the one you had yesterday.";
  const introLines = doc.splitTextToSize(intro, opts.contentWidth);
  doc.text(introLines, opts.margin, y);
  y += introLines.length * 6 + 8;

  const intro2 = "This guide gives you a system you can repeat every time you compete. It keeps things simple, practical, and effective - even when you're stressed or short on time.";
  const intro2Lines = doc.splitTextToSize(intro2, opts.contentWidth);
  doc.text(intro2Lines, opts.margin, y);
  y += intro2Lines.length * 6 + 12;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Everything in here is built around one main idea:', opts.margin, y);
  y += 12;

  y = drawBigHighlightBox(doc, [
    'Transitions are the engine of a good warm-up.',
    'Done often and done lightly, they change your horse',
    'more quickly than circles or drilling tests.'
  ], y, opts);

  y += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('If you only changed one habit in your warm-up, let it be this:', opts.margin, y);
  y += 8;
  
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('More transitions, spread throughout the whole routine.', opts.margin, y);

  // ==================== PAGE 3: HOW TO USE ====================
  doc.addPage();
  y = drawPageHeader(doc, '2. HOW TO USE THIS GUIDE', opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Use this guide on competition day as a clear plan you can follow step-by-step.', opts.margin, y);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text("You'll find:", opts.margin, y);
  y += 10;

  y = drawNumberedList(doc, [
    'A repeatable structure for each discipline',
    'Simple explanations for why it works',
    'Quick fixes for common problems',
    'A printable one-page summary',
    'The core Dan Bizzarro Method principles woven throughout'
  ], y, opts);

  y += 10;
  y = drawBigHighlightBox(doc, [
    'THE GOLDEN RULE',
    '',
    'If in doubt, do a transition.',
    'If it feels wrong, do a transition.',
    'If it feels right - reward, breathe, carry on.'
  ], y, opts);

  // ==================== PAGE 4: PRINCIPLES ====================
  doc.addPage();
  y = drawPageHeader(doc, '3. WARM-UP PRINCIPLES', opts);

  const principles = [
    { title: 'Keep everything repeatable', desc: 'Your horse should recognise the structure. It creates confidence.' },
    { title: 'Create a soft neck first', desc: 'A relaxed neck gives you access to the shoulders, back, and hind legs.' },
    { title: "Don't chase a shape", desc: 'Let rhythm and relaxation give you the outline - not pulling or forcing.' },
    { title: 'Use transitions early and often', desc: "They're the quickest way to build balance, connection, and focus." },
    { title: "Don't over-school before competing", desc: "You're preparing the body and brain, not re-training." },
    { title: 'End on a good note', desc: 'Finish with softness, straightness, and one clear positive feeling.' }
  ];

  principles.forEach((p, i) => {
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(opts.margin, y, opts.contentWidth, 24, 4, 4, 'F');
    
    doc.setFillColor(...ORANGE);
    doc.circle(opts.margin + 14, y + 12, 8, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(String(i + 1), opts.margin + 11, y + 16);
    
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(p.title, opts.margin + 28, y + 10);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    doc.text(p.desc, opts.margin + 28, y + 18);
    
    y += 28;
  });

  // ==================== PAGE 5: WHY TRANSITIONS ====================
  doc.addPage();
  y = drawPageHeader(doc, '4. WHY TRANSITIONS MATTER', opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const transIntro = "Most riders know transitions are important, but very few actually use them enough - especially when warming up. Here's what transitions give you:";
  const transIntroLines = doc.splitTextToSize(transIntro, opts.contentWidth);
  doc.text(transIntroLines, opts.margin, y);
  y += transIntroLines.length * 6 + 10;

  y = drawCheckList(doc, [
    'Balance without tension',
    'Engagement without speed',
    'More control in busy warm-up rings',
    'A quick way to soften the back and neck',
    'Better straightness instantly',
    'A more adjustable canter for jumping',
    'A focused mind for spooky or sharp horses',
    'A better connection with fewer aids'
  ], y, opts);

  y += 10;
  y = drawBigHighlightBox(doc, [
    'Transitions are the quickest, kindest,',
    'and most effective tool you have.'
  ], y, opts);

  // ==================== PAGE 6: OVERVIEW TABLE ====================
  doc.addPage();
  y = drawPageHeader(doc, '5. WARM-UP OVERVIEW', opts);

  const colWidths = [42, 42, 43, 43];
  const rowHeight = 12;
  let tableX = opts.margin;

  doc.setFillColor(...NAVY);
  doc.roundedRect(tableX, y, opts.contentWidth, rowHeight, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  
  let xPos = tableX;
  ['Phase', 'Dressage', 'Show Jumping', 'Cross-Country'].forEach((h, i) => {
    doc.text(h, xPos + 5, y + 8);
    xPos += colWidths[i];
  });
  y += rowHeight;

  const tableData = [
    ['Walk', '8-12 mins', '5 mins', '5-10 mins'],
    ['Trot', '8-10 mins', '5 mins', '5 mins'],
    ['Canter', '5-7 mins', '5-7 mins', '7-10 mins'],
    ['Specific', '10 mins', '10-15 mins', '10-12 mins'],
    ['Final prep', '2-3 mins', '2-3 mins', '2-3 mins']
  ];

  tableData.forEach((row, rowIndex) => {
    if (rowIndex % 2 === 0) {
      doc.setFillColor(...LIGHT_GRAY);
    } else {
      doc.setFillColor(...WHITE);
    }
    doc.rect(tableX, y, opts.contentWidth, rowHeight, 'F');
    
    xPos = tableX;
    row.forEach((cell, i) => {
      if (i === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...NAVY);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...DARK);
      }
      doc.setFontSize(9);
      doc.text(cell, xPos + 5, y + 8);
      xPos += colWidths[i];
    });
    y += rowHeight;
  });

  y += 15;
  y = drawQuoteBox(doc, 'Transitions are woven into every phase, not just at the end. Use them to check balance, wake the hind legs, or settle the brain.', y, opts);

  // ==================== PAGE 7: DRESSAGE PART 1 ====================
  doc.addPage();
  y = drawPageHeader(doc, '6. DRESSAGE WARM-UP', opts);

  y = drawInfoCard(doc, 'Goal', 'Soft neck - Rhythm and relaxation - Straightness - Horse in front of the leg - Rider breathing and centred', y, opts);

  y = drawStepCard(doc, 'STEP 1', 'Walk (8-12 minutes)', [
    'Free walk to begin',
    'Big bending lines',
    'A few steps of leg yield each way',
    '3-4 walk-halt-walk transitions',
    'One or two rein-back then walk on'
  ], 'Purpose: establish boundaries, softness, and a calm rhythm.', y, opts);

  y = drawStepCard(doc, 'STEP 2', 'Trot (8-10 minutes)', [
    'Large circles',
    'Serpentines',
    'Frequent changes of rein',
    'Trot-walk-trot every 6-8 strides',
    'A few 3-second releases'
  ], 'Let the trot find its own swing before you organise anything.', y, opts);

  // ==================== PAGE 8: DRESSAGE PART 2 ====================
  doc.addPage();
  y = drawPageHeader(doc, '6. DRESSAGE WARM-UP', opts);

  y = drawStepCard(doc, 'STEP 3', 'Canter (5-7 minutes)', [
    'Canter-trot-canter transitions',
    'Gear changes: go forward, bring back, soften',
    'One 20m circle each way'
  ], 'Think: adjustable, soft, breathing.', y, opts);

  y = drawStepCard(doc, 'STEP 4', 'Specific Work (10 minutes)', [
    'Transitions every few strides to keep balance',
    '20m circles',
    'A few steps of leg yield',
    'A couple of lengthened strides',
    'Tighten the edges of the connection'
  ], '', y, opts);

  y += 2;
  y = drawQuoteBox(doc, 'Rule: Never ride a movement until the transition before it feels good.', y, opts);

  y = drawStepCard(doc, 'STEP 5', 'Pre-Ring Routine (2-3 minutes)', [
    'One upward, one downward transition',
    'Stretch the neck down',
    'Straighten on a long side',
    'Walk towards the ring calm and organised'
  ], '', y, opts);

  // ==================== PAGE 9: DRESSAGE QUICK FIXES ====================
  doc.addPage();
  y = drawPageHeader(doc, '6. DRESSAGE WARM-UP', opts);

  y = drawNavyQuoteBox(doc, 'QUICK FIXES', [
    'Tension: 20m circles + trot-walk-trot transitions',
    'Behind the leg: quick upward transitions',
    'Leaning or heavy: upward transition then release',
    'Hollow: bigger lines + soft neck + transitions'
  ], y, opts);

  // ==================== PAGE 10: SHOW JUMPING PART 1 ====================
  doc.addPage();
  y = drawPageHeader(doc, '7. SHOW JUMPING WARM-UP', opts);

  y = drawInfoCard(doc, 'Goal', 'Adjustability - Balance before and after fences - Straightness - A canter you can ride forward or bring back', y, opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Why Transitions Matter in SJ - They create:', opts.margin, y);
  y += 8;

  y = drawIconList(doc, [
    'The canter you jump from',
    'Control in a busy warm-up',
    'Softness without losing power',
    'Straightness without fighting',
    'A "thinking" horse rather than a reactive one'
  ], y, opts);

  y += 5;
  y = drawStepCard(doc, 'STEP 1', 'Walk (5 minutes)', [
    'A few walk-halt-walk transitions',
    'One or two rein-back then walk on',
    'Gentle bending'
  ], '', y, opts);

  y = drawStepCard(doc, 'STEP 2', 'Trot (5 minutes)', [
    'Figure-of-eights',
    'Trot-walk-trot every 6-8 strides',
    'Softening the neck'
  ], '', y, opts);

  // ==================== PAGE 11: SHOW JUMPING PART 2 ====================
  doc.addPage();
  y = drawPageHeader(doc, '7. SHOW JUMPING WARM-UP', opts);

  y = drawStepCard(doc, 'STEP 3', 'Canter (5-7 minutes)', [
    'Canter-trot-canter transitions',
    'Gear changes: "wait" 3-4 strides then "go" 3-4 strides',
    'Straight lines with a soft neck',
    'Keep hands soft after each transition'
  ], 'This is the most important part before fences.', y, opts);

  y += 5;
  y = drawBigHighlightBox(doc, [
    'No horse should jump until you have had',
    'three good transitions in a row.'
  ], y, opts);

  y = drawStepCard(doc, 'STEP 4', 'Jump Warm-Up (10-12 minutes)', [
    'Crosspole twice',
    'Upright small, then mid-height',
    'Oxer small, then at competition height',
    'Optional: 1-2 bigger for confidence'
  ], '', y, opts);

  y += 5;
  y = drawQuoteBox(doc, 'After every jump: Land, wait, straighten, ride away. This is the Dan Bizzarro Method - balance before and after the fence.', y, opts);

  // ==================== PAGE 12: CROSS-COUNTRY PART 1 ====================
  doc.addPage();
  y = drawPageHeader(doc, '8. CROSS-COUNTRY WARM-UP', opts);

  y = drawInfoCard(doc, 'Goal', 'Controlled engine - A soft, long neck for balance - A "thinking" canter - Confidence at the first fence', y, opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Why Transitions Matter Even More in XC:', opts.margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Because XC creates more adrenaline, more forward desire,', opts.margin, y);
  y += 6;
  doc.text('and more need for adjustability and a balanced gallop.', opts.margin, y);
  y += 10;

  y = drawQuoteBox(doc, 'Transitions give you access to the hind legs without killing forward.', y, opts);

  y = drawStepCard(doc, 'STEP 1', 'Walk (5-10 minutes)', [
    'Long rein',
    'Let the horse look',
    'Walk-halt-walk',
    'A few steps of leg yield'
  ], '', y, opts);

  y = drawStepCard(doc, 'STEP 2', 'Trot (5 minutes)', [
    'Rising trot',
    'One or two trot-walk-trot transitions',
    'Keep it loose and swinging'
  ], '', y, opts);

  // ==================== PAGE 13: CROSS-COUNTRY PART 2 ====================
  doc.addPage();
  y = drawPageHeader(doc, '8. CROSS-COUNTRY WARM-UP', opts);

  y = drawStepCard(doc, 'STEP 3', 'Canter (7-10 minutes)', [
    'Forward canter, then transition down, then forward again',
    'Canter-trot-canter',
    'One decent gallop stretch',
    'Bring back, soften, breathe, repeat'
  ], "You're searching for adjustability, not exhaustion.", y, opts);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  doc.text('This is where your XC ride is made.', opts.margin, y);
  y += 12;

  y = drawStepCard(doc, 'STEP 4', 'Jump Warm-Up (10-12 minutes)', [
    'Small fence (maybe twice)',
    'Medium fence',
    'One at competition height',
    'Land, wait, straighten, ride away'
  ], '', y, opts);

  y += 8;
  y = drawBigHighlightBox(doc, [
    'Before you start XC, ask yourself:',
    '"Can I ask my horse to let the fence come to me?"',
    '"Can we jump the fence exactly how I want to?"',
    'If the answers are yes and yes - you are ready!'
  ], y, opts);

  // ==================== PAGE 14: TROUBLESHOOTING ====================
  doc.addPage();
  y = drawPageHeader(doc, '9. TROUBLESHOOTING', opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Common Warm-Up Problems and Fixes:', opts.margin, y);
  y += 10;

  const problems = [
    { problem: 'Horse is tense or spooky', fix: 'Bigger lines, more transitions, longer walk phase. Avoid corrections - use redirection.' },
    { problem: 'Horse is behind the leg', fix: 'Quick upward transitions, then soften. Walk-trot-walk-trot until sharp.' },
    { problem: 'Horse is rushing or strong', fix: 'Down transitions every few strides. Canter-trot-canter. Keep your body soft.' },
    { problem: "Horse won't connect", fix: 'Soft neck first. Transitions to the hand, not pulling.' },
    { problem: 'Rider is stressed', fix: 'Breathe out. Simplify the plan. Focus on one good transition.' },
    { problem: 'Short on time', fix: 'Transitions from walk, straight to canter work. Skip trot if needed.' }
  ];

  problems.forEach(p => {
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(opts.margin, y, opts.contentWidth, 22, 4, 4, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ORANGE);
    doc.text(p.problem, opts.margin + 8, y + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    doc.setFontSize(9);
    const fixLines = doc.splitTextToSize(p.fix, opts.contentWidth - 16);
    doc.text(fixLines, opts.margin + 8, y + 16);
    
    y += 26;
  });

  y += 5;
  y = drawQuoteBox(doc, 'Every warm-up is different. Trust the structure - but stay flexible with the details.', y, opts);

  // ==================== PAGE 15: SUMMARY ====================
  doc.addPage();
  y = drawPageHeader(doc, '10. ONE-PAGE SUMMARY', opts);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...DARK);
  doc.text('Print this page and keep it in your lorry.', opts.margin, y);
  y += 10;

  // Dressage summary
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 50, 4, 4, 'F');
  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin, y, 4, 50, 2, 2, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('DRESSAGE', opts.margin + 10, y + 10);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const dressageSummary = [
    'Walk (8-12 min): Free walk > leg yield > walk-halt-walk',
    'Trot (8-10 min): Large circles > serpentines > trot-walk-trot',
    'Canter (5-7 min): Canter-trot-canter > gear changes',
    'Specific (10 min): Transitions > 20m circles > lengthen',
    'Final (2-3 min): One up, one down > stretch > straighten'
  ];
  let boxY = y + 18;
  dressageSummary.forEach(line => {
    doc.text(line, opts.margin + 10, boxY);
    boxY += 6;
  });
  y += 55;

  // Show Jumping summary
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 50, 4, 4, 'F');
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, 4, 50, 2, 2, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('SHOW JUMPING', opts.margin + 10, y + 10);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const sjSummary = [
    'Walk (5 min): Walk-halt-walk > rein-back',
    'Trot (5 min): Figure-of-eights > trot-walk-trot',
    'Canter (5-7 min): Canter-trot-canter > gear changes',
    'Jumps (10-15 min): Crosspole > upright > oxer > height',
    'Key: Land > wait > straight > ride away'
  ];
  boxY = y + 18;
  sjSummary.forEach(line => {
    doc.text(line, opts.margin + 10, boxY);
    boxY += 6;
  });
  y += 55;

  // XC summary
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 50, 4, 4, 'F');
  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin, y, 4, 50, 2, 2, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('CROSS-COUNTRY', opts.margin + 10, y + 10);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const xcSummary = [
    'Walk (5-10 min): Long rein > walk-halt-walk',
    'Trot (5 min): Rising trot > trot-walk-trot',
    'Canter (7-10 min): Forward > back > gallop > collect',
    'Jumps (10-12 min): Small > medium > height',
    'Test: Can horse let fence come to me? Jump how I want? Yes + Yes = Ready!'
  ];
  boxY = y + 18;
  xcSummary.forEach(line => {
    doc.text(line, opts.margin + 10, boxY);
    boxY += 6;
  });

  // ==================== PAGE 16: FINAL THOUGHTS ====================
  doc.addPage();
  y = drawPageHeader(doc, 'FINAL THOUGHTS', opts);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  
  doc.text("A good warm-up isn't about making the horse perfect -", opts.margin, y);
  y += 7;
  doc.text("it's about making the horse ready.", opts.margin, y);
  y += 15;
  
  doc.text("If you can leave the warm-up ring with a horse that is:", opts.margin, y);
  y += 10;

  y = drawCheckList(doc, [
    'Soft in the neck',
    'Listening to the leg',
    'Balanced in the transitions',
    'And still breathing...'
  ], y, opts);

  y += 5;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text("...then you've done your job.", opts.margin, y);
  y += 18;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Good luck, ride well, and trust your training.', opts.margin, y);
  y += 25;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('Dan Bizzarro', opts.margin, y);
  y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('International Event Rider & Coach', opts.margin, y);
  y += 6;
  doc.text('https://danbizzarromethod.com', opts.margin, y);

  y += 25;
  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 40, 5, 5, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('Ready for More?', opts.margin + 12, y + 14);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...WHITE);
  doc.text('Book a clinic or private lesson to work on your warm-up in person.', opts.margin + 12, y + 25);
  doc.text('Visit: https://danbizzarromethod.com/coaching', opts.margin + 12, y + 34);

  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}
