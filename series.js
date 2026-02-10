/* ================= CONFIG ================= */

const API_KEY = 'e33ea358df3fec9b511058ec9ef1701f';
const BASE_URL = 'https://api.themoviedb.org/3';

const containerFilmes = document.getElementById('tmdb-filmes');
const containerSeries = document.getElementById('tmdb-series');

const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('#filter-buttons .tab-btn');

/* ================= PLATFORM FILMES ================= */

async function buscarPlataforma(filmeId) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${filmeId}/watch/providers?api_key=${API_KEY}`);
    const dados = await res.json();

    const providersBR = dados.results?.BR;
    if (!providersBR || !providersBR.flatrate) return 'Cinemas';

    const plataformas = providersBR.flatrate.map(p => p.provider_name);

    if (plataformas.includes('Netflix')) return 'Netflix';
    if (plataformas.includes('Prime Video')) return 'Prime Video';
    if (plataformas.includes('Disney Plus')) return 'Disney+';

    return 'Outros';
  } catch {
    return 'Cinemas';
  }
}

/* ================= CARD FILME ================= */

async function criarCardFilme(filme) {
  const poster = filme.poster_path
    ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
    : 'img/poster-placeholder.jpg';

  const plataforma = await buscarPlataforma(filme.id);

  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-platform', plataforma.toLowerCase());

  card.innerHTML = `
    <img src="${poster}" alt="${filme.title}" loading="lazy">

    <div class="card-content">
      <h3>${filme.title}</h3>
      <p>📅 ${filme.release_date || 'N/A'}</p>
      <span class="tag">${plataforma}</span>

      <div class="btn-wrapper">
        <a href="https://www.themoviedb.org/movie/${filme.id}" target="_blank" class="btn-red">
          Saiba Mais
        </a>
      </div>
    </div>
  `;

  return card;
}

/* ================= CARD SÉRIE ================= */

function criarCardSerie(serie) {
  const poster = serie.poster_path
    ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
    : 'img/poster-placeholder.jpg';

  const plataforma = 'Outros';

  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-platform', plataforma.toLowerCase());

  card.innerHTML = `
    <img src="${poster}" alt="${serie.name}" loading="lazy">

    <div class="card-content">
      <h3>${serie.name}</h3>
      <p>📅 ${serie.first_air_date || 'N/A'}</p>
      <span class="tag">${plataforma}</span>

      <div class="btn-wrapper">
        <a href="https://www.themoviedb.org/tv/${serie.id}" target="_blank" class="btn-red">
          Saiba Mais
        </a>
      </div>
    </div>
  `;

  return card;
}

/* ================= FILMES ================= */

async function carregarFilmes() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`);
  const dados = await res.json();

  containerFilmes.innerHTML = '';

  const cards = await Promise.all(dados.results.map(criarCardFilme));
  cards.forEach(c => containerFilmes.appendChild(c));

  aplicarFiltro();
}

async function buscarFilmes(query) {
  if (!query) return carregarFilmes();

  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`);
  const dados = await res.json();

  containerFilmes.innerHTML = '';

  const cards = await Promise.all(dados.results.map(criarCardFilme));
  cards.forEach(c => containerFilmes.appendChild(c));

  aplicarFiltro();
}

/* ================= SÉRIES ================= */

async function carregarSeries() {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=1`);
  const dados = await res.json();

  containerSeries.innerHTML = '';

  dados.results.forEach(serie => {
    containerSeries.appendChild(criarCardSerie(serie));
  });

  aplicarFiltro();
}

async function buscarSeries(query) {
  if (!query) return carregarSeries();

  const res = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${query}`);
  const dados = await res.json();

  containerSeries.innerHTML = '';

  dados.results.forEach(serie => {
    containerSeries.appendChild(criarCardSerie(serie));
  });

  aplicarFiltro();
}

/* ================= FILTRO ================= */

function aplicarFiltro() {
  const active = document
    .querySelector('#filter-buttons .tab-btn.active')
    .getAttribute('data-platform')
    .toLowerCase();

  document.querySelectorAll('.card').forEach(card => {
    const p = card.getAttribute('data-platform') || 'all';

    if (active === 'all' || p.includes(active)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ================= EVENTOS ================= */

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    aplicarFiltro();
  });
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const q = searchInput.value.trim();
    buscarFilmes(q);
    buscarSeries(q);
  }
});

/* ================= INIT ================= */

document.addEventListener('DOMContentLoaded', () => {
  carregarFilmes();
  carregarSeries();
});