// Στάσιμο κύμα σε ΧΟΡΔΗ ΚΙΘΑΡΑΣ – Αυστηρό μοντέλο (χωρίς L)
// ΔΙΟΡΘΩΣΗ DIASΤΑΞΗΣ ΓΙΑ LAPTOP:
// 🎯 Στόχοι:
// 1) Οι ετικέτες να είναι ΠΑΝΩ και ΚΕΝΤΡΑΡΙΣΜΕΝΕΣ ως προς τα sliders
// 2) Το checkbox του ήχου να ευθυγραμμίζεται με τα sliders (όχι στο κέντρο μόνο του)
// 3) Να μη συγκρούεται η περιοχή sliders με τον πίνακα τιμών
// ✅ Καμία αλλαγή σε φυσική / ήχο / λογική

// =====================
// ΦΥΣΙΚΕΣ ΠΑΡΑΜΕΤΡΟΙ ΚΙΘΑΡΑΣ
// =====================
const L = 0.65;
let u = 120;
let A = 60;

let L_draw = 600;
let scale;

let nSlider, uSlider, soundToggle;
let nLabel, uLabel,
    soundLabel;

let osc;
let t = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('stasima-holder');

  // ===== ΕΤΙΚΕΤΕΣ =====
  nLabel = createDiv('<b>Αρμονική (αριθμός ατράκτων) n</b>');
  uLabel = createDiv(
    'Ταχύτητα διάδοσης u (m/s)<br><span style="font-size:12px">(εξαρτάται από την τάση)</span>'
  );
  soundLabel = createDiv('Ήχος');

  [nLabel, uLabel, soundLabel].forEach(el => {
    el.style('color', 'white');
    el.style('text-align', 'center');
    el.style('font-size', '14px');
  });

  // ===== SLIDERS & CHECKBOX =====
  nSlider = createSlider(1, 10, 2, 1);
  uSlider = createSlider(80, 160, 120, 5);
  soundToggle = createCheckbox(' Ενεργοποίηση', false);

  soundToggle.changed(() => {
    if (soundToggle.checked()) userStartAudio();
  });

  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);

  positionUI();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionUI();
}

function positionUI() {
  const margin = 20;
  const blockWidth = 240;

  // κατεβάζουμε λίγο τους ελέγχους ώστε να μη "τρώνε" τον πίνακα
  const baseY = height - 180;

  if (windowWidth < 700) {
    // 📱 ΚΙΝΗΤΟ – ΚΑΘΕΤΗ ΣΤΟΙΧΙΣΗ
    nLabel.position(margin, baseY);
    nSlider.position(margin, baseY + 25);

    uLabel.position(margin, baseY + 70);
    uSlider.position(margin, baseY + 105);

    soundLabel.position(margin, baseY + 150);
    soundToggle.position(margin, baseY + 175);

  } else {
    // 🖥️ LAPTOP / ΠΙΝΑΚΑΣ – ΟΜΑΔΕΣ ΜΠΛΟΚ

    const x1 = margin;
    const x2 = margin + blockWidth;
    const x3 = margin + 2 * blockWidth;

    nLabel.position(x1, baseY);
    nSlider.position(x1, baseY + 25);

    uLabel.position(x2, baseY);
    uSlider.position(x2, baseY + 25);

    soundLabel.position(x3 + 20, baseY);
    soundToggle.position(x3, baseY + 25);
  }
}

function draw() {
  background(0);

  const n = nSlider.value();
  u = uSlider.value();

  const f = n * u / (2 * L);
  const lambda = 2 * L / n;
  const omega = TWO_PI * f;

  scale = min(L_draw, width - 100) / L;

  if (soundToggle.checked()) {
    osc.freq(f);
    osc.amp(0.25, 0.1);
  } else {
    osc.amp(0, 0.2);
  }

  // =====================
  // ΧΟΡΔΗ (ΕΠΑΝΩ)
  // =====================
  push();
  translate((width - L_draw) / 2, 120);

  stroke(180);
  line(0, 0, L_draw, 0);

  stroke(0, 170, 255);
  noFill();
  beginShape();
  for (let x = 0; x <= L_draw; x += 2) {
    const x_phys = x / scale;
    const y = A * sin(n * PI * x_phys / L) * cos(omega * t);
    vertex(x, y);
  }
  endShape();

  stroke(255, 80, 80);
  for (let k = 0; k <= n; k++) {
    const xNode = (k * L / n) * scale;
    line(xNode, -8, xNode, 8);
  }
  pop();

  // =====================
  // ΠΙΝΑΚΑΣ ΤΙΜΩΝ (ΚΕΝΤΡΟ)
  // =====================
  fill(255);
  textAlign(CENTER);
  textSize(14);

  const harmonicText = (n === 1) ? 'Θεμελιώδης' : `${n - 1}η αρμονική`;

  const infoY = height / 2 + 30;
  text(`Χορδή κιθάρας: L = 0.65 m`, width / 2, infoY - 50);
  text(`n = ${n} (${harmonicText})  |  Δεσμοί: ${n + 1}`, width / 2, infoY - 20);
  text(`u = ${u} m/s`, width / 2, infoY + 5);
  text(`f = ${f.toFixed(1)} Hz   |   λ = ${lambda.toFixed(2)} m`, width / 2, infoY + 30);
  text(`Τύπος: fₙ = n·u / (2·L)`, width / 2, infoY + 55);

  t += 0.02;
}

/*
✅ ΤΙ ΔΙΟΡΘΩΘΗΚΕ ΣΕ LAPTOP:
- Οι ετικέτες είναι ΚΕΝΤΡΑΡΙΣΜΕΝΕΣ πάνω από κάθε slider
- Το checkbox του ήχου είναι ΕΝΤΑΓΜΕΝΟ σαν τρίτο block
- Οι έλεγχοι κατέβηκαν λίγο για να μη "χτυπάνε" με τον πίνακα τιμών
- Καμία αλλαγή σε φυσική, ήχο ή μαθηματικό μοντέλο
*/

