document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        const userInfoContainer = document.getElementById('user-info');
        userInfoContainer.textContent = `Logged in as user: ${loggedInUser.user_id}`;

        // Make fetch request
        fetch('http://localhost:3050/elcyckel/v1/scooters')
            .then(response => response.json())
            .then(scooters => {
                // Display scooter information in the dashboard
                const scooterInfoContainer = document.getElementById('scooter-info');

                scooters.forEach(scooter => {
                    const scooterButton = document.createElement('button');
                    scooterButton.textContent = `Scooter ID: ${scooter.scooter_id}, Status: ${scooter.scooter_hire}`;
                    scooterButton.addEventListener('click', function () {
                        // Uppdatera scooter_hire status på knapptryck
                        updateScooterStatus(scooter.scooter_id);
                    
                        // Lagra scooterns information i localStorage
                        localStorage.setItem('selectedScooter', JSON.stringify(scooter));
                    
                        // Omdirigera till scooter_details.html med det klickade scooter_id
                        window.location.href = `scooter_details.html?id=${scooter.scooter_id}`;
                    });

                    scooterInfoContainer.appendChild(scooterButton);
                });
            })
            .catch(error => console.error('Error fetching scooter data:', error));
    } else {
        window.location.href = '/';
    }

    async function updateScooterStatus(scooterId) {
        const response = await fetch(`http://localhost:3050/elcyckel/v1/scooters/${scooterId}/update-hire`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scooter_hire: 'Activated', // Set the new hire status here
            }),
        });

        if (response.ok) {
            console.log(`Scooter ${scooterId} status updated to 'Activated'.`);
        } else {
            console.error(`Failed to update scooter ${scooterId} status.`);
        }
    }
});
