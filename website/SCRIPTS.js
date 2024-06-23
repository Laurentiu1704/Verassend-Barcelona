document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reserveren-form');
    const typeSelect = document.getElementById('type');
    const bikeOptions = document.getElementById('bike-options');
    const tourOptions = document.getElementById('tour-options');
    const confirmation = document.getElementById('confirmation');

    bikeOptions.style.display = 'none';
    tourOptions.style.display = 'none';

    typeSelect.addEventListener('change', () => {
        if (typeSelect.value === 'bike') {
            bikeOptions.style.display = 'block';
            tourOptions.style.display = 'none';
        } else {
            bikeOptions.style.display = 'none';
            tourOptions.style.display = 'block';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let data = {};

        if (typeSelect.value === 'bike') {
            data = {
                type: 'bike',
                num_bikes: document.getElementById('num_bikes').value,
                duration: document.getElementById('duration').value
            };
        } else {
            data = {
                type: 'tour',
                time: document.getElementById('time').value,
                num_people: document.getElementById('num_people').value
            };
        }

        fetch('/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            confirmation.textContent = data.message;
        })
        .catch(error => {
            confirmation.textContent = 'Er is een fout opgetreden bij het reserveren.';
        });
    });
});
