function createInputTable() {
    const n = document.getElementById('numProcesses').value;
    let html = '<table><tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th></tr>';
    
    for(let i = 0; i < n; i++) {
        html += `
            <tr>
                <td>P${i+1}</td>
                <td><input type="number" id="arrival${i}" min="0" value="0"></td>
                <td><input type="number" id="burst${i}" min="1" value="1"></td>
            </tr>`;
    }
    html += '</table>';
    document.getElementById('inputTable').innerHTML = html;
}

function calculateFCFS() {
    const n = document.getElementById('numProcesses').value;
    let processes = [];

    // Gather input data
    for(let i = 0; i < n; i++) {
        processes.push({
            id: i + 1,
            arrival: parseInt(document.getElementById(`arrival${i}`).value),
            burst: parseInt(document.getElementById(`burst${i}`).value),
            completion: 0,
            turnaround: 0,
            waiting: 0
        });
    }

    // Sort by arrival time
    processes.sort((a, b) => a.arrival - b.arrival);

    // Calculate completion, turnaround, and waiting times
    let currentTime = 0;
    let ganttChart = [];

    processes.forEach(process => {
        if (currentTime < process.arrival) {
            currentTime = process.arrival;
        }
        process.completion = currentTime + process.burst;
        process.turnaround = process.completion - process.arrival;
        process.waiting = process.turnaround - process.burst;
        
        ganttChart.push({
            process: `P${process.id}`,
            start: currentTime,
            end: process.completion
        });
        
        currentTime = process.completion;
    });

    // Calculate averages
    const avgTurnaround = processes.reduce((sum, p) => sum + p.turnaround, 0) / n;
    const avgWaiting = processes.reduce((sum, p) => sum + p.waiting, 0) / n;

    // Display results
    let resultHtml = `
        <h3>Results</h3>
        <table>
            <tr>
                <th>Process</th>
                <th>Arrival Time</th>
                <th>Burst Time</th>
                <th>Completion Time</th>
                <th>Turnaround Time</th>
                <th>Waiting Time</th>
            </tr>`;

    processes.forEach(p => {
        resultHtml += `
            <tr>
                <td>P${p.id}</td>
                <td>${p.arrival}</td>
                <td>${p.burst}</td>
                <td>${p.completion}</td>
                <td>${p.turnaround}</td>
                <td>${p.waiting}</td>
            </tr>`;
    });

    resultHtml += `</table>
        <p>Turnaround Time: ${avgTurnaround.toFixed(2)}</p>
        <p>Waiting Time: ${avgWaiting.toFixed(2)}</p>
        <h3>Gantt Chart</h3>
        <div class="gantt-chart">`;

    ganttChart.forEach(block => {
        resultHtml += `
            <div class="gantt-block">
                ${block.process}<br>
                ${block.start}-${block.end}
            </div>`;
    });

    resultHtml += '</div>';
    document.getElementById('results').innerHTML = resultHtml;
}

// Initialize with default number of processes
createInputTable();