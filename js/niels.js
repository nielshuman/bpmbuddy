text = document.getElementById("text");
sub = document.getElementById("sub");
graph = document.getElementById("graph");
let taps = [];

function flashBackground() {
    document.body.classList.add('flash');
    setTimeout(() => {
        document.body.classList.remove('flash');
    }, 100);
}


document.addEventListener("mousedown", tapTempo);
document.addEventListener("touchstart", tapTempo, {passive: false});
// spacebar
document.addEventListener("keydown", e => {
    if (e.code === "Space") {
        tapTempo(e);
    }
});

function tapTempo(e) {
    let tap = Date.now();
    e.preventDefault();
    taps.push(tap);
    text.innerHTML = 'Taps: ' + taps.length;
    flashBackground();
    if (taps.length > 1) {
        calculateAverageBPM();
    }
    if (taps.length == 1) {
        start()
    }
}

function calculateAverageBPM() {
    let sum = 0;
    for (let i = 1; i < taps.length; i++) {
        sum += taps[i] - taps[i - 1];
    }
    let average1 = sum / (taps.length - 1);
    let average2 = (taps[taps.length - 1] - taps[0]) / (taps.length - 1);
    let bpm = 60000 / average1;
    let bpm2 = 60000 / average2;
    sub.innerHTML = 'Average BPM: ' + Math.round(bpm);
    sub.innerHTML += ' - ' + Math.round(bpm2);
    // console.table({bpm, bpm2})
}

function showGraph(data) {
    // new Chart(graph, {
    //     type: 'line',
    //     data: {
    //         labels: taps.map((tap, i) => i),
    //         datasets: [{
    //             label: 'Tap intervals',
    //             data: taps.map((tap, i) => {
    //                 if (i === 0) {
    //                     return 0;
    //                 }
    //                 return tap - taps[i - 1];
    //             }),
    //             borderColor: 'rgba(255, 99, 132, 1)',
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             y: {
    //                 beginAtZero: true
    //             }
    //         },
    //         responsive: true,
    //         maintainAspectRatio: false
    //     }
    // });


    // make a chart of the bpm vs time
    new Chart(graph, {
        type: 'line',
        data: {
            labels: data.map((d, i) => i),
            datasets: [{
                label: 'BPM',
                data: data.map(d => d.bpm),
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

function create_data(taps, pn=1, remove_first_n = false) {
    // make relative
    taps = taps.map((tap, i) => {
        return tap - taps[0];
    });

    // for each tap, calculate average interval based on the last n taps
    let data = taps.map((tap, i) => {
        let sum = 0;
        let n = pn;

        if (i < n) {
            if (remove_first_n) {
                return {time: tap, bpm: null};
            } else if (i === 0) {
                return {time: tap, bpm: null};
            } else {
                n = i;  
            }
        }
        console.log(n)
        if (n === 0) {
            return {time: tap, bpm: null};
        }
        for (let j = i - n; j < i; j++) {
            if (j >= 0) {
                sum += taps[j + 1] - taps[j];
            }
        }
        let avg_interval = sum / n;
        let avg_bpm = 60000 / avg_interval;
        return {time: tap, bpm: avg_bpm};
    });

    // remove nulls
    data = data.filter(d => d.bpm !== null);

    return data;
}

function results() {
    text.style.display = "none";
    stop();
    document.removeEventListener("mousedown", tapTempo);
    document.removeEventListener("touchstart", tapTempo);
    document.removeEventListener("keydown", tapTempo);
    showGraph(create_data(taps));

}

// add enter key to show graph
document.addEventListener("keydown", function(event) {
    if (event.code === "Enter") {
        results();
    }
});