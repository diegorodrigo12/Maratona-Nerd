 /* ======= Pagina Filmes ======= */

    const API_KEY = 'e33ea358df3fec9b511058ec9ef1701f';
    const BASE_URL = 'https://api.themoviedb.org/3';

    const container = document.getElementById('tmdb-filmes');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('#filter-buttons .tab-btn');

    // Função para buscar plataformas de streaming e retornar a principal que você quer usar
    async function buscarPlataforma(filmeId) {
      try {
        const res = await fetch(`${BASE_URL}/movie/${filmeId}/watch/providers?api_key=${API_KEY}`);
        if (!res.ok) throw new Error('Erro ao buscar providers');
        const dados = await res.json();

        // A API tem providers por país, vamos usar 'BR' (Brasil) se disponível
        const providersBR = dados.results?.BR;
        if (!providersBR) return 'Cinemas'; // fallback se não encontrado

        // providersBR pode ter flatrate (streaming), rent, buy
        if (providersBR.flatrate) {
          // Pegamos o nome da primeira plataforma que oferece streaming
          const plataformas = providersBR.flatrate.map(p => p.provider_name);

          // Defina regras para escolher uma plataforma que você quer filtrar:
          if (plataformas.includes('Netflix')) return 'Netflix';
          if (plataformas.includes('Prime Video')) return 'Prime Video';
          if (plataformas.includes('Disney Plus')) return 'Disney+';

          // Se não for nenhuma acima, retornar 'Outros'
          return 'Outros';
        }

        // Se só tiver para aluguel ou compra, considera 'Cinemas' ou 'Outros'
        return 'Cinemas';

      } catch {
        return 'Cinemas'; // erro na busca
      }
    }

    async function criarCardFilme(filme) {
      const posterUrl = filme.poster_path
        ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
        : 'img/poster-placeholder.jpg';

      // Buscando a plataforma do filme antes de criar o card
      const plataforma = await buscarPlataforma(filme.id);

      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-platform', plataforma);

      card.innerHTML = `
    <img src="${posterUrl}" alt="${filme.title}" loading="lazy" />
    <h3>${filme.title}</h3>
    <p>Data de lançamento: ${filme.release_date || 'N/A'}</p>
    <span class="tag">${plataforma}</span>
    <div class="btn-wrapper">
      <a href="https://www.themoviedb.org/movie/${filme.id}" target="_blank" class="btn-red">Saiba Mais</a>
    </div>
  `;

      return card;
    }

    async function carregarFilmesPopulares() {
      try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`);
        if (!res.ok) throw new Error('Erro ao buscar filmes populares');
        const dados = await res.json();

        container.innerHTML = '';
        // Para evitar carregar todos em sequência (muito lento), carregue com Promise.all
        const cardsPromises = dados.results.map(filme => criarCardFilme(filme));
        const cards = await Promise.all(cardsPromises);

        cards.forEach(card => container.appendChild(card));

        // Aplica o filtro atual
        const plataformaAtiva = document.querySelector('#filter-buttons .tab-btn.active').getAttribute('data-platform');
        const textoBusca = searchInput.value.trim().toLowerCase();
        filterCards(plataformaAtiva, textoBusca);

      } catch (err) {
        console.error(err);
        container.innerHTML = '<p>Erro ao carregar filmes.</p>';
      }
    }

    async function buscarFilmes(query) {
      if (!query) {
        carregarFilmesPopulares();
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
        if (!res.ok) throw new Error('Erro na busca');
        const dados = await res.json();

        container.innerHTML = '';
        if (dados.results.length === 0) {
          container.innerHTML = '<p>Nenhum filme encontrado.</p>';
          return;
        }

        const cardsPromises = dados.results.map(filme => criarCardFilme(filme));
        const cards = await Promise.all(cardsPromises);
        cards.forEach(card => container.appendChild(card));

        const plataformaAtiva = document.querySelector('#filter-buttons .tab-btn.active').getAttribute('data-platform');
        const textoBusca = searchInput.value.trim().toLowerCase();
        filterCards(plataformaAtiva, textoBusca);

      } catch (err) {
        console.error(err);
        container.innerHTML = '<p>Erro ao buscar filmes.</p>';
      }
    }

    // Filtra os cards visíveis baseado na plataforma e texto de busca localmente
    function filterCards(platform, searchText) {
      const cards = document.querySelectorAll('.card');

      cards.forEach(card => {
        const cardPlatform = card.getAttribute('data-platform') || 'all';
        const title = card.querySelector('h3').textContent.toLowerCase();

        const platformMatch = platform === 'all' || cardPlatform === platform;
        const textMatch = title.includes(searchText);

        if (platformMatch && textMatch) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Eventos para filtro por plataforma (botões)
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const plataforma = button.getAttribute('data-platform');
        const textoBusca = searchInput.value.trim().toLowerCase();

        filterCards(plataforma, textoBusca);
      });
    });

    // Evento para busca ao pressionar Enter no campo de texto
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        buscarFilmes(query);
      }
    });

    // Inicializa a página carregando os filmes populares
    document.addEventListener('DOMContentLoaded', () => {
      carregarFilmesPopulares();
    });


