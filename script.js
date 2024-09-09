document.addEventListener('DOMContentLoaded', (event) => {
    loadFormData();

    document.getElementById('exercise-form').addEventListener('submit', function(event) {
        event.preventDefault();
        saveFormData();
        alert('Exercise data saved!');
    });

    document.getElementById('clear-btn').addEventListener('click', function() {
        clearFormData();
        alert('Form cleared!');
    });

    document.getElementById('export-btn').addEventListener('click', function() {
        exportToExcel();
    });
});

function saveFormData() {
    const formData = {
        date: document.getElementById('date').value,
        exercise: document.getElementById('exercise').value,
        weight: document.getElementById('weight').value,
        reps: document.getElementById('reps').value,
        sets: document.getElementById('sets').value,
    };
    localStorage.setItem('exerciseFormData', JSON.stringify(formData));
}

function loadFormData() {
    const savedFormData = localStorage.getItem('exerciseFormData');
    if (savedFormData) {
        const formData = JSON.parse(savedFormData);
        document.getElementById('date').value = formData.date;
        document.getElementById('exercise').value = formData.exercise;
        document.getElementById('weight').value = formData.weight;
        document.getElementById('reps').value = formData.reps;
        document.getElementById('sets').value = formData.sets;
    }
}

function clearFormData() {
    localStorage.removeItem('exerciseFormData');
    document.getElementById('exercise-form').reset();
}

function exportToExcel() {
    const savedFormData = localStorage.getItem('exerciseFormData');
    if (!savedFormData) {
        alert('No data to export.');
        return;
    }

    const formData = JSON.parse(savedFormData);
    const csvData = [
        ['Date', 'Exercise', 'Weight (kg)', 'Reps', 'Sets'],
        [formData.date, formData.exercise, formData.weight, formData.reps, formData.sets]
    ];

    let csvContent = "data:text/csv;charset=utf-8," 
        + csvData.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exercise_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
}
