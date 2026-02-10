/* ======= Pagina Filmes (versão otimizada) ======= */

const API_KEY = 'e33ea358df3fec9b511058ec9ef1701f';
const BASE_URL = 'https://api.themoviedb.org/3';

const container = document.getElementById('tmdb-filmes');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('#filter-buttons .tab-btn');

/* Cache para não chamar API toda hora */
const plataformaCache = new Map();

/* Formatar data */
function formatarData(data) {
  if (!data) return 'N/A';
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

/* ===== Buscar plataforma ===== */
async function buscarPlataforma(filmeId) {
  if (plataformaCache.has(filmeId)) return plataformaCache.get(filmeId);

  try {
    const res = await fetch(`${BASE_URL}/movie/${filmeId}/watch/providers?api_key=${API_KEY}`);
    const dados = await res.json();

    const providersBR = dados.results?.BR;

    let plataforma = 'Cinemas';

    if (providersBR?.flatrate) {
      const nomes = providersBR.flatrate.map(p => p.provider_name);

      if (nomes.includes('Netflix')) plataforma = 'Netflix';
      else if (nomes.includes('Prime Video')) plataforma = 'Prime Video';
      else if (nomes.includes('Disney Plus')) plataforma = 'Disney+';
      else plataforma = 'Outros';
    }

    plataformaCache.set(filmeId, plataforma);
    return plataforma;

  } catch {
    return 'Cinemas';
  }
}

/* ===== Criar Card ===== */
async function criarCardFilme(filme) {

  const posterUrl = filme.poster_path
    ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
    : 'img/poster-placeholder.jpg';

  const plataforma = await buscarPlataforma(filme.id);

  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-platform', plataforma);

  card.innerHTML = `
<img src="${posterUrl}" alt="${filme.title}" loading="lazy" />

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

/* ===== Renderizar lista ===== */
async function renderFilmes(lista) {

  container.innerHTML = '<p>Carregando...</p>';

  const cardsPromises = lista.map(criarCardFilme);
  const cards = await Promise.all(cardsPromises);

  container.innerHTML = '';
  cards.forEach(card => container.appendChild(card));

  aplicarFiltros();
}

/* ===== Filmes populares ===== */
async function carregarFilmesPopulares() {
  try {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
    const dados = await res.json();
    renderFilmes(dados.results);
  } catch {
    container.innerHTML = '<p>Erro ao carregar filmes.</p>';
  }
}

/* ===== Buscar ===== */
async function buscarFilmes(query) {

  if (!query) return carregarFilmesPopulares();

  try {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`);
    const dados = await res.json();

    if (dados.results.length === 0) {
      container.innerHTML = '<p>Nenhum filme encontrado.</p>';
      return;
    }

    renderFilmes(dados.results);

  } catch {
    container.innerHTML = '<p>Erro na busca.</p>';
  }
}

/* ===== Filtros ===== */
function aplicarFiltros() {

  const plataformaAtiva = document.querySelector('.tab-btn.active')?.dataset.platform || 'all';
  const textoBusca = searchInput.value.trim().toLowerCase();

  document.querySelectorAll('.card').forEach(card => {

    const cardPlatform = card.dataset.platform;
    const title = card.querySelector('h3').textContent.toLowerCase();

    const platformMatch = plataformaAtiva === 'all' || cardPlatform === plataformaAtiva;
    const textMatch = title.includes(textoBusca);

    card.style.display = (platformMatch && textMatch) ? 'flex' : 'none';
  });
}

/* ===== Eventos ===== */

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    aplicarFiltros();
  });
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') buscarFilmes(searchInput.value.trim());
});

searchInput.addEventListener('input', aplicarFiltros);

/* ===== Start ===== */
document.addEventListener('DOMContentLoaded', carregarFilmesPopulares);