const perPageOptions = [10, 30, 50, 100];
let currentPage = 1;
let repositoriesPerPage = 10;

function fetchUserDetails(username) {
    const userUrl = `https://api.github.com/users/${username}`;

    fetch(userUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(user => {
            displayUserDetails(user);
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}

function displayUserDetails(user) {
    const userDetails = document.getElementById('user-details');
    userDetails.innerHTML = '';

    const avatarUrl = user.avatar_url;
    const bio = user.bio || 'No bio available';

    const userCard = document.createElement('div');
    userCard.classList.add('card', 'mt-4');

    userCard.innerHTML = `
        <img src="${avatarUrl}" class="card-img-top" alt="User Avatar">
        <div class="card-body">
            <h5 class="card-title">${user.login}</h5>
            <p class="card-text">${bio}</p>
            <a href="${user.html_url}" class="btn btn-primary" target="_blank">View Profile on GitHub</a>
        </div>
    `;

    userDetails.appendChild(userCard);
}

function fetchRepositories() {
    const username = document.getElementById('username').value;

    if (!username) {
        alert('Please enter a GitHub username.');
        return;
    }

    const apiUrl = `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${repositoriesPerPage}`;

    const repositoriesList = document.getElementById('repositories-list');
    repositoriesList.innerHTML = ''; // Clear previous results

    // Show loader while API call is in progress
    repositoriesList.innerHTML = '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(repositories => {
            // Remove loader
            repositoriesList.innerHTML = '';

            // Display repositories
            repositories.forEach(repo => {
                const card = document.createElement('div');
                card.classList.add('card', 'mt-3');

                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${repo.name}</h5>
                        <p class="card-text">${repo.description || 'No description available'}</p>
                        <a href="${repo.html_url}" class="btn btn-primary" target="_blank">View on GitHub</a>
                    </div>
                `;

                repositoriesList.appendChild(card);
            });

            // Display pagination
            const totalPages = Math.ceil(repositories.length / repositoriesPerPage);
            if (totalPages > 1) {
                const pagination = document.getElementById('pagination');
                pagination.innerHTML = '';

                for (let i = 1; i <= totalPages; i++) {
                    const button = document.createElement('button');
                    button.classList.add('btn', 'btn-outline-secondary', 'mr-2');
                    button.textContent = i;
                    button.onclick = () => changePage(i);
                    pagination.appendChild(button);
                }
            }

            // Fetch and display user details
            fetchUserDetails(username);
        })
        .catch(error => {
            // Remove loader
            repositoriesList.innerHTML = '';

            // Display error message
            repositoriesList.innerHTML = `<p class="text-danger">Error fetching repositories: ${error.message}</p>`;
            console.error('Error fetching repositories:', error);
        });
}

function changePage(page) {
    currentPage = page;
    fetchRepositories();
}

// Initialize page with default repositories per page
fetchRepositories();
