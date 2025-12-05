import { jsPDF } from 'jspdf';

const NAVY = [30, 41, 59] as const;
const ORANGE = [234, 88, 12] as const;
const DARK = [51, 51, 51] as const;
const LIGHT_GRAY = [248, 250, 252] as const;

interface PDFOptions {
  margin: number;
  pageWidth: number;
  pageHeight: number;
  contentWidth: number;
}

function addNewPageIfNeeded(doc: jsPDF, y: number, opts: PDFOptions, requiredSpace: number = 30): number {
  if (y > opts.pageHeight - opts.margin - requiredSpace) {
    doc.addPage();
    return opts.margin + 10;
  }
  return y;
}

function drawHorizontalLine(doc: jsPDF, y: number, opts: PDFOptions, color: readonly [number, number, number] = ORANGE): void {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.5);
  doc.line(opts.margin, y, opts.margin + opts.contentWidth, y);
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

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  
  const title = "THE EVENTER'S";
  const title2 = "WARM-UP SYSTEM";
  doc.text(title, opts.pageWidth / 2, 80, { align: 'center' });
  doc.text(title2, opts.pageWidth / 2, 95, { align: 'center' });

  // Orange accent line
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(2);
  doc.line(60, 105, 150, 105);

  // Subtitle
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('A simple, reliable warm-up routine for', opts.pageWidth / 2, 125, { align: 'center' });
  doc.text('Dressage, Show Jumping, and Cross-Country', opts.pageWidth / 2, 133, { align: 'center' });

  // Author
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('By Dan Bizzarro', opts.pageWidth / 2, 160, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('International Event Rider & Coach', opts.pageWidth / 2, 170, { align: 'center' });

  // Website
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('www.danbizzarromethod.com', opts.pageWidth / 2, 270, { align: 'center' });

  // ==================== PAGE 2: INTRODUCTION ====================
  doc.addPage();
  y = opts.margin;

  // Section header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('1. INTRODUCTION', opts.margin, y + 10);
  y += 20;
  drawHorizontalLine(doc, y, opts);
  y += 15;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);

  const introText = [
    "Warming up shouldn't feel chaotic. Yet for most riders, it does.",
    "Busy arenas, tight timings, nerves, and a horse who may feel nothing like the one you had yesterday.",
    "",
    "This guide gives you a system you can repeat every time you compete.",
    "It keeps things simple, practical, and effective — even when you're stressed or short on time.",
    "",
    "Everything in here is built around one main idea:"
  ];

  introText.forEach(line => {
    if (line === "") {
      y += 5;
    } else {
      const lines = doc.splitTextToSize(line, opts.contentWidth);
      doc.text(lines, opts.margin, y);
      y += lines.length * 6;
    }
  });

  y += 5;
  // Highlighted box
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 25, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Transitions are the engine of a good warm-up.', opts.margin + 5, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  const boxText = doc.splitTextToSize('Done often and done lightly, they change your horse more quickly than circles, schooling movements, or drilling tests.', opts.contentWidth - 10);
  doc.text(boxText, opts.margin + 5, y + 18);
  y += 35;

  const introText2 = [
    "If you only changed one habit in your warm-up, let it be this:",
    "more transitions, spread throughout the whole routine."
  ];

  doc.setFontSize(11);
  introText2.forEach(line => {
    const lines = doc.splitTextToSize(line, opts.contentWidth);
    doc.text(lines, opts.margin, y);
    y += lines.length * 6;
  });

  // ==================== HOW TO USE THIS GUIDE ====================
  y += 15;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('2. HOW TO USE THIS GUIDE', opts.margin, y);
  y += 10;
  drawHorizontalLine(doc, y, opts);
  y += 12;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Use this guide on competition day as a clear plan you can follow step-by-step.', opts.margin, y);
  y += 10;

  doc.text("You'll find:", opts.margin, y);
  y += 8;

  const useGuideItems = [
    'A repeatable structure for each discipline',
    'Simple explanations for why it works',
    'Quick fixes for common problems',
    'A printable one-page summary',
    'The core Dan Bizzarro Method principles woven throughout'
  ];

  useGuideItems.forEach(item => {
    doc.setTextColor(...ORANGE);
    doc.text('•', opts.margin + 5, y);
    doc.setTextColor(...DARK);
    doc.text(item, opts.margin + 12, y);
    y += 7;
  });

  y += 10;
  // Golden rule box
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 30, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('THE GOLDEN RULE', opts.margin + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('If in doubt, do a transition.', opts.margin + 5, y + 15);
  doc.text('If it feels wrong, do a transition.', opts.margin + 5, y + 21);
  doc.text('If it feels right — reward, breathe, carry on.', opts.margin + 5, y + 27);

  // ==================== PAGE 3: WARM-UP PRINCIPLES ====================
  doc.addPage();
  y = opts.margin;

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('3. WARM-UP PRINCIPLES', opts.margin, y + 10);
  y += 20;
  drawHorizontalLine(doc, y, opts);
  y += 15;

  const principles = [
    { num: '1', title: 'Keep everything repeatable', desc: 'Your horse should recognise the structure of your warm-up. It creates confidence and predictability.' },
    { num: '2', title: 'Create a soft neck before everything else', desc: 'A relaxed neck gives you access to the shoulders, back, and hind legs. Without softness, the rest becomes harder.' },
    { num: '3', title: "Don't chase a shape", desc: 'Let rhythm and relaxation give you the outline — not pulling, driving, or forcing.' },
    { num: '4', title: 'Use transitions early and often', desc: "They're the quickest way to build balance, connection, and focus without tiring your horse." },
    { num: '5', title: "Don't over-school before competing", desc: "You're preparing the body and brain, not re-training." },
    { num: '6', title: 'End on a good note', desc: 'Finish with softness, straightness, and one clear positive feeling.' }
  ];

  principles.forEach(p => {
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(opts.margin, y, opts.contentWidth, 18, 2, 2, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ORANGE);
    doc.text(p.num + '.', opts.margin + 5, y + 7);
    
    doc.setTextColor(...NAVY);
    doc.text(p.title, opts.margin + 15, y + 7);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    const descLines = doc.splitTextToSize(p.desc, opts.contentWidth - 20);
    doc.text(descLines, opts.margin + 15, y + 13);
    
    y += 22;
  });

  // ==================== WHY TRANSITIONS MATTER ====================
  y += 10;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('4. WHY TRANSITIONS MATTER', opts.margin, y);
  y += 10;
  drawHorizontalLine(doc, y, opts);
  y += 12;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const transIntro = doc.splitTextToSize("Most riders know transitions are important, but very few actually use them enough — especially when warming up. Here's what transitions give you:", opts.contentWidth);
  doc.text(transIntro, opts.margin, y);
  y += transIntro.length * 6 + 5;

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

  transitionBenefits.forEach(item => {
    doc.setTextColor(...ORANGE);
    doc.text('✓', opts.margin + 5, y);
    doc.setTextColor(...DARK);
    doc.text(item, opts.margin + 15, y);
    y += 7;
  });

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  const summary = 'They are the quickest, kindest, and most effective tool you have.';
  doc.text(summary, opts.margin, y);

  // ==================== PAGE 4: WARM-UP OVERVIEW TABLE ====================
  doc.addPage();
  y = opts.margin;

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('5. WARM-UP OVERVIEW TABLE', opts.margin, y + 10);
  y += 20;
  drawHorizontalLine(doc, y, opts);
  y += 15;

  // Table
  const tableHeaders = ['Phase', 'Dressage', 'Show Jumping', 'Cross-Country'];
  const tableData = [
    ['Walk', '8–12 mins', '5 mins', '5–10 mins'],
    ['Trot', '8–10 mins', '5 mins', '5 mins'],
    ['Canter', '5–7 mins', '5–7 mins', '7–10 mins'],
    ['Specific exercises', '10 mins', '10–15 mins', '10–12 mins'],
    ['Final prep', '2–3 mins', '2–3 mins', '2–3 mins']
  ];

  const colWidths = [40, 40, 45, 45];
  const rowHeight = 10;
  let tableX = opts.margin;

  // Header row
  doc.setFillColor(...NAVY);
  doc.rect(tableX, y, opts.contentWidth, rowHeight, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  
  let xPos = tableX;
  tableHeaders.forEach((header, i) => {
    doc.text(header, xPos + 3, y + 7);
    xPos += colWidths[i];
  });
  y += rowHeight;

  // Data rows
  doc.setFont('helvetica', 'normal');
  tableData.forEach((row, rowIndex) => {
    if (rowIndex % 2 === 0) {
      doc.setFillColor(...LIGHT_GRAY);
      doc.rect(tableX, y, opts.contentWidth, rowHeight, 'F');
    }
    
    xPos = tableX;
    row.forEach((cell, i) => {
      if (i === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...NAVY);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...DARK);
      }
      doc.text(cell, xPos + 3, y + 7);
      xPos += colWidths[i];
    });
    y += rowHeight;
  });

  y += 15;
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 22, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('KEY INSIGHT', opts.margin + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const keyInsight = doc.splitTextToSize('Transitions are woven into every phase, not just at the end. Use them to check balance, wake the hind legs, connect the line, or settle the brain.', opts.contentWidth - 10);
  doc.text(keyInsight, opts.margin + 5, y + 15);

  // ==================== PAGE 5: DRESSAGE WARM-UP ====================
  doc.addPage();
  y = opts.margin;

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('6. DRESSAGE WARM-UP ROUTINE', opts.margin, y + 10);
  y += 20;
  drawHorizontalLine(doc, y, opts);
  y += 15;

  // Goal box
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 30, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Goal of the Dressage Warm-Up', opts.margin + 5, y + 8);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Soft neck  •  Rhythm and relaxation  •  Straightness  •  Horse in front of the leg  •  Rider breathing and centred', opts.margin + 5, y + 18);
  y += 40;

  // Step by step
  const dressageSteps = [
    { title: '1. Walk (8–12 minutes)', items: ['Free walk to begin', 'Big bending lines', 'A few steps of leg yield each way', '3–4 walk–halt–walk transitions', 'One or two rein-back → walk on'], purpose: 'Purpose: establish boundaries, softness, and a calm rhythm.' },
    { title: '2. Trot (8–10 minutes)', items: ['Large circles', 'Serpentines', 'Frequent changes of rein', 'Trot–walk–trot every 6–8 strides', 'A few 3-second releases (let the horse carry itself)'], purpose: 'Let the trot find its own swing before you organise anything.' },
    { title: '3. Canter (5–7 minutes)', items: ['Canter–trot–canter transitions', 'Gear changes: go forward → bring back → soften', 'One 20m circle each way'], purpose: 'Think: adjustable, soft, breathing.' }
  ];

  dressageSteps.forEach(step => {
    y = addNewPageIfNeeded(doc, y, opts, 50);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ORANGE);
    doc.text(step.title, opts.margin, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    
    step.items.forEach(item => {
      doc.text('•  ' + item, opts.margin + 5, y);
      y += 6;
    });
    
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...NAVY);
    doc.text(step.purpose, opts.margin + 5, y);
    y += 12;
  });

  // More dressage steps
  y = addNewPageIfNeeded(doc, y, opts, 60);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('4. Specific Work (10 minutes)', opts.margin, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const specificItems = ['Transitions every few strides to keep balance', '20m circles', 'A few steps of leg yield', 'A couple of lengthened strides', 'Tighten the edges of the connection without forcing a frame'];
  specificItems.forEach(item => {
    doc.text('•  ' + item, opts.margin + 5, y);
    y += 6;
  });
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Rule: Never ride a movement until the transition before it feels good.', opts.margin + 5, y);
  y += 12;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('5. Pre-Ring Routine (2–3 minutes)', opts.margin, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const preRingItems = ['One upward, one downward transition', 'Stretch the neck down', 'Straighten on a long side', 'Walk towards the ring with a calm, organised horse'];
  preRingItems.forEach(item => {
    doc.text('•  ' + item, opts.margin + 5, y);
    y += 6;
  });

  // Quick fixes
  y += 10;
  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 35, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('QUICK FIXES', opts.margin + 5, y + 8);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Tension: 20m circles + trot–walk–trot transitions', opts.margin + 5, y + 16);
  doc.text('Behind the leg: quick upward transitions', opts.margin + 5, y + 22);
  doc.text('Leaning or heavy: upward transition → release', opts.margin + 5, y + 28);
  doc.text('Hollow: bigger lines + soft neck + transitions', opts.margin + 100, y + 16);

  // ==================== PAGE 6: SHOW JUMPING WARM-UP ====================
  doc.addPage();
  y = opts.margin;

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('7. SHOW JUMPING WARM-UP', opts.margin, y + 10);
  y += 20;
  drawHorizontalLine(doc, y, opts);
  y += 15;

  // Goal box
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 25, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Goal of the SJ Warm-Up', opts.margin + 5, y + 8);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Adjustability  •  Balance before and after fences  •  Straightness  •  A canter you can ride forward or bring back', opts.margin + 5, y + 18);
  y += 35;

  // Why transitions matter
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Why Transitions Matter in SJ — They create:', opts.margin, y);
  y += 8;
  
  const sjBenefits = ['The canter you jump from', 'Control in a busy warm-up', 'Softness without losing power', 'Straightness without fighting', 'A "thinking" horse rather than a reactive one'];
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  sjBenefits.forEach(item => {
    doc.setTextColor(...ORANGE);
    doc.text('•', opts.margin + 5, y);
    doc.setTextColor(...DARK);
    doc.text(item, opts.margin + 12, y);
    y += 6;
  });
  y += 10;

  // Steps
  const sjSteps = [
    { title: '1. Walk (5 minutes)', items: ['A few walk–halt–walk transitions', 'One or two rein-back → walk on', 'Gentle bending'] },
    { title: '2. Trot (5 minutes)', items: ['Figure-of-eights', 'Trot–walk–trot every 6–8 strides', 'Softening the neck'] },
    { title: '3. Canter (5–7 minutes) — The most important part before fences', items: ['Canter–trot–canter transitions', 'Gear changes ("wait" for 3–4 strides → "go" 3–4 strides)', 'Straight lines with a soft neck', 'Keep hands soft after each transition'] }
  ];

  sjSteps.forEach(step => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ORANGE);
    doc.text(step.title, opts.margin, y);
    y += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    step.items.forEach(item => {
      doc.text('•  ' + item, opts.margin + 5, y);
      y += 6;
    });
    y += 5;
  });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('No horse should jump until you\'ve had three good transitions in a row.', opts.margin, y);
  y += 12;

  // Jump warm-up
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('4. Jump Warm-Up (10–12 minutes)', opts.margin, y);
  y += 7;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const jumpItems = ['Crosspole twice', 'Upright small', 'Upright mid-height', 'Oxer small', 'Oxer at competition height', 'Optional: 1–2 bigger for confidence'];
  jumpItems.forEach(item => {
    doc.text('•  ' + item, opts.margin + 5, y);
    y += 6;
  });

  y += 5;
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 18, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('After every jump: Land → wait → straight → ride away.', opts.margin + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text('This is the Dan Bizzarro Method: balance before and after the fence.', opts.margin + 5, y + 14);

  // ==================== PAGE 7: CROSS-COUNTRY WARM-UP ====================
  doc.addPage();
  y = opts.margin;

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('8. CROSS-COUNTRY WARM-UP', opts.margin, y + 10);
  y += 20;
  drawHorizontalLine(doc, y, opts);
  y += 15;

  // Goal box
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 22, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Goal of the XC Warm-Up', opts.margin + 5, y + 8);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Controlled engine  •  A soft, long neck for balance  •  A "thinking" canter  •  Confidence at the first fence', opts.margin + 5, y + 16);
  y += 32;

  // Why transitions matter
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Why Transitions Matter Even More in XC — Because XC creates:', opts.margin, y);
  y += 8;
  
  const xcReasons = ['More adrenaline', 'More forward desire', 'More need for adjustability', 'More need for a balanced gallop'];
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  xcReasons.forEach(item => {
    doc.setTextColor(...ORANGE);
    doc.text('•', opts.margin + 5, y);
    doc.setTextColor(...DARK);
    doc.text(item, opts.margin + 12, y);
    y += 6;
  });
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  y += 3;
  doc.text('Transitions give you access to the hind legs without killing forward.', opts.margin, y);
  y += 12;

  // Steps
  const xcSteps = [
    { title: '1. Walk (5–10 minutes)', items: ['Long rein', 'Let the horse look', 'Walk–halt–walk', 'A few steps of leg yield'] },
    { title: '2. Trot (5 minutes)', items: ['Rising trot', 'One or two trot–walk–trot transitions', 'Keep it loose and swinging'] },
    { title: '3. Canter (7–10 minutes) — This is where your XC ride is made', items: ['Forward canter → transition down → forward again', 'Canter–trot–canter', 'One decent gallop stretch', 'Bring back, soften, breathe', 'Repeat'] }
  ];

  xcSteps.forEach(step => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ORANGE);
    doc.text(step.title, opts.margin, y);
    y += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    step.items.forEach(item => {
      doc.text('•  ' + item, opts.margin + 5, y);
      y += 6;
    });
    y += 5;
  });

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...NAVY);
  doc.text("You're searching for adjustability, not exhaustion.", opts.margin, y);
  y += 12;

  // Jump warm-up
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('4. Jump Warm-Up (10–12 minutes)', opts.margin, y);
  y += 7;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const xcJumpItems = ['Small log', 'Log with canter away', 'Step / brush-type element if available', 'Small table', 'One combination', 'One bigger table only if you need confidence'];
  xcJumpItems.forEach(item => {
    doc.text('•  ' + item, opts.margin + 5, y);
    y += 6;
  });

  y += 5;
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 12, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('After every fence: Downward transition within 3–5 strides. This is your control system.', opts.margin + 5, y + 8);

  // ==================== PAGE 8: TROUBLESHOOTING ====================
  doc.addPage();
  y = opts.margin;

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('9. COMPETITION-DAY', opts.margin, y + 10);
  doc.text('TROUBLESHOOTING', opts.margin, y + 22);
  y += 32;
  drawHorizontalLine(doc, y, opts);
  y += 15;

  const troubleshooting = [
    { problem: "If you're running late:", solution: "Skip everything except transitions. You'll get 80% of the benefit in 3 minutes." },
    { problem: "If your horse is too fresh:", solution: "Transitions settle the mind without shutting down the engine." },
    { problem: "If your horse feels tired:", solution: "Transitions wake the hind legs without draining energy." },
    { problem: "If your horse is spooky:", solution: "Transitions give predictability — spooky horses love predictability." },
    { problem: "If the warm-up ring is chaos:", solution: "Ride your transitions, find a pocket of space, and stay in your bubble." }
  ];

  troubleshooting.forEach(item => {
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(opts.margin, y, opts.contentWidth, 20, 2, 2, 'F');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ORANGE);
    doc.text(item.problem, opts.margin + 5, y + 7);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    doc.text(item.solution, opts.margin + 5, y + 15);
    
    y += 25;
  });

  // ==================== PAGE 9: ONE-PAGE SUMMARY ====================
  doc.addPage();
  y = opts.margin;

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('10. ONE-PAGE SUMMARY', opts.margin, y + 10);
  y += 20;
  drawHorizontalLine(doc, y, opts);
  y += 15;

  // Golden rule box
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 35, 3, 3, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('THE GOLDEN RULE', opts.margin + 5, y + 10);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('If in doubt, do a transition.', opts.margin + 5, y + 18);
  doc.text('If it feels wrong, do a transition.', opts.margin + 5, y + 25);
  doc.text('If it feels right — reward, breathe, carry on.', opts.margin + 5, y + 32);
  y += 45;

  // Three columns for summaries
  const colWidth = 55;
  const summaries = [
    { title: 'DRESSAGE', items: ['Walk: boundaries + softness', 'Trot: transitions every 6–8 strides', 'Canter: gear changes', 'Specific pieces: only after a good transition'] },
    { title: 'SHOW JUMPING', items: ['Canter transitions before jumping', 'Land → wait → straight → ride away', 'One quiet fence before you finish'] },
    { title: 'CROSS-COUNTRY', items: ['Build adjustability in canter', 'Downward transition after every fence', 'Forward, thinking, listening'] }
  ];

  let colX = opts.margin;
  summaries.forEach(summary => {
    doc.setFillColor(...NAVY);
    doc.roundedRect(colX, y, colWidth, 12, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(summary.title, colX + 3, y + 8);
    
    let itemY = y + 18;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    summary.items.forEach(item => {
      const lines = doc.splitTextToSize('• ' + item, colWidth - 6);
      doc.text(lines, colX + 3, itemY);
      itemY += lines.length * 5;
    });
    
    colX += colWidth + 2.5;
  });

  // ==================== PAGE 10: ABOUT ====================
  doc.addPage();
  y = opts.margin;

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('11. ABOUT THE DAN', opts.margin, y + 10);
  doc.text('BIZZARRO METHOD', opts.margin, y + 22);
  y += 32;
  drawHorizontalLine(doc, y, opts);
  y += 15;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  
  const aboutText = [
    "The Dan Bizzarro Method is built around clear communication, soft boundaries, and simple systems that help riders feel calm, confident, and in control.",
    "",
    "My approach is grounded in the classical principles of eventing and shaped by years working with top riders and coaches, from William Fox-Pitt to Caroline Moore and Ian Woodhead. Whether I'm coaching amateurs or international competitors, the goal is always the same: help riders understand their horses better, make better decisions, and make the sport feel easier.",
    "",
    "If you want more support — clinics, virtual coaching, and structured training sessions — you'll find everything on the Dan Bizzarro Method website."
  ];

  aboutText.forEach(para => {
    if (para === "") {
      y += 8;
    } else {
      const lines = doc.splitTextToSize(para, opts.contentWidth);
      doc.text(lines, opts.margin, y);
      y += lines.length * 6;
    }
  });

  y += 20;
  // CTA box
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 30, 3, 3, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Ready to take your riding further?', opts.margin + 5, y + 12);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Visit www.danbizzarromethod.com to book a lesson or find a clinic near you.', opts.margin + 5, y + 22);

  // Footer on last page
  y = opts.pageHeight - 15;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('© Dan Bizzarro Method. All rights reserved.', opts.pageWidth / 2, y, { align: 'center' });

  // Return as buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
