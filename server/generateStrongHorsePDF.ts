import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

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

function drawPageHeader(doc: jsPDF, title: string, opts: PDFOptions, secondLine?: string): number {
  let y = opts.margin + 5;
  
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(title, opts.margin, y);
  
  if (secondLine) {
    y += 9;
    doc.text(secondLine, opts.margin, y);
  }
  
  y += 5;
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(2);
  doc.line(opts.margin, y, opts.margin + 60, y);
  
  return y + 15;
}

function drawBigHighlightBox(doc: jsPDF, lines: string[], y: number, opts: PDFOptions): number {
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

function drawQuoteBox(doc: jsPDF, quote: string, y: number, opts: PDFOptions): number {
  const padding = 10;
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(quote, opts.contentWidth - padding * 2 - 8);
  const boxHeight = lines.length * 6 + padding * 2;
  
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 5, 5, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(lines, opts.margin + padding, y + padding + 5);
  
  return y + boxHeight + 8;
}

function drawNavyQuoteBox(doc: jsPDF, title: string, lines: string[], y: number, opts: PDFOptions): number {
  const padding = 10;
  const titleHeight = title ? 12 : 0;
  const lineHeight = 7;
  const boxHeight = titleHeight + lines.length * lineHeight + padding * 2;
  
  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 5, 5, 'F');
  
  let textY = y + padding;
  
  if (title) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ORANGE);
    doc.text(title, opts.margin + padding, textY + 5);
    textY += titleHeight;
  }
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...WHITE);
  lines.forEach(line => {
    doc.text(line, opts.margin + padding, textY + 4);
    textY += lineHeight;
  });
  
  return y + boxHeight + 8;
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

function drawNumberedList(doc: jsPDF, items: string[], y: number, opts: PDFOptions): number {
  items.forEach((item, index) => {
    const circleX = opts.margin + 8;
    const circleY = y - 1;
    
    doc.setFillColor(...ORANGE);
    doc.circle(circleX, circleY, 4, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(String(index + 1), circleX - 1.5, y + 0.5);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(item, opts.contentWidth - 24);
    doc.text(lines, opts.margin + 18, y);
    y += lines.length * 4.5 + 6;
  });
  
  return y;
}

function drawIconList(doc: jsPDF, items: string[], y: number, opts: PDFOptions): number {
  doc.setFontSize(10);
  
  items.forEach(item => {
    doc.setFillColor(...ORANGE);
    doc.triangle(opts.margin + 5, y - 2.5, opts.margin + 5, y + 2.5, opts.margin + 10, y, 'F');
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    const lines = doc.splitTextToSize(item, opts.contentWidth - 18);
    doc.text(lines, opts.margin + 15, y + 1);
    y += lines.length * 5 + 5;
  });
  
  return y + 2;
}

function drawCheckList(doc: jsPDF, items: string[], y: number, opts: PDFOptions): number {
  doc.setFontSize(10);
  
  items.forEach(item => {
    doc.setFillColor(...ORANGE);
    doc.roundedRect(opts.margin + 3, y - 3.5, 7, 7, 1, 1, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(String.fromCharCode(0x2713), opts.margin + 4.5, y + 1);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    doc.text(item, opts.margin + 15, y);
    y += 9;
  });
  
  return y + 2;
}

function drawStepCard(doc: jsPDF, stepNum: string, title: string, items: string[], note: string, y: number, opts: PDFOptions): number {
  const padding = 7;
  const itemHeight = items.length * 5.5;
  const noteHeight = note ? 9 : 0;
  const boxHeight = 16 + itemHeight + noteHeight + padding;
  
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 4, 4, 'F');
  
  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin + padding, y + padding, 26, 10, 3, 3, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(stepNum, opts.margin + padding + 3, y + padding + 7);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(title, opts.margin + padding + 30, y + padding + 7);
  
  let itemY = y + padding + 16;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  
  items.forEach(item => {
    doc.setTextColor(...ORANGE);
    doc.text('-', opts.margin + padding + 3, itemY);
    doc.setTextColor(...DARK);
    doc.text(item, opts.margin + padding + 9, itemY);
    itemY += 5.5;
  });
  
  if (note) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...NAVY);
    doc.setFontSize(8);
    doc.text(note, opts.margin + padding + 3, itemY + 1);
  }
  
  return y + boxHeight + 5;
}

function drawExerciseCard(doc: jsPDF, exerciseNum: string, title: string, steps: string[], y: number, opts: PDFOptions): number {
  const padding = 8;
  const stepHeight = steps.length * 5.5;
  const boxHeight = 20 + stepHeight + padding;
  
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, boxHeight, 4, 4, 'F');
  
  doc.setFillColor(...ORANGE);
  doc.roundedRect(opts.margin + padding, y + padding, 28, 10, 3, 3, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(exerciseNum, opts.margin + padding + 3, y + padding + 7);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(title, opts.margin + padding + 32, y + padding + 7);
  
  let stepY = y + padding + 20;
  doc.setFontSize(9);
  
  steps.forEach((step, i) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NAVY);
    doc.text(`${i + 1}.`, opts.margin + padding + 3, stepY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    doc.text(step, opts.margin + padding + 12, stepY);
    stepY += 5.5;
  });
  
  return y + boxHeight + 5;
}

function drawTroubleshootItem(doc: jsPDF, problem: string, solution: string, y: number, opts: PDFOptions): number {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(problem, opts.margin, y);
  
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.setFontSize(9);
  const solutionLines = doc.splitTextToSize(solution, opts.contentWidth);
  doc.text(solutionLines, opts.margin, y);
  
  return y + solutionLines.length * 4.5 + 7;
}

export function generateStrongHorsePDF(): Buffer {
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
    const logoPath = path.join(process.cwd(), 'attached_assets', 'optimized', 'Dan-Bizzarro-Method-trimmed.png');
    if (fs.existsSync(logoPath)) {
      const logoData = fs.readFileSync(logoPath);
      const logoBase64 = logoData.toString('base64');
      const logoWidth = 72;
      const logoHeight = 20;
      const logoX = (opts.pageWidth - logoWidth) / 2;
      doc.addImage(`data:image/png;base64,${logoBase64}`, 'PNG', logoX, 45, logoWidth, logoHeight);
    }
  } catch (err) {
    console.log('Could not load logo:', err);
  }

  doc.setTextColor(...WHITE);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text("THE STRONG HORSE", opts.pageWidth / 2, 100, { align: 'center' });
  doc.text("SOLUTION", opts.pageWidth / 2, 116, { align: 'center' });

  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(3);
  doc.line(50, 126, 160, 126);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('How to turn heaviness and rushing into', opts.pageWidth / 2, 145, { align: 'center' });
  doc.text('balance, softness and control', opts.pageWidth / 2, 156, { align: 'center' });

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('By Your Coach', opts.pageWidth / 2, 185, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('International Event Rider & Coach', opts.pageWidth / 2, 198, { align: 'center' });
  doc.text('The Your Coaching Business', opts.pageWidth / 2, 211, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(170, 170, 170);
  doc.text('https://your-coaching-business.com', opts.pageWidth / 2, 265, { align: 'center' });

  // ==================== PAGE 2: INTRODUCTION ====================
  doc.addPage();
  y = drawPageHeader(doc, 'INTRODUCTION', opts);

  y = drawBigHighlightBox(doc, [
    'Strong horses are not trying to be difficult.',
    'They\'re trying to stay in balance.'
  ], y, opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('A horse becomes heavy, strong, or rushing because:', opts.margin, y);
  y += 8;

  y = drawIconList(doc, [
    'The balance is falling onto the forehand',
    'The neck is tight',
    'The rider is holding instead of organising',
    'The transitions aren\'t clear enough',
    'The self-carriage is not there',
    'The horse is anxious, anticipating, or confused'
  ], y, opts);

  y += 3;
  y = drawQuoteBox(doc, 'You can\'t fix a strong horse by pulling more. You fix a strong horse by teaching self-carriage — the ability to hold their own balance without relying on your hand.', y, opts);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const intro = 'Everything in this guide comes from what I teach every day: clear reactions, balance, straightness, rhythm, and making the horse responsible for carrying itself.';
  const introLines = doc.splitTextToSize(intro, opts.contentWidth);
  doc.text(introLines, opts.margin, y);
  y += introLines.length * 5 + 6;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  const result = 'If you follow these steps, your strong horse will become softer, lighter, more adjustable, and much easier to ride — in flatwork and over fences.';
  const resultLines = doc.splitTextToSize(result, opts.contentWidth);
  doc.text(resultLines, opts.margin, y);

  // ==================== PAGE 3: PART 1 - WHY HORSES GET STRONG ====================
  doc.addPage();
  y = drawPageHeader(doc, 'PART 1 — WHY HORSES GET STRONG', opts);

  y = drawInfoCard(doc, '1. They fall out of balance', 'Strong horses are usually weak through the core, back and hindquarters. When the balance tips forward, the horse must run or lean to stay upright. This has nothing to do with being "naughty" — it\'s simply biomechanics.', y, opts);

  y = drawInfoCard(doc, '2. They brace their neck', 'If the neck is tight, the back tightens. And when the back tightens, the only thing the horse can do is push forward and lean on the rein.', y, opts);

  y = drawInfoCard(doc, '3. The rider holds instead of correcting', 'Holding feels safe in the moment... but it teaches the horse to lean more — and lean harder.', y, opts);

  y += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Instead, focus on:', opts.margin, y);
  y += 8;

  y = drawCheckList(doc, [
    'Clear transitions (1st-second reactions)',
    'A soft neck (forces core, back and hind legs to engage)',
    'Good timing (correct when the horse begins to accelerate)',
    'Short corrections, not long holds',
    'Straightness (a straight horse is always more engaged)',
    'Rhythm (speed does not equal impulsion)',
    'Repetition (lots of small transitions + little lateral steps)'
  ], y, opts);

  y += 3;
  y = drawQuoteBox(doc, 'These are the foundations of the Your Coaching Business.', y, opts);

  // ==================== PAGE 4: PART 2 - THE CORE SYSTEM ====================
  doc.addPage();
  y = drawPageHeader(doc, 'PART 2 — THE CORE SYSTEM', opts);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('"Reset Before You Ride"', opts.margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Your strong-horse warm-up should be simple, calm and repeatable.', opts.margin, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Your first goal is to create:', opts.margin, y);
  y += 8;

  y = drawIconList(doc, [
    'A soft neck',
    'Quicker reactions to the leg',
    'Clear downward transitions',
    'A trot and canter that can wait or go on command'
  ], y, opts);

  y += 3;
  y = drawStepCard(doc, 'STEP 1', 'Walk: Boundaries & Softness (5-8 min)', [
    'Walk-halt-walk: clear but soft, no dragging',
    'A few steps of rein-back (straight), then walk on',
    'Bending lines + small leg-yields',
    'Tight bending loosens the neck',
    'Leg-yields unlock the ribcage and switch on the core'
  ], 'You teach the horse to wait before you ever trot.', y, opts);

  y = drawStepCard(doc, 'STEP 2', 'Trot: Short, Frequent Transitions', [
    'Trot-walk-trot every 5 seconds',
    '"Walk NOW. Trot NOW." No hesitation, no negotiating.',
    'Little leg-yields in and out on lines and circles',
    'Straight lines with 2-3 second softening of the reins'
  ], 'Rebalances the horse, prevents leaning, makes contact lighter.', y, opts);

  // ==================== PAGE 5: PART 2 CONTINUED - CANTER ====================
  doc.addPage();
  y = opts.margin + 5;

  y = drawBigHighlightBox(doc, [
    'The canter is where strong horses truly change.',
    'This is where heaviness becomes obvious —',
    'and where it becomes fixable.'
  ], y, opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Your three canter tools:', opts.margin, y);
  y += 10;

  y = drawInfoCard(doc, '1. Canter-trot-canter transitions', 'The quicker the reaction, the lighter the horse becomes. Don\'t chase roundness here. Fix the reaction first — the shape will follow once the balance improves.', y, opts);

  y = drawInfoCard(doc, '2. Gear changes (3-4 strides "wait", 3-4 strides "go")', 'Be accurate. Three strides means three. "Wait" = rebalance through a clear half-halt. "Go" = push forward from the leg without rushing. Repeat until the horse listens instead of leaning.', y, opts);

  y = drawInfoCard(doc, '3. Straight lines + soft hands', 'Start on circles, but move to straight lines quickly. Strong horses hide on circles — straight lines show the truth.', y, opts);

  y += 3;
  y = drawQuoteBox(doc, '"Organise the canter, then let the horse carry itself." Goal: A canter you can adjust without pulling.', y, opts);

  // ==================== PAGE 6: PART 3 - THE STRONG-HORSE PROGRAM ====================
  doc.addPage();
  y = drawPageHeader(doc, 'PART 3 — THE STRONG-HORSE', opts, 'PROGRAM (FLATWORK)');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Here are your four core exercises. All of them are simple. All of them work immediately.', opts.margin, y);
  y += 5;
  doc.text('All of them build self-carriage.', opts.margin, y);
  y += 12;

  y = drawExerciseCard(doc, 'EX 1', 'The 5-Second Transitions', [
    'Ride forward for 5 seconds (trot from walk, or canter from trot)',
    'Downward transition — immediate, no leaning',
    'Soften the contact — a tiny give',
    'After 5 seconds, ride forward again',
    'Repeat until the horse waits naturally'
  ], y, opts);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...NAVY);
  doc.text('Use this whenever the horse feels strong. Teaches forward from balance — not from falling.', opts.margin, y);
  y += 12;

  y = drawExerciseCard(doc, 'EX 2', 'GO 4 Seconds / WOAH 4 Seconds', [
    'GO for 4 seconds — one gear up, not speed, just energy',
    'WOAH for 4 seconds — clear, immediate downward transition',
    'Soften your contact — give forward with both hands',
    'If the horse rushes: halt, walk after 1 second, halt again',
    'GO again for 4 seconds — be precise'
  ], y, opts);

  y += 3;
  y = drawNavyQuoteBox(doc, 'RULES', [
    'Don\'t hold the horse',
    'The horse must carry itself',
    'Accuracy matters more than effort'
  ], y, opts);

  // ==================== PAGE 7: PART 3 CONTINUED - EXERCISES 3-4 ====================
  doc.addPage();
  y = opts.margin + 5;

  y = drawExerciseCard(doc, 'EX 3', 'Rounder, Softer, Slower (Advanced)', [
    'Bend right until the horse softens — see the inside eye',
    'Hold the flexion long enough for the horse to give',
    'Bend left until the horse softens',
    'Do walk-trot-walk transitions asking for "rounder, softer, slower"'
  ], y, opts);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...NAVY);
  doc.text('Only add this when Exercises 1 & 2 feel easy. If the neck is soft, the body follows.', opts.margin, y);
  y += 12;

  y = drawExerciseCard(doc, 'EX 4', 'The First-Second Reaction (Black or White)', [
    'Check that the horse\'s reaction is exactly what you want in the first second'
  ], y, opts);

  y += 3;
  y = drawInfoCard(doc, 'Ask for TROT', 'WHITE = horse trots instantly, reward. BLACK = horse hesitates, take leg off, leg ON ON, clear reaction, reward.', y, opts);

  y = drawInfoCard(doc, 'Ask for WALK', 'WHITE = immediate walk, soften. BLACK = hesitation, halt, walk after 1 second, halt again, repeat 5 times.', y, opts);

  y += 3;
  y = drawQuoteBox(doc, 'A strong horse with slow reactions will always be strong. Fix this first-second rule and the rest becomes easy.', y, opts);

  // ==================== PAGE 8: PART 4 - JUMPING A STRONG HORSE ====================
  doc.addPage();
  y = drawPageHeader(doc, 'PART 4 — JUMPING A STRONG HORSE', opts);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('These rules come directly from how I teach show jumping and cross-country.', opts.margin, y);
  y += 12;

  y = drawInfoCard(doc, 'Rule 1: Don\'t jump until the canter is adjustable', 'If you can\'t go: up a gear, down a gear, canter to trot, canter to walk without leaning... you\'re not ready to jump. Good canter = safe jump.', y, opts);

  y = drawInfoCard(doc, 'Rule 2: Wait, Straight, Jump', 'When approaching a fence, think: "Wait and straight. Wait and straight." If the horse doesn\'t wait, halt immediately. If the horse drifts, correct the line. If the horse ignores the correction, halt and return to flatwork.', y, opts);

  y += 2;
  y = drawQuoteBox(doc, 'This makes the horse think instead of react.', y, opts);

  y = drawInfoCard(doc, 'Rule 3: Start Small and Build Up', '1. Approach a small fence with balance. 2. Halt before the fence to check control. 3. Approach again and soften the contact. 4. Hold the mane and let the horse jump. 5. Halt in a straight line. 6. Repeat until easy, then add a second fence.', y, opts);

  // ==================== PAGE 9: PART 4 CONTINUED - RULE 4 ====================
  doc.addPage();
  y = opts.margin + 5;

  y = drawInfoCard(doc, 'Rule 4: Teach Self-Carriage', 'Correct for one second, then release. This is the Your Coaching Business: Show the horse the answer, then let it carry itself.', y, opts);

  // ==================== PAGE 10: PART 5 - IF THE HORSE GETS STRONG AT COMPETITIONS ====================
  doc.addPage();
  y = drawPageHeader(doc, 'PART 5 — IF THE HORSE GETS', opts, 'STRONG AT COMPETITIONS');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('Use this 90-second reset:', opts.margin, y);
  y += 10;

  y = drawNumberedList(doc, [
    'Upward and downward transition every 5 seconds (breaks leaning and activates hind legs)',
    'Soften the neck with small circles and lots of flexion (release tension)',
    'Straight line + halts (horse starts thinking again)'
  ], y, opts);

  y += 3;
  y = drawQuoteBox(doc, 'This resets the brain and body quickly.', y, opts);

  // ==================== PAGE 11: PART 6 - TROUBLESHOOTING ====================
  doc.addPage();
  y = drawPageHeader(doc, 'PART 6 — TROUBLESHOOTING', opts);

  y = drawTroubleshootItem(doc, 'Horse leans heavily on the hand', 'Down transition, soften, forward 4 strides. Repeat.', y, opts);

  y = drawTroubleshootItem(doc, 'Horse rushes into fences', 'Halt before the fence. More transitions to walk/halt.', y, opts);

  y = drawTroubleshootItem(doc, 'Horse gets stronger when nervous', 'More transitions, more circles, soft neck, slower breathing.', y, opts);

  y = drawTroubleshootItem(doc, 'Strong in canter but not trot', 'Do more balance work in walk and trot. The canter reveals the problem — it doesn\'t create it.', y, opts);

  y = drawTroubleshootItem(doc, 'Rider holds too long', 'Correct for one second, then release. Holding causes leaning.', y, opts);

  // ==================== PAGE 12: PART 7 - THE TRANSFORMATION ====================
  doc.addPage();
  y = drawPageHeader(doc, 'PART 7 — THE TRANSFORMATION', opts);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  doc.text('When riders follow this system consistently, the change is clear.', opts.margin, y);
  y += 12;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('The horse becomes:', opts.margin, y);
  y += 8;

  y = drawCheckList(doc, [
    'Softer in the neck',
    'Lighter in the hand',
    'More balanced',
    'More adjustable',
    'More focused',
    'Safer and easier to jump'
  ], y, opts);

  y += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('The rider becomes:', opts.margin, y);
  y += 8;

  y = drawCheckList(doc, [
    'Calmer',
    'Clearer',
    'More organised',
    'More confident',
    'More effective',
    'More trusted by the horse'
  ], y, opts);

  y += 5;
  y = drawBigHighlightBox(doc, [
    'A strong horse doesn\'t become light by being held.',
    'It becomes light when the communication becomes clear.'
  ], y, opts);

  // ==================== PAGE 13: FINAL NOTE ====================
  doc.addPage();
  y = drawPageHeader(doc, 'FINAL NOTE', opts);

  y = drawQuoteBox(doc, 'A strong horse is not a problem — it\'s a communication issue.', y, opts);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const finalText = 'Once balance improves and reactions become clearer, everything becomes easier, safer and more enjoyable.';
  const finalLines = doc.splitTextToSize(finalText, opts.contentWidth);
  doc.text(finalLines, opts.margin, y);
  y += finalLines.length * 5 + 12;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('This system is:', opts.margin, y);
  y += 10;

  const traits = ['Simple.', 'Clear.', 'Repeatable.', 'And it works.'];
  traits.forEach(trait => {
    doc.setFillColor(...ORANGE);
    doc.circle(opts.margin + 4, y - 2, 2.5, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    doc.text(trait, opts.margin + 12, y);
    y += 9;
  });

  y += 15;
  doc.setFillColor(...NAVY);
  doc.roundedRect(opts.margin, y, opts.contentWidth, 40, 6, 6, 'F');
  
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ORANGE);
  doc.text('Ready for More?', opts.margin + 10, y + 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...WHITE);
  doc.text('Book a clinic or private lesson to work on your strong horse in person.', opts.margin + 10, y + 22);
  doc.text('Visit: https://your-coaching-business.com/coaching', opts.margin + 10, y + 31);

  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}
