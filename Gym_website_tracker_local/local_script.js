// Store exercise data in an array (to simulate storing data after submission)
let exerciseData = [];

// Function to add a new exercise option to the select dropdown
function addNewExerciseOption(exercise) {
    const select = document.getElementById('exercise');
    const newOption = document.createElement('option');
    newOption.value = exercise;
    newOption.text = exercise;
    select.add(newOption, select.options[select.options.length - 1]);
}

// Handle form submission and add data to exerciseData array
document.getElementById('exerciseForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const day = document.getElementById('day').value;
    let exercise = document.getElementById('exercise').value;
    const newExerciseInput = document.getElementById('newExercise');

    // Handle new exercise input
    if (exercise === 'Add New Exercise') {
        exercise = newExerciseInput.value;
        addNewExerciseOption(exercise);
        newExerciseInput.style.display = 'none';
        newExerciseInput.value = '';
    }

    // Get and validate numerical values for weight, reps, and sets
    const weight = parseFloat(document.getElementById('weight').value);
    const reps = parseInt(document.getElementById('reps').value);
    const sets = parseInt(document.getElementById('sets').value);

    // Validate if all values are valid
    if (isNaN(weight) || isNaN(reps) || isNaN(sets)) {
        alert("Please enter valid numerical values for weight, reps, and sets.");
        return;
    }

    // Add the entry to exerciseData array
    exerciseData.push({ day, exercise, weight, reps, sets });

    // Add entry to the table
    const table = document.getElementById('exerciseTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);

    cell1.innerHTML = day;
    cell2.innerHTML = exercise;
    cell3.innerHTML = weight;
    cell4.innerHTML = reps;
    cell5.innerHTML = sets;

    // Reset the form
    document.getElementById('exerciseForm').reset();
});

// Handle export to CSV
document.getElementById('exportBtn').addEventListener('click', function () {
    const table = document.getElementById('exerciseTable');
    let csv = [];
    for (let i = 0; i < table.rows.length; i++) {
        let row = [], cols = table.rows[i].querySelectorAll('td, th');
        for (let j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }
        csv.push(row.join(','));
    }

    const csvString = csv.join('\n');
    const downloadLink = document.createElement('a');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'gym_exercises.csv';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

// Show the new exercise input field when "Add New Exercise" is selected
document.getElementById('exercise').addEventListener('change', function () {
    const newExerciseInput = document.getElementById('newExercise');
    if (this.value === 'Add New Exercise') {
        newExerciseInput.style.display = 'block';
    } else {
        newExerciseInput.style.display = 'none';
    }
});

// Create customizable chart
function createChart(data, xKey, yKey) {
    const ctx = document.getElementById('chart').getContext('2d');
    const labels = data.map(entry => entry[xKey]);
    const values = data.map(entry => entry[yKey]);

    new Chart(ctx, {
        type: 'line', // You can change this to 'bar', 'radar', etc.
        data: {
            labels: labels,
            datasets: [{
                label: `${yKey} over ${xKey}`,
                data: values,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: xKey
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yKey
                    }
                }
            }
        }
    });
}

// Event listener for chart button
document.getElementById('chartBtn').addEventListener('click', function () {
    const xKey = document.getElementById('xAxis').value;
    const yKey = document.getElementById('yAxis').value;

    if (!xKey || !yKey) {
        alert('Please select both X and Y axes');
        return;
    }

    // Clear the existing chart and generate a new one
    document.getElementById('chartContainer').innerHTML = '<canvas id="chart"></canvas>';
    createChart(exerciseData, xKey, yKey);
});
