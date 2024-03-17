text = document.getElementById("text");
sub = document.getElementById("sub");
let counter = 0;
let previousTap
let taps = [];

function flashBackground() {
    document.body.classList.add('flash');
    setTimeout(() => {
        document.body.classList.remove('flash');
    }, 100);
}

document.addEventListener("click", tapTempo);
document.addEventListener("touchstart", tapTempo);
// spacebar
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        tapTempo();
    }
});

function tapTempo() {
    counter++;
    text.innerHTML = 'Taps: ' + counter;
    flashBackground();
    let tap = Date.now();
    taps.push(tap);
    if (taps.length > 1) {
        calculateBPM();
    }
}

function calculateBPM() {
    let sum = 0;
    for (let i = 1; i < taps.length; i++) {
        sum += taps[i] - taps[i - 1];
    }
    let average = sum / (taps.length - 1);
    let bpm = 60000 / average;
    sub.innerHTML = 'Average BPM: ' + Math.round(bpm);
}