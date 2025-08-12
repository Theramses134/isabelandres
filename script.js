
const barberos = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    precio: "Bs 50 - Corte clásico",
    descripcion: "Experto en cortes clásicos y degradados. Más de 10 años de experiencia.",
    ubicacion: "Zona Sur, La Paz",
    especialidades: ["Corte clásico", "Degradado", "Barba"],
    fotos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=60",
      "https://images.unsplash.com/photo-1551836022-4b0b7f3f3a8a?auto=format&fit=crop&w=600&q=60"
    ]
  },
  {
    id: 2,
    nombre: "Ana Gutierrez",
    precio: "Bs 60 - Barbería premium",
    descripcion: "Especializada en estilos urbanos y barbería de alta calidad.",
    ubicacion: "Centro, La Paz",
    especialidades: ["Barbería urbana", "Diseños", "Tinte"],
    fotos: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=60",
      "https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=600&q=60"
    ]
  },
  {
    id: 3,
    nombre: "José Ramirez",
    precio: "Bs 40 - Corte rápido",
    descripcion: "Ideal para cortes rápidos y limpieza facial.",
    ubicacion: "Zona Norte, La Paz",
    especialidades: ["Corte rápido", "Limpieza facial"],
    fotos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=60",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=60"
    ]
  }
];

// DOM Elements
const swipeContainer = document.getElementById('swipeContainer');
const barberListSection = document.getElementById('barberList');
const listContainer = document.getElementById('listContainer');
const showListBtn = document.getElementById('showListBtn');
const showSwipeBtn = document.getElementById('showSwipeBtn');

const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
const reserveModal = new bootstrap.Modal(document.getElementById('reserveModal'));

const profileModalLabel = document.getElementById('profileModalLabel');
const profilePhotos = document.getElementById('profilePhotos');
const profileDesc = document.getElementById('profileDesc');
const profilePrice = document.getElementById('profilePrice');
const profileLocation = document.getElementById('profileLocation');
const profileSkills = document.getElementById('profileSkills');
const reserveBtn = document.getElementById('reserveBtn');
const reserveBarberName = document.getElementById('reserveBarberName');
const confirmReserveBtn = document.getElementById('confirmReserveBtn');

let currentCards = [];
let currentIndex = 0;
let selectedBarber = null;

// Mostrar lista de barberos
function showList() {
  swipeContainer.classList.add('d-none');
  barberListSection.classList.remove('d-none');
  showListBtn.classList.add('d-none');
  showSwipeBtn.classList.remove('d-none');
  renderBarberList();
}

// Mostrar swipe
function showSwipe() {
  barberListSection.classList.add('d-none');
  swipeContainer.classList.remove('d-none');
  showListBtn.classList.remove('d-none');
  showSwipeBtn.classList.add('d-none');
  renderSwipeCards();
}

// Render lista de barberos
function renderBarberList() {
  listContainer.innerHTML = '';
  barberos.forEach(barber => {
    const card = document.createElement('div');
    card.className = 'col-12 col-md-6 mb-3';
    card.innerHTML = `
      <div class="card" role="button" tabindex="0">
        <img src="${barber.fotos[0]}" class="card-img-top" alt="${barber.nombre}">
        <div class="card-body">
          <h5 class="card-title text-warning">${barber.nombre}</h5>
          <p class="card-text">${barber.precio}</p>
          <button class="btn btn-outline-warning w-100 btn-view-profile">Ver más</button>
        </div>
      </div>
    `;
    card.querySelector('.btn-view-profile').addEventListener('click', () => openProfile(barber));
    listContainer.appendChild(card);
  });
}

// Render tarjetas swipe
function renderSwipeCards() {
  swipeContainer.innerHTML = '';
  currentCards = [];
  currentIndex = 0;
  barberos.forEach((barber, index) => {
    const card = createSwipeCard(barber, index);
    swipeContainer.appendChild(card);
    currentCards.push(card);
  });
  updateCards
