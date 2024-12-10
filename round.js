let processes = [];

        function addProcess() {
            const process = {
                name: document.getElementById('processName').value,
                arrivalTime: parseInt(document.getElementById('arrivalTime').value),
                burstTime: parseInt(document.getElementById('burstTime').value),
                remainingTime: parseInt(document.getElementById('burstTime').value),
                completionTime: 0,
                turnaroundTime: 0,
                waitingTime: 0
            };

            processes.push(process);
            updateProcessTable();
            clearInputs();
        }

        function clearInputs() {
            document.getElementById('processName').value = '';
            document.getElementById('arrivalTime').value = '';
            document.getElementById('burstTime').value = '';
        }

        function updateProcessTable() {
            const table = document.getElementById('processTable');
            // Clear existing rows except header
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            processes.forEach(process => {
                const row = table.insertRow();
                row.insertCell().textContent = process.name;
                row.insertCell().textContent = process.arrivalTime;
                row.insertCell().textContent = process.burstTime;
                row.insertCell().textContent = process.completionTime;
                row.insertCell().textContent = process.turnaroundTime;
                row.insertCell().textContent = process.waitingTime;
            });
        }

        function calculateScheduling() {
            const quantum = parseInt(document.getElementById('quantum').value);
            let currentTime = 0;
            let completedProcesses = 0;
            let ganttChart = [];
            let readyQueue = [];
            
            // Deep copy processes for calculation
            let remainingProcesses = JSON.parse(JSON.stringify(processes));

            while (completedProcesses < processes.length) {
                // Add newly arrived processes to ready queue
                remainingProcesses.forEach(process => {
                    if (process.arrivalTime <= currentTime && process.remainingTime > 0 && 
                        !readyQueue.includes(process)) {
                        readyQueue.push(process);
                    }
                });

                if (readyQueue.length === 0) {
                    currentTime++;
                    continue;
                }

                let currentProcess = readyQueue.shift();
                let timeSlice = Math.min(quantum, currentProcess.remainingTime);

                // Add to Gantt chart
                ganttChart.push({
                    process: currentProcess.name,
                    startTime: currentTime,
                    endTime: currentTime + timeSlice
                });

                currentTime += timeSlice;
                currentProcess.remainingTime -= timeSlice;

                if (currentProcess.remainingTime > 0) {
                    readyQueue.push(currentProcess);
                } else {
                    // Process completed
                    let originalProcess = processes.find(p => p.name === currentProcess.name);
                    originalProcess.completionTime = currentTime;
                    originalProcess.turnaroundTime = currentTime - originalProcess.arrivalTime;
                    originalProcess.waitingTime = originalProcess.turnaroundTime - originalProcess.burstTime;
                    completedProcesses++;
                }
            }

            updateProcessTable();
            displayGanttChart(ganttChart);
        }

        function displayGanttChart(ganttChart) {
            const container = document.getElementById('ganttChart');
            container.innerHTML = '';

            ganttChart.forEach(block => {
                const div = document.createElement('div');
                div.className = 'gantt-block';
                div.innerHTML = `${block.process}<br>${block.startTime}-${block.endTime}`;
                div.style.width = `${(block.endTime - block.startTime) * 50}px`;
                container.appendChild(div);
            });
        }