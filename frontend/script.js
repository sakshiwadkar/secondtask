document.getElementById('ticketForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const user_name = document.getElementById('user_name').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    const ticketData = {
        user_name: user_name,
        title: title,
        description: description,
        category: category
    };

    // Send ticket data to the backend (Flask)
    fetch('http://127.0.0.1:5000/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchTickets(); // Fetch tickets after submitting a new one
    })
    .catch(error => console.error('Error:', error));
});

// Fetch all tickets from the backend
function fetchTickets() {
    fetch('http://127.0.0.1:5000/tickets')
    .then(response => response.json())
    .then(data => {
        const ticketsDiv = document.getElementById('tickets');
        ticketsDiv.innerHTML = ''; // Clear existing tickets

        data.forEach(ticket => {
            const ticketDiv = document.createElement('div');
            ticketDiv.classList.add('ticket');
            ticketDiv.innerHTML = `
                <h3>${ticket.title}</h3>
                <p><strong>User:</strong> ${ticket.user_name}</p>
                <p><strong>Category:</strong> ${ticket.category}</p>
                <p><strong>Status:</strong> ${ticket.status}</p>
                <p><strong>Created At:</strong> ${new Date(ticket.created_at).toLocaleString()}</p>
                <p>${ticket.description}</p>
            `;
            ticketsDiv.appendChild(ticketDiv);
        });
    })
    .catch(error => console.error('Error:', error));
}

// Fetch tickets when the page loads
fetchTickets();
