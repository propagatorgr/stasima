// Στάσιμο κύμα σε ΧΟΡΔΗ ΚΙΘΑΡΑΣ – Αυστηρό μοντέλο (χωρίς L)
// ✅ ΟΡΙΣΤΙΚΗ ΛΥΣΗ ΔΙΑΤΑΞΗΣ (χωρίς απολύτως καμία αλλαγή στη φυσική)
// ΤΙ ΑΛΛΑΖΕΙ ΜΟΝΟ ΣΤΟ UI:
// - Δημιουργείται ΣΤΑΘΕΡΗ ΚΑΤΩ ΜΠΑΡΑ (control bar)
// - Όλα τα χειριστήρια μπαίνουν ΜΕΣΑ σε αυτή (flexbox)
// - Τέλος τα position(x,y) που "σπάνε" σε laptop / κινητό
// - Ίδια εμφάνιση παντού

// =====================
// ΦΥΣΙΚΕΣ ΠΑΡΑΜΕΤΡΟΙ ΚΙΘΑΡΑΣ
// =====================
const L = 0.65;   // m
let u = 120;      // m/s
let A = 60;       // px

let L_draw = 600;
let scale;

let nSlider, uSlider, soundToggle;
let osc;
let t = 0;

// containers
let controlBar, nBlock, uBlock, soundBlock;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('stasima-holder');

  // =====================
  // ΚΑΤΩ ΜΠΑΡΑ ΧΕΙΡΙΣΤΗΡΙΩΝ (HTML / FLEX)
  // =====================
  controlBar = createDiv();
  controlBar.parent('stasima-holder');
  controlBar.style('position', 'fixed');
  controlBar.style('left', '0');
  controlBar.style('bottom', '0');
  controlBar.style('width', '100%');
  controlBar.style('display', 'flex');
  controlBar.style('justify-content', 'center');
  controlBar.style('gap', '40px');
  controlBar.style('padding', '12px 8px');
  controlBar.style('background', 'rgba(0,0,0,0.92)');
  controlBar.style('border-top', '1px solid #444');
  controlBar.style('flex-wrap', 'wrap');

  // ---------- Block n ----------
  nBlock = createDiv();
  nBlock.parent(controlBar);
  nBlock.style('text-align', 'center');
  nBlock.style('color', 'white');

  nBlock.html('<b>Αρμονική (αριθμός ατράκτων) n</b><br>');
  nSlider = createSlider(1, 10, 2, 1);
  nSlider.parent(nBlock);

  // ---------- Block u ----------
  uBlock = createDiv();
  uBlock.parent(controlBar);
  uBlock.style('text-align', 'center');
  uBlock.style('color', 'white');

  uBlock.html('Ταχύτητα διάδοσης u (m/s)<br><span style="font-size:12px">(εξαρτάται από την τάση)</span><br>');
  uSlider = createSlider(80, 160, 120, 5);
  uSlider.parent(uBlock);

  // ---------- Block ήχου ----------
  soundBlock = createDiv();
  soundBlock.parent(controlBar);
  soundBlock.style('text-align', 'center');
  soundBlock.style('color', 'white');

  soundBlock.html('Ήχος<br>');
  soundToggle = createCheckbox(' Ενεργοποίηση', false);
  soundToggle.parent(soundBlock);

  soundToggle.changed(() => {
    if (soundToggle.checked()) userStartAudio();
  });

  // =====================
  // ΗΧΟΣ
  // =====================
  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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

  const infoY = height / 2 + 20;
  text(`Χορδή κιθάρας: L = 0.65 m`, width / 2, infoY - 50);
  text(`n = ${n} (${harmonicText})  |  Δεσμοί: ${n + 1}`, width / 2, infoY - 20);
  text(`u = ${u} m/s`, width / 2, infoY + 5);
  text(`f = ${f.toFixed(1)} Hz   |   λ = ${lambda.toFixed(2)} m`, width / 2, infoY + 30);
  text(`Τύπος: fₙ = n·u / (2·L)`, width / 2, infoY + 55);

  t += 0.02;
}

/*
✅ ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ (ΑΥΤΟ ΑΛΛΑΖΕΙ ΟΠΤΙΚΑ):
- ΟΛΑ τα sliders + checkbox σε ενιαία ΚΑΤΩ ΜΠΑΡΑ
- Σταθερή συμπεριφορά σε laptop / κινητό / πίνακα
- Ετικέτα + χειριστήριο = ένα block
- Τέλος τα layout προβλήματα
- Η ΦΥΣΙΚΗ ΔΕΝ ΠΕΙΡΑΧΤΗΚΕ ΚΑΘΟΛΟΥ
*/
