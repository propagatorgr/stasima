// Στάσιμο κύμα σε ΧΟΡΔΗ ΚΙΘΑΡΑΣ – Αυστηρό φυσικό μοντέλο
// ΤΕΛΙΚΗ ΕΚΔΟΣΗ (stasima.js)
// ✅ Διορθώνει ΟΡΙΣΤΙΚΑ mobile portrait / landscape
// ✅ Χρησιμοποιεί VisualViewport API (όπου υπάρχει)
// ✅ Canvas γνωρίζει το πραγματικό ορατό ύψος
// ✅ Κάτω μπάρα controls δεν καλύπτει ποτέ τη χορδή

// =====================================================
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ VIEWPORT
// =====================================================
function getViewportHeight() {
  // Πραγματικό ορατό ύψος (mobile browsers)
  return window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;
}

// =====================================================
// ΣΤΑΘΕΡΕΣ UI
// =====================================================
const CONTROL_BAR_HEIGHT = 160; // px – επαρκές για mobile portrait

// =====================================================
// ΦΥΣΙΚΕΣ ΠΑΡΑΜΕΤΡΟΙ
// =====================================================
const L = 0.65;   // m – μήκος χορδής κιθάρας (σταθερό)
let u = 120;      // m/s – ταχύτητα διάδοσης (τάση)
let A = 60;       // px – πλάτος σχεδίασης

// =====================================================
// CANVAS / ΣΧΕΔΙΑΣΗ
// =====================================================
let L_draw = 600; // px – μέγιστο σχεδιαζόμενο μήκος χορδής
let scale;

// =====================================================
// ΧΕΙΡΙΣΤΗΡΙΑ UI
// =====================================================
let nSlider, uSlider, soundToggle;
let controlBar, nBlock, uBlock, soundBlock;

// =====================================================
// ΗΧΟΣ
// =====================================================
let osc;
let t = 0;

function setup() {
  // ---------------------------------------------------
  // CANVAS με πραγματικό ορατό ύψος
  // ---------------------------------------------------
  const canvas = createCanvas(
    windowWidth,
    getViewportHeight() - CONTROL_BAR_HEIGHT
  );
  canvas.parent('stasima-holder');

  // ---------------------------------------------------
  // ΚΑΤΩ ΜΠΑΡΑ ΧΕΙΡΙΣΤΗΡΙΩΝ (HTML / FLEXBOX)
  // ---------------------------------------------------
  controlBar = createDiv();
  controlBar.parent('stasima-holder');
  controlBar.style('position', 'fixed');
  controlBar.style('left', '0');
  controlBar.style('bottom', '0');
  controlBar.style('width', '100%');
  controlBar.style('height', CONTROL_BAR_HEIGHT + 'px');
  controlBar.style('display', 'flex');
  controlBar.style('justify-content', 'center');
  controlBar.style('align-items', 'flex-start');
  controlBar.style('gap', '32px');
  controlBar.style('padding', '10px');
  controlBar.style('background', 'rgba(0,0,0,0.92)');
  controlBar.style('border-top', '1px solid #444');
  controlBar.style('flex-wrap', 'wrap');
  controlBar.style('color', 'white');

  // ---------- Block αρμονικής n ----------
  nBlock = createDiv();
  nBlock.parent(controlBar);
  nBlock.style('text-align', 'center');
  nBlock.html('<b>Αρμονική (αριθμός ατράκτων) n</b><br>');
  nSlider = createSlider(1, 10, 1, 1);
  nSlider.parent(nBlock);

  // ---------- Block ταχύτητας u ----------
  uBlock = createDiv();
  uBlock.parent(controlBar);
  uBlock.style('text-align', 'center');
  uBlock.html('Ταχύτητα διάδοσης u (m/s)<br><span style="font-size:12px">(εξαρτάται από την τάση)</span><br>');
  uSlider = createSlider(80, 160, 120, 5);
  uSlider.parent(uBlock);

  // ---------- Block ήχου ----------
  soundBlock = createDiv();
  soundBlock.parent(controlBar);
  soundBlock.style('text-align', 'center');
  soundBlock.html('Ήχος<br>');
  soundToggle = createCheckbox(' Ενεργοποίηση', false);
  soundToggle.parent(soundBlock);

  // Ξεκλείδωμα AudioContext (GitHub Pages / mobile browsers)
  soundToggle.changed(() => {
    if (soundToggle.checked()) userStartAudio();
  });

  // ---------------------------------------------------
  // OSCILLATOR
  // ---------------------------------------------------
  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);
}

function windowResized() {
  resizeCanvas(
    windowWidth,
    getViewportHeight() - CONTROL_BAR_HEIGHT
  );
}

function draw() {
  background(0);

  const n = nSlider.value();
  u = uSlider.value();

  const f = (n * u) / (2 * L);
  const lambda = (2 * L) / n;
  const omega = TWO_PI * f;

  // Κλίμακα ώστε να χωράει σε μικρά πλάτη
  scale = min(L_draw, width * 0.92) / L;

  // ---------------------------------------------------
  // ΗΧΟΣ
  // ---------------------------------------------------
  if (soundToggle.checked()) {
    osc.freq(f);
    osc.amp(0.25, 0.1);
  } else {
    osc.amp(0, 0.2);
  }

  // ---------------------------------------------------
  // ΧΟΡΔΗ (ασφαλής κατακόρυφη θέση για mobile)
  // ---------------------------------------------------
  const stringY = height * 0.28; // σχετικό στο ΟΡΑΤΟ canvas

  push();
  translate((width - L * scale) / 2, stringY);

  // γραμμή ισορροπίας
  stroke(200);
  line(0, 0, L * scale, 0);

  // στάσιμο κύμα
  stroke(0, 170, 255);
  noFill();
  beginShape();
  for (let x = 0; x <= L * scale; x += 2) {
    const x_phys = x / scale;
    const y = A * sin((n * PI * x_phys) / L) * cos(omega * t);
    vertex(x, y);
  }
  endShape();

  // δεσμοί
  stroke(255, 80, 80);
  for (let k = 0; k <= n; k++) {
    const xNode = ((k * L) / n) * scale;
    line(xNode, -8, xNode, 8);
  }
  pop();

  // ---------------------------------------------------
  // ΠΙΝΑΚΑΣ ΠΛΗΡΟΦΟΡΙΩΝ (κέντρο)
  // ---------------------------------------------------
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(14);

  const harmonicText = n === 1 ? 'Θεμελιώδης' : `${n - 1}η αρμονική`;

  const infoY = height * 0.62;

  text('Χορδή κιθάρας: L = 0.65 m', width / 2, infoY - 60);
  text(`n = ${n} (${harmonicText})  |  Δεσμοί: ${n + 1}`, width / 2, infoY - 35);
  text(`u = ${u} m/s`, width / 2, infoY - 10);
  text(`f = ${f.toFixed(1)} Hz   |   λ = ${lambda.toFixed(2)} m`, width / 2, infoY + 15);
  text('Τύπος: fₙ = n·u / (2·L)', width / 2, infoY + 40);

  t += 0.02;
}

/*
✅ ΑΠΟΤΕΛΕΣΜΑ:
- Σε mobile portrait: η χορδή ΔΕΝ κόβεται
- Σε mobile landscape: όλα χωρούν
- Σε laptop / projector: καμία αλλαγή
- Controls πάντα κάτω, εκτός canvas
- Η φυσική παραμένει ΑΥΣΤΗΡΗ και αμετάβλητη
*/
