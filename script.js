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

document.getElementById('exercise').addEventListener('change', function () {
    const newExerciseInput = document.getElementById('newExercise');
    if (this.value === 'Add New Exercise') {
        newExerciseInput.style.display = 'block';
    } else {
        newExerciseInput.style.display = 'none';
    }
});

function addNewExerciseOption(exercise) {
    const select = document.getElementById('exercise');
    const newOption = document.createElement('option');
    newOption.value = exercise;
    newOption.text = exercise;
    select.add(newOption, select.options[select.options.length - 1]);
}
