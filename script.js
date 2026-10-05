const API_URL = 'https://6ac3c465ae53bf25b80ef5b5.mockapi.io/pets';

const emojis = { Dragon:'🐉', Unicorn:'🦄', Phoenix:'🔥', Fairy:'🧚', Griffin:'🦅' };

function getEmoji(type) {
    for (const key in emojis) {
        if (type && type.includes(key)) return emojis[key];
    }
    return '🐾';
}

function createCard(pet) {
    const card = document.createElement('article');
    card.className = 'card';
    card.id = `pet-${pet.id}`;
    card.innerHTML = `
        <div class="emoji">${getEmoji(pet.type)}</div>
        <div class="petname">${pet.name}</div>
        <div class="badge">${pet.type}</div>
        <div class="petcolor">🎨 ${pet.color}</div>
        <div class="petdesc">${pet.description}</div>
        <button onclick="releasePet('${pet.id}')">🕊️ Release</button>
    `;
    return card;
}

// GET
async function getPets() {
    try {
        const res = await fetch(API_URL);
        const pets = await res.json();
        const grid = document.getElementById('grid');
        grid.innerHTML = pets.length ? '' : '<p>No pets yet! Adopt your first 🐾</p>';
        pets.forEach(pet => grid.appendChild(createCard(pet)));
    } catch (e) {
        console.log('Error:', e);
    }
}

// POST
async function addPet(data) {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const newPet = await res.json();
        const grid = document.getElementById('grid');
        const msg = grid.querySelector('p');
        if (msg) msg.remove();
        grid.appendChild(createCard(newPet));
    } catch (e) {
        console.log('Error:', e);
    }
}

// DELETE
async function releasePet(id) {
    if (!confirm('Release this pet? 🕊️')) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        document.getElementById(`pet-${id}`).remove();
    } catch (e) {
        console.log('Error:', e);
    }
}

// Modal
const modal = document.getElementById('modal');

function openModal()  { modal.showModal(); }
function closeModal() { modal.close(); document.getElementById('form').reset(); }

modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

document.getElementById('form').addEventListener('submit', async e => {
    e.preventDefault();
    await addPet({
        name:        document.getElementById('name').value,
        type:        document.getElementById('type').value,
        color:       document.getElementById('color').value,
        description: document.getElementById('desc').value
    });
    closeModal();
});

getPets();
