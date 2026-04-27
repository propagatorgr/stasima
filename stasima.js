// Στάσιμο κύμα σε ΧΟΡΔΗ ΚΙΘΑΡΑΣ – Αυστηρό μοντέλο (χωρίς L)
// ΜΟΡΦΟΠΟΙΗΣΗ: σκοτεινό φόντο, αριστερά χειριστήρια, δεξιά πίνακας τιμών
// ⚠ Δεν αλλάζει ΚΑΜΙΑ λειτουργικότητα

// =====================
// ΦΥΣΙΚΕΣ ΠΑΡΑΜΕΤΡΟΙ ΚΙΘΑΡΑΣ
// =====================
const L = 0.65;   // m – μήκος χορδής κιθάρας (σταθερό)
let u = 120;      // m/s – εξαρτάται από την τάση
let A = 60;       // px – πλάτος σχεδίασης

// Σχεδίαση
let L_draw = 600; // px
let scale;

// Χειριστήρια
let nSlider, uSlider;
let soundToggle;

// Χρόνος
let t = 0;

// Ήχος
let osc;

// =====================
// ΣΤΑΘΕΡΕΣ ΔΙΑΤΑΞΗΣ
// =====================
const xSlider = 20;
const xLabel  = 20;
const xTable  = 420;

const yN = 330;
const yU = 400;

function setup() {
  createCanvas(900, 560);

  // ===== Ετικέτες & Sliders (αριστερά) =====
  createDiv('<span style="color:white;font-weight:bold">Αρμονική (αριθμός ατράκτων) n</span>')
    .position(xLabel, yN - 30);
  nSlider = createSlider(1, 10, 2, 1);
  nSlider.position(xSlider, yN);

  createDiv('<span style="color:white;font-weight:bold">Ταχύτητα διάδοσης u (m/s)</span><br>' +
            '<span style="color:#ccc;font-size:12px">(εξαρτάται από την τάση)</span>')
    .position(xLabel, yU - 45);
  uSlider = createSlider(80, 160, 120, 5);
  uSlider.position(xSlider, yU);

  soundToggle = createCheckbox('<span style="color:white"> Ενεργοποίηση ήχου</span>', false);
  soundToggle.position(xLabel, yU + 45);
  
soundToggle.changed(() => {
  if (soundToggle.checked()) {
    userStartAudio();
  }
});

  // ===== Ήχος =====
  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);
}

function draw() {
  background(0);

  const n = nSlider.value();
  u = uSlider.value();

  const f = n * u / (2 * L);
  const lambda = 2 * L / n;
  const omega = TWO_PI * f;

  scale = L_draw / L;

  if (soundToggle.checked()) {
    osc.freq(f);
    osc.amp(0.25, 0.1);
  } else {
    osc.amp(0, 0.2);
  }

  // =====================
  // ΧΟΡΔΗ ΚΙΘΑΡΑΣ
  // =====================
  push();
  translate(140, 160);

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
  // ΠΙΝΑΚΑΣ ΤΙΜΩΝ (δεξιά)
  // =====================
  noStroke();
  fill(255);
  textSize(15);

  const harmonicText = (n === 1)
    ? 'Θεμελιώδης'
    : `${n - 1}η αρμονική`;

  text(`Χορδή κιθάρας: L = 0.65 m`, xTable, 270);

  text(`n = ${n} (${harmonicText})`, xTable, yN + 5);
  text(`Δεσμοί: ${n + 1}`,          xTable, yN + 25);

  text(`u = ${u} m/s`,              xTable, yU + 5);
  text(`f = ${f.toFixed(1)} Hz`,    xTable, yU + 25);
  text(`λ = ${lambda.toFixed(2)} m`,xTable, yU + 45);

  text(`Τύπος: fₙ = n·u / (2·L)`,   xTable, 500);

  t += 0.02;
}

/*
ΜΟΡΦΟΠΟΙΗΣΗ:
✔ Σκοτεινό φόντο (ζωντανό για προβολή)
✔ Sliders αριστερά με καθαρές ετικέτες
✔ Πίνακας τιμών δεξιά ευθυγραμμισμένος
✔ Καμία αλλαγή στη φυσική ή στη λειτουργικότητα
*/
