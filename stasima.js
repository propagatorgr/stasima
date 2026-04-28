// Στάσιμο κύμα σε ΧΟΡΔΗ ΚΙΘΑΡΑΣ – Αυστηρό μοντέλο (χωρίς L)
// RESPONSIVE ΔΙΑΤΑΞΗ (ΤΕΛΙΚΗ):
// - Χορδή επάνω
// - Πίνακας τιμών στο κέντρο
// - Sliders + checkbox ΚΑΤΩ με ΣΑΦΕΙΣ ΕΤΙΚΕΤΕΣ (desktop & κινητό)
// ⚠ Καμία αλλαγή στη φυσική ή στη λειτουργικότητα

// =====================
// ΦΥΣΙΚΕΣ ΠΑΡΑΜΕΤΡΟΙ ΚΙΘΑΡΑΣ
// =====================
const L = 0.65;   // m – μήκος χορδής κιθάρας
let u = 120;      // m/s – εξαρτάται από την τάση
let A = 60;       // px

// Σχεδίαση
let L_draw = 600;
let scale;

// Χειριστήρια
let nSlider, uSlider, soundToggle;
let nLabel, uLabel;

// Ήχος
let osc;

let t = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('stasima-holder');

  // ===== ΕΤΙΚΕΤΕΣ =====
  nLabel = createDiv('<b>Αρμονική (αριθμός ατράκτων) n</b>');
  uLabel = createDiv('Ταχύτητα διάδοσης u (m/s)<br><span style="font-size:12px">(εξαρτάται από την τάση)</span>');

  // ===== SLIDERS & CHECKBOX =====
  nSlider = createSlider(1, 10, 2, 1);
  uSlider = createSlider(80, 160, 120, 5);
  soundToggle = createCheckbox(' Ενεργοποίηση ήχου', false);

  // ξεκλείδωμα audio context (GitHub Pages / mobile)
  soundToggle.changed(() => {
    if (soundToggle.checked()) userStartAudio();
  });

  // ===== ΟΠΤΙΚΗ ΜΟΡΦΟΠΟΙΗΣΗ ΕΤΙΚΕΤΩΝ =====
  nLabel.style('color', 'white');
  uLabel.style('color', 'white');

  // ===== Ήχος =====
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
  const baseY = height - 200;

  if (windowWidth < 700) {
    // 📱 ΚΙΝΗΤΟ – ΚΑΘΕΤΗ ΣΤΟΙΧΙΣΗ
    nLabel.position(margin, baseY);
    nSlider.position(margin, baseY + 25);

    uLabel.position(margin, baseY + 65);
    uSlider.position(margin, baseY + 100);

    soundToggle.position(margin, baseY + 145);
  } else {
    // 🖥️ ΠΙΝΑΚΑΣ / DESKTOP – ΟΡΙΖΟΝΤΙΑ
    nLabel.position(margin, baseY);
    nSlider.position(margin, baseY + 25);

    uLabel.position(margin + 260, baseY);
    uSlider.position(margin + 260, baseY + 25);

    soundToggle.position(margin + 540, baseY + 35);
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

  // ----- Ήχος -----
  if (soundToggle.checked()) {
    osc.freq(f);
    osc.amp(0.25, 0.1);
  } else {
    osc.amp(0, 0.2);
  }

  // =====================
  // ΧΟΡΔΗ (επάνω)
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
  noStroke();
  textAlign(CENTER);
  textSize(14);

  const harmonicText = (n === 1) ? 'Θεμελιώδης' : `${n - 1}η αρμονική`;

  const infoY = height / 2 + 40;
  text(`Χορδή κιθάρας: L = 0.65 m`, width / 2, infoY - 60);
  text(`n = ${n} (${harmonicText})  |  Δεσμοί: ${n + 1}`, width / 2, infoY - 30);
  text(`u = ${u} m/s`, width / 2, infoY);
  text(`f = ${f.toFixed(1)} Hz   |   λ = ${lambda.toFixed(2)} m`, width / 2, infoY + 30);
  text(`Τύπος: fₙ = n·u / (2·L)`, width / 2, infoY + 60);

  t += 0.02;
}

/*
✅ ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ
- Sliders ΚΑΤΩ με ΣΑΦΕΙΣ ετικέτες
- Σε κινητό: κάθετη στοίχιση (καμία επικάλυψη)
- Σε μεγάλη οθόνη: καθαρή οριζόντια διάταξη
- Καμία αλλαγή στη φυσική, τους υπολογισμούς ή τον ήχο
*/

