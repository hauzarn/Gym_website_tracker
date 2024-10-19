// Existing form submission logic
document.getElementById('exerciseForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const day = document.getElementById('day').value;
    let exercise = document.getElementById('exercise').value;
    const newExerciseInput = document.getElementById('newExercise');
    if (exercise === 'Add New Exercise') {
        exercise = newExerciseInput.value;
        addNewExerciseOption(exercise);
        newExerciseInput.style.display = 'none';
        newExerciseInput.value = '';
    }
    const weight = document.getElementById('weight').value;
    const reps = document.getElementById('reps').value;
    const sets = document.getElementById('sets').value;

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

    document.getElementById('exerciseForm').reset();
});

// Add new exercise to dropdown
function addNewExerciseOption(exercise) {
    const select = document.getElementById('exercise');
    const newOption = document.createElement('option');
    newOption.value = exercise;
    newOption.text = exercise;
    select.add(newOption, select.options[select.options.length - 1]);
}

// Display input field for adding a new exercise
document.getElementById('exercise').addEventListener('change', function () {
    const newExerciseInput = document.getElementById('newExercise');
    if (this.value === 'Add New Exercise') {
        newExerciseInput.style.display = 'block';
    } else {
        newExerciseInput.style.display = 'none';
    }
});

// Handle export to CSV and upload to Google Drive
document.getElementById('exportBtn').addEventListener('click', function () {
    const table = document.getElementById('exerciseTable');
    let csv = [];
    
    // Loop through the table rows and convert them to CSV format
    for (let i = 0; i < table.rows.length; i++) {
        let row = [], cols = table.rows[i].querySelectorAll('td, th');
        for (let j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }
        csv.push(row.join(','));
    }

    // Create the CSV string
    const csvString = csv.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    
    // Create FormData to send to the backend
    const formData = new FormData();
    formData.append('file', blob, 'gym_exercises.csv');
    
    // Make a POST request to send the CSV file to the backend
    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        alert('CSV uploaded successfully to Google Drive!');
    })
    .catch(error => {
        console.error('Error uploading CSV:', error);
    });
});