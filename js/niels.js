text = document.getElementById("text");
sub = document.getElementById("sub");
graph = document.getElementById("graph");
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

function showGraph() {
    // hide text
    text.style.display = "none";
    stop();

    new Chart(graph, {
        type: 'line',
        data: {
            labels: taps.map((tap, i) => i),
            datasets: [{
                label: 'Tap intervals',
                data: taps.map((tap, i) => {
                    if (i === 0) {
                        return 0;
                    }
                    return tap - taps[i - 1];
                }),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// add enter key to show graph
document.addEventListener("keydown", function(event) {
    if (event.code === "Enter") {
        showGraph();
    }
});