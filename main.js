document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const voteSection = document.getElementById('voteSection');
    const voteOptions = document.getElementById('voteOptions');
    const submitVote = document.getElementById('submitVote');
    const confirmationSection = document.getElementById('confirmationSection');
    const viewResults = document.getElementById('viewResults');
    const resultsSection = document.getElementById('resultsSection');

    // Options de vote (pourrait être chargé depuis une API)
    const votingOptions = [
        { id: 1, name: "Option 1", description: "Description de l'option 1" },
        { id: 2, name: "Option 2", description: "Description de l'option 2" },
        { id: 3, name: "Option 3", description: "Description de l'option 3" }
    ];

    let selectedOption = null;
    let voterId = null;

    // Gestion de la connexion
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        voterId = document.getElementById('voterId').value;
        
        // Ici, vous pourriez vérifier l'identifiant auprès d'une API
        // Pour cet exemple, nous supposons qu'il est valide
        
        loginSection.style.display = 'none';
        voteSection.style.display = 'block';
        loadVotingOptions();
    });

    // Charger les options de vote
    function loadVotingOptions() {
        voteOptions.innerHTML = '';
        votingOptions.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <h3>${option.name}</h3>
                <p>${option.description}</p>
            `;
            optionElement.addEventListener('click', () => {
                document.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                optionElement.classList.add('selected');
                selectedOption = option.id;
                submitVote.disabled = false;
            });
            voteOptions.appendChild(optionElement);
        });
    }

    // Soumission du vote
    submitVote.addEventListener('click', function() {
        if (!selectedOption) return;
        
        // Envoyer le vote au serveur (simulé ici)
        fetch('vote.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                voterId: voterId,
                optionId: selectedOption
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                voteSection.style.display = 'none';
                confirmationSection.style.display = 'block';
            } else {
                alert("Erreur lors de l'enregistrement du vote: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Une erreur s'est produite lors de l'envoi du vote.");
        });
    });

    // Voir les résultats
    viewResults.addEventListener('click', function() {
        confirmationSection.style.display = 'none';
        resultsSection.style.display = 'block';
        loadResults();
    });

    // Charger les résultats
    function loadResults() {
        // Récupérer les résultats depuis le serveur (simulé ici)
        fetch('results.php')
            .then(response => response.json())
            .then(data => {
                displayResults(data);
            })
            .catch(error => {
                console.error('Error:', error);
                resultsChart.innerHTML = '<p>Erreur lors du chargement des résultats.</p>';
            });
    }

    // Afficher les résultats
    function displayResults(results) {
        const resultsChart = document.getElementById('resultsChart');
        resultsChart.innerHTML = '';
        
        // Trouver le nombre maximal de votes pour la mise à l'échelle
        const maxVotes = Math.max(...results.map(item => item.votes), 1);
        
        results.forEach(item => {
            const option = votingOptions.find(opt => opt.id == item.optionId);
            const percentage = (item.votes / maxVotes) * 100;
            
            const container = document.createElement('div');
            container.className = 'bar-container';
            container.innerHTML = `
                <div class="bar-label">${option.name}: ${item.votes} votes</div>
                <div class="bar" style="width: ${percentage}%"></div>
            `;
            resultsChart.appendChild(container);
        });
    }
});
