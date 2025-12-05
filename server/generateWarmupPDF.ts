import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

// Exact website colors (converted from HSL to RGB)
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
}

function addNewPageIfNeeded(doc: jsPDF, y: number, opts: PDFOptions, requiredSpace: number = 50): number {
  if (y > opts.pageHeight - opts.margin - requiredSpace) {
    doc.addPage();
    return opts.margin + 15;
  }
  return y;
}

function drawSectionHeader(doc: jsPDF, title: string, y: number, opts: PDFOptions): number {
  y = addNewPageIfNeeded(doc, y, opts, 30);
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(title, opts.margin, y);
  y += 6;
  
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(1.5);
  doc.line(opts.margin, y, opts.margin + 45, y);
  
  return y + 12;
}

function drawInfoBox(doc: jsPDF, title: string, content: string, y: number, opts: PDFOptions): number {
  y = addNewPageIfNeeded(doc, y, opts, 45);
  
  const padding = 8;
  doc.setFontSize(10);
  const contentLines = doc.splitTextToSize(content, opts.contentWidth - padding * 2);
  const boxHeight = 12 + contentLines.length * 5 + padding * 2;
  
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 4, 4, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(title, opts.margin + padding, y + padding + 5);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text(contentLines, opts.margin + padding, y + padding + 14);
  
  return y + boxHeight + 8;
}

function drawHighlightBox(doc: jsPDF, title: string, lines: string[], y: number, opts: PDFOptions): number {
  y = addNewPageIfNeeded(doc, y, opts, 50);
  
  const padding = 10;
  const titleHeight = title ? 12 : 0;
  const lineHeight = 7;
  const boxHeight = titleHeight + lines.length * lineHeight + padding * 2;
  
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 4, 4, 'F');
  
  let textY = y + padding + 5;
  
  if (title) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(title, opts.margin + padding, textY);
    textY += titleHeight;
  }
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  lines.forEach(line => {
    doc.text(line, opts.margin + padding, textY);
    textY += lineHeight;
  });
  
  return y + boxHeight + 10;
}

function drawNavyBox(doc: jsPDF, title: string, lines: string[], y: number, opts: PDFOptions): number {
  y = addNewPageIfNeeded(doc, y, opts, 50);
  
  const padding = 10;
  const titleHeight = title ? 12 : 0;
  const lineHeight = 7;
  const boxHeight = titleHeight + lines.length * lineHeight + padding * 2;
  
  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 4, 4, 'F');
  
  let textY = y + padding + 5;
  
  if (title) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(title, opts.margin + padding, textY);
    textY += titleHeight;
  }
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  lines.forEach(line => {
    doc.text(line, opts.margin + padding, textY);
    textY += lineHeight;
  });
  
  return y + boxHeight + 10;
}

function drawBulletList(doc: jsPDF, items: string[], y: number, opts: PDFOptions): number {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  items.forEach(item => {
    y = addNewPageIfNeeded(doc, y, opts, 15);
    doc.setTextColor(...ORANGE);
    doc.text('-', opts.margin + 6, y);
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(item, opts.contentWidth - 18);
    doc.text(lines, opts.margin + 14, y);
    y += lines.length * 5 + 3;
  });
  
  return y + 3;
}

function drawCheckList(doc: jsPDF, items: string[], y: number, opts: PDFOptions): number {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  items.forEach(item => {
    y = addNewPageIfNeeded(doc, y, opts, 12);
    doc.setTextColor(...ORANGE);
    doc.text('[x]', opts.margin + 4, y);
    doc.setTextColor(...DARK);
    doc.text(item, opts.margin + 16, y);
    y += 7;
  });
  
  return y + 3;
}

function drawStep(doc: jsPDF, title: string, items: string[], purpose: string, y: number, opts: PDFOptions): number {
  y = addNewPageIfNeeded(doc, y, opts, 60);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text(title, opts.margin, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  
  items.forEach(item => {
    y = addNewPageIfNeeded(doc, y, opts, 12);
    doc.text('-  ' + item, opts.margin + 5, y);
    y += 6;
  });
  
  if (purpose) {
    y += 2;
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...NAVY);
    doc.text(purpose, opts.margin + 5, y);
    y += 8;
  }
  
  return y + 4;
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
    contentWidth: 170
  };

  let y = 0;

  // ==================== TITLE PAGE ====================
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, opts.pageWidth, opts.pageHeight, 'F');

  // Add logo with correct aspect ratio
  try {
    const logoPath = path.join(process.cwd(), 'attached_assets', 'optimized', 'Dan Bizzarro Method_1749676680719.png');
    if (fs.existsSync(logoPath)) {
      const logoData = fs.readFileSync(logoPath);
      const logoBase64 = logoData.toString('base64');
      // Logo aspect ratio is approximately 4:1 (width:height)
      // Display at 120mm width, 30mm height to maintain proportion
      const logoWidth = 120;
      const logoHeight = 30;
      const logoX = (opts.pageWidth - logoWidth) / 2;
      doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', logoX, 40, logoWidth, logoHeight);
    }
  } catch (err) {
    console.log('Could not load logo for PDF:', err);
  }

  // Title
  doc.setTextColor(...WHITE);
  doc.setFontSize(34);
  doc.setFont('helvetica', 'bold');
  
  doc.text("THE EVENTER'S", opts.pageWidth / 2, 100, { align: 'center' });
  doc.text("WARM-UP SYSTEM", opts.pageWidth / 2, 114, { align: 'center' });

  // Orange accent line
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(3);
  doc.line(50, 124, 160, 124);

  // Subtitle
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text('A simple, reliable warm-up routine for', opts.pageWidth / 2, 145, { align: 'center' });
  doc.text('Dressage, Show Jumping, and Cross-Country', opts.pageWidth / 2, 155, { align: 'center' });

  // Author
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('By Dan Bizzarro', opts.pageWidth / 2, 185, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('International Event Rider & Coach', opts.pageWidth / 2, 197, { align: 'center' });

  // Website
  doc.setFontSize(10);
  doc.setTextColor(170, 170, 170);
  doc.text('www.danbizzarromethod.com', opts.pageWidth / 2, 270, { align: 'center' });

  // ==================== PAGE 2: INTRODUCTION ====================
  doc.addPage();
  y = opts.margin + 10;

  y = drawSectionHeader(doc, '1. INTRODUCTION', y, opts);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);

  const introLines = [
    "Warming up shouldn't feel chaotic. Yet for most riders, it does.",
    "",
    "Busy arenas, tight timings, nerves, and a horse who may feel nothing like",
    "the one you had yesterday.",
    "",
    "This guide gives you a system you can repeat every time you compete.",
    "It keeps things simple, practical, and effective - even when you're",
    "stressed or short on time.",
    "",
    "Everything in here is built around one main idea:"
  ];

  introLines.forEach(line => {
    if (line === "") {
      y += 3;
    } else {
      doc.text(line, opts.margin, y);
      y += 5;
    }
  });

  y += 6;
  y = drawInfoBox(doc, 'Key Principle', 'Transitions are the engine of a good warm-up. Done often and done lightly, they change your horse more quickly than circles, schooling movements, or drilling tests.', y, opts);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('If you only changed one habit in your warm-up, let it be this:', opts.margin, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('More transitions, spread throughout the whole routine.', opts.margin, y);
  y += 14;

  // ==================== HOW TO USE THIS GUIDE ====================
  y = drawSectionHeader(doc, '2. HOW TO USE THIS GUIDE', y, opts);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Use this guide on competition day as a clear plan you can follow step-by-step.', opts.margin, y);
  y += 8;

  doc.text("You'll find:", opts.margin, y);
  y += 7;

  const useGuideItems = [
    'A repeatable structure for each discipline',
    'Simple explanations for why it works',
    'Quick fixes for common problems',
    'A printable one-page summary',
    'The core Dan Bizzarro Method principles woven throughout'
  ];

  y = drawBulletList(doc, useGuideItems, y, opts);

  y += 4;
  y = drawHighlightBox(doc, 'THE GOLDEN RULE', [
    'If in doubt, do a transition.',
    'If it feels wrong, do a transition.',
    'If it feels right - reward, breathe, carry on.'
  ], y, opts);

  // ==================== PAGE 3: WARM-UP PRINCIPLES ====================
  doc.addPage();
  y = opts.margin + 10;

  y = drawSectionHeader(doc, '3. WARM-UP PRINCIPLES', y, opts);

  const principles = [
    { num: '1', title: 'Keep everything repeatable', desc: 'Your horse should recognise the structure of your warm-up. It creates confidence and predictability.' },
    { num: '2', title: 'Create a soft neck before everything else', desc: 'A relaxed neck gives you access to the shoulders, back, and hind legs.' },
    { num: '3', title: "Don't chase a shape", desc: 'Let rhythm and relaxation give you the outline - not pulling, driving, or forcing.' },
    { num: '4', title: 'Use transitions early and often', desc: "They're the quickest way to build balance, connection, and focus." },
    { num: '5', title: "Don't over-school before competing", desc: "You're preparing the body and brain, not re-training." },
    { num: '6', title: 'End on a good note', desc: 'Finish with softness, straightness, and one clear positive feeling.' }
  ];

  principles.forEach(p => {
    y = addNewPageIfNeeded(doc, y, opts, 28);
    
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(opts.margin, y, opts.contentWidth, 22, 3, 3, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ORANGE);
    doc.text(p.num + '.', opts.margin + 6, y + 9);
    
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(p.title, opts.margin + 16, y + 9);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    const descLines = doc.splitTextToSize(p.desc, opts.contentWidth - 22);
    doc.text(descLines, opts.margin + 16, y + 16);
    
    y += 26;
  });

  // ==================== WHY TRANSITIONS MATTER ====================
  y += 6;
  y = drawSectionHeader(doc, '4. WHY TRANSITIONS MATTER', y, opts);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text("Most riders know transitions are important, but very few actually use them", opts.margin, y);
  y += 5;
  doc.text("enough - especially when warming up. Here's what transitions give you:", opts.margin, y);
  y += 8;

  const transitionBenefits = [
    'Balance without tension',
    'Engagement without speed',
    'More control in busy warm-up rings',
    'A quick way to soften the back and neck',
    'Better straightness instantly',
    'A more adjustable canter for jumping',
    'A focused mind for spooky or sharp horses',
    'A better connection with fewer aids'
  ];

  y = drawCheckList(doc, transitionBenefits, y, opts);

  y += 3;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('They are the quickest, kindest, and most effective tool you have.', opts.margin, y);

  // ==================== PAGE 4: WARM-UP OVERVIEW TABLE ====================
  doc.addPage();
  y = opts.margin + 10;

  y = drawSectionHeader(doc, '5. WARM-UP OVERVIEW TABLE', y, opts);

  // Table
  const tableHeaders = ['Phase', 'Dressage', 'Show Jumping', 'Cross-Country'];
  const tableData = [
    ['Walk', '8-12 mins', '5 mins', '5-10 mins'],
    ['Trot', '8-10 mins', '5 mins', '5 mins'],
    ['Canter', '5-7 mins', '5-7 mins', '7-10 mins'],
    ['Specific work', '10 mins', '10-15 mins', '10-12 mins'],
    ['Final prep', '2-3 mins', '2-3 mins', '2-3 mins']
  ];

  const colWidths = [42, 42, 43, 43];
  const rowHeight = 11;
  let tableX = opts.margin;

  // Header row
  doc.setFillColor(...NAVY);
  doc.roundedRect(tableX, y, opts.contentWidth, rowHeight, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  
  let xPos = tableX;
  tableHeaders.forEach((header, i) => {
    doc.text(header, xPos + 5, y + 7);
    xPos += colWidths[i];
  });
  y += rowHeight;

  // Data rows
  doc.setFont('helvetica', 'normal');
  tableData.forEach((row, rowIndex) => {
    if (rowIndex % 2 === 0) {
      doc.setFillColor(...LIGHT_GRAY);
    } else {
      doc.setFillColor(...WHITE);
    }
    doc.rect(tableX, y, opts.contentWidth, rowHeight, 'F');
    
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.rect(tableX, y, opts.contentWidth, rowHeight, 'S');
    
    xPos = tableX;
    row.forEach((cell, i) => {
      if (i === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...NAVY);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...DARK);
      }
      doc.text(cell, xPos + 5, y + 7);
      xPos += colWidths[i];
    });
    y += rowHeight;
  });

  y += 12;
  y = drawHighlightBox(doc, 'KEY INSIGHT', [
    'Transitions are woven into every phase, not just at the end.',
    'Use them to check balance, wake the hind legs, or settle the brain.'
  ], y, opts);

  // ==================== PAGE 5: DRESSAGE WARM-UP ====================
  doc.addPage();
  y = opts.margin + 10;

  y = drawSectionHeader(doc, '6. DRESSAGE WARM-UP ROUTINE', y, opts);

  y = drawInfoBox(doc, 'Goal of the Dressage Warm-Up', 'Soft neck - Rhythm and relaxation - Straightness - Horse in front of the leg - Rider breathing and centred', y, opts);

  y = drawStep(doc, '1. Walk (8-12 minutes)', 
    ['Free walk to begin', 'Big bending lines', 'A few steps of leg yield each way', '3-4 walk-halt-walk transitions', 'One or two rein-back then walk on'],
    'Purpose: establish boundaries, softness, and a calm rhythm.', y, opts);

  y = drawStep(doc, '2. Trot (8-10 minutes)',
    ['Large circles', 'Serpentines', 'Frequent changes of rein', 'Trot-walk-trot every 6-8 strides', 'A few 3-second releases (let the horse carry itself)'],
    'Let the trot find its own swing before you organise anything.', y, opts);

  y = drawStep(doc, '3. Canter (5-7 minutes)',
    ['Canter-trot-canter transitions', 'Gear changes: go forward, then bring back, then soften', 'One 20m circle each way'],
    'Think: adjustable, soft, breathing.', y, opts);

  y = drawStep(doc, '4. Specific Work (10 minutes)',
    ['Transitions every few strides to keep balance', '20m circles', 'A few steps of leg yield', 'A couple of lengthened strides', 'Tighten the edges of the connection without forcing a frame'],
    '', y, opts);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.setFontSize(10);
  doc.text('Rule: Never ride a movement until the transition before it feels good.', opts.margin + 5, y - 2);
  y += 8;

  y = drawStep(doc, '5. Pre-Ring Routine (2-3 minutes)',
    ['One upward, one downward transition', 'Stretch the neck down', 'Straighten on a long side', 'Walk towards the ring with a calm, organised horse'],
    '', y, opts);

  y = drawNavyBox(doc, 'QUICK FIXES', [
    'Tension: 20m circles + trot-walk-trot transitions',
    'Behind the leg: quick upward transitions',
    'Leaning or heavy: upward transition then release',
    'Hollow: bigger lines + soft neck + transitions'
  ], y, opts);

  // ==================== PAGE 6: SHOW JUMPING WARM-UP ====================
  doc.addPage();
  y = opts.margin + 10;

  y = drawSectionHeader(doc, '7. SHOW JUMPING WARM-UP', y, opts);

  y = drawInfoBox(doc, 'Goal of the SJ Warm-Up', 'Adjustability - Balance before and after fences - Straightness - A canter you can ride forward or bring back', y, opts);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Why Transitions Matter in SJ - They create:', opts.margin, y);
  y += 7;
  
  const sjBenefits = ['The canter you jump from', 'Control in a busy warm-up', 'Softness without losing power', 'Straightness without fighting', 'A "thinking" horse rather than a reactive one'];
  y = drawBulletList(doc, sjBenefits, y, opts);
  y += 3;

  y = drawStep(doc, '1. Walk (5 minutes)',
    ['A few walk-halt-walk transitions', 'One or two rein-back then walk on', 'Gentle bending'],
    '', y, opts);

  y = drawStep(doc, '2. Trot (5 minutes)',
    ['Figure-of-eights', 'Trot-walk-trot every 6-8 strides', 'Softening the neck'],
    '', y, opts);

  y = drawStep(doc, '3. Canter (5-7 minutes) - The most important part before fences',
    ['Canter-trot-canter transitions', 'Gear changes: "wait" for 3-4 strides then "go" 3-4 strides', 'Straight lines with a soft neck', 'Keep hands soft after each transition'],
    '', y, opts);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.setFontSize(10);
  doc.text("No horse should jump until you've had three good transitions in a row.", opts.margin, y - 2);
  y += 10;

  y = drawStep(doc, '4. Jump Warm-Up (10-12 minutes)',
    ['Crosspole twice', 'Upright small', 'Upright mid-height', 'Oxer small', 'Oxer at competition height', 'Optional: 1-2 bigger for confidence'],
    '', y, opts);

  y = drawHighlightBox(doc, '', [
    'After every jump: Land, wait, straighten, ride away.',
    'This is the Dan Bizzarro Method: balance before and after the fence.'
  ], y, opts);

  // ==================== PAGE 7: CROSS-COUNTRY WARM-UP ====================
  doc.addPage();
  y = opts.margin + 10;

  y = drawSectionHeader(doc, '8. CROSS-COUNTRY WARM-UP', y, opts);

  y = drawInfoBox(doc, 'Goal of the XC Warm-Up', 'Controlled engine - A soft, long neck for balance - A "thinking" canter - Confidence at the first fence', y, opts);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Why Transitions Matter Even More in XC - Because XC creates:', opts.margin, y);
  y += 7;
  
  const xcReasons = ['More adrenaline', 'More forward desire', 'More need for adjustability', 'More need for a balanced gallop'];
  y = drawBulletList(doc, xcReasons, y, opts);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Transitions give you access to the hind legs without killing forward.', opts.margin, y);
  y += 10;

  y = drawStep(doc, '1. Walk (5-10 minutes)',
    ['Long rein', 'Let the horse look', 'Walk-halt-walk', 'A few steps of leg yield'],
    '', y, opts);

  y = drawStep(doc, '2. Trot (5 minutes)',
    ['Rising trot', 'One or two trot-walk-trot transitions', 'Keep it loose and swinging'],
    '', y, opts);

  y = drawStep(doc, '3. Canter (7-10 minutes) - This is where your XC ride is made',
    ['Forward canter, then transition down, then forward again', 'Canter-trot-canter', 'One decent gallop stretch', 'Bring back, soften, breathe', 'Repeat'],
    "You're searching for adjustability, not exhaustion.", y, opts);

  y = drawStep(doc, '4. Jump Warm-Up (10-12 minutes)',
    ['Small fence (maybe twice)', 'Medium fence', 'One at competition height', 'Land, wait, straighten, ride away'],
    '', y, opts);

  y = drawHighlightBox(doc, '', [
    'Before you start XC:',
    'Ask yourself: "Can I wait?" If the answer is yes - you are ready.'
  ], y, opts);

  // ==================== PAGE 8: TROUBLESHOOTING ====================
  doc.addPage();
  y = opts.margin + 10;

  y = drawSectionHeader(doc, '9. TROUBLESHOOTING', y, opts);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Common Warm-Up Problems and Fixes:', opts.margin, y);
  y += 10;

  const problems = [
    { problem: 'Horse is tense or spooky', fix: 'Bigger lines, more transitions, longer walk phase. Avoid corrections - use redirection.' },
    { problem: 'Horse is behind the leg', fix: 'Quick upward transitions, then soften. Walk-trot-walk-trot until sharp.' },
    { problem: 'Horse is rushing or strong', fix: 'Down transitions every few strides. Canter-trot-canter. Keep your body soft.' },
    { problem: 'Horse won\'t connect', fix: 'Soft neck first. Transitions to the hand, not pulling.' },
    { problem: 'Rider is stressed', fix: 'Breathe out. Simplify the plan. Focus on one good transition.' },
    { problem: 'Short on time', fix: 'Transitions from walk, straight to canter work. Skip trot if needed.' }
  ];

  problems.forEach(p => {
    y = addNewPageIfNeeded(doc, y, opts, 25);
    
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(opts.margin, y, opts.contentWidth, 20, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ORANGE);
    doc.text(p.problem, opts.margin + 6, y + 7);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    doc.setFontSize(9);
    const fixLines = doc.splitTextToSize('> ' + p.fix, opts.contentWidth - 14);
    doc.text(fixLines, opts.margin + 6, y + 14);
    
    y += 24;
  });

  y += 6;
  y = drawHighlightBox(doc, 'REMEMBER', [
    'Every warm-up is different.',
    'Trust the structure - but stay flexible with the details.'
  ], y, opts);

  // ==================== PAGE 9: ONE-PAGE SUMMARY ====================
  doc.addPage();
  y = opts.margin + 10;

  y = drawSectionHeader(doc, '10. ONE-PAGE SUMMARY', y, opts);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...DARK);
  doc.text('Print this page and keep it in your lorry.', opts.margin, y);
  y += 10;

  // Summary boxes for each discipline
  const summaryBoxHeight = 62;
  
  // Dressage
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, summaryBoxHeight, 4, 4, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('DRESSAGE', opts.margin + 6, y + 10);
  
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
    doc.text(line, opts.margin + 6, boxY);
    boxY += 8;
  });
  y += summaryBoxHeight + 6;

  // Show Jumping
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, summaryBoxHeight, 4, 4, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('SHOW JUMPING', opts.margin + 6, y + 10);
  
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
    doc.text(line, opts.margin + 6, boxY);
    boxY += 8;
  });
  y += summaryBoxHeight + 6;

  // Cross-Country
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, summaryBoxHeight, 4, 4, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('CROSS-COUNTRY', opts.margin + 6, y + 10);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const xcSummary = [
    'Walk (5-10 min): Long rein > walk-halt-walk',
    'Trot (5 min): Rising trot > trot-walk-trot',
    'Canter (7-10 min): Forward > back > gallop > collect',
    'Jumps (10-12 min): Small > medium > height',
    'Test: "Can I wait?" If yes - you are ready.'
  ];
  boxY = y + 18;
  xcSummary.forEach(line => {
    doc.text(line, opts.margin + 6, boxY);
    boxY += 8;
  });

  // ==================== FINAL PAGE ====================
  doc.addPage();
  y = opts.margin + 10;

  y = drawSectionHeader(doc, 'FINAL THOUGHTS', y, opts);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  
  doc.text("A good warm-up isn't about making the horse perfect - it's about making", opts.margin, y);
  y += 5;
  doc.text("the horse ready.", opts.margin, y);
  y += 10;
  
  doc.text("If you can leave the warm-up ring with a horse that is:", opts.margin, y);
  y += 8;

  const readyItems = ['Soft in the neck', 'Listening to the leg', 'Balanced in the transitions', 'And still breathing...'];
  y = drawCheckList(doc, readyItems, y, opts);

  y += 3;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text("...then you've done your job.", opts.margin, y);
  y += 16;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Good luck, ride well, and trust your training.', opts.margin, y);
  y += 20;

  // Sign off
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('Dan Bizzarro', opts.margin, y);
  y += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('International Event Rider & Coach', opts.margin, y);
  y += 5;
  doc.text('www.danbizzarromethod.com', opts.margin, y);

  // Footer box
  y += 20;
  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 35, 4, 4, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('Ready for More?', opts.margin + 8, y + 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Book a clinic or private lesson to work on your warm-up in person.', opts.margin + 8, y + 21);
  doc.text('Visit: www.danbizzarromethod.com/coaching', opts.margin + 8, y + 29);

  // Return as buffer
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}
