
    const API_KEY = 'e33ea358df3fec9b511058ec9ef1701f';
    const BASE_URL = 'https://api.themoviedb.org/3';

    const containerSeries = document.getElementById('tmdb-series');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('#filter-buttons .tab-btn');

    // Função para criar o card da série, com data-platform simples para filtro
    function criarCardSerie(serie) {
      const posterUrl = serie.poster_path
        ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
        : 'img/poster-placeholder.jpg';

      // Exemplo genérico: coloque as plataformas que desejar aqui separadas por vírgula, minúsculas
      // Você pode personalizar para cada série se quiser.
      // Por enquanto todas têm todas as plataformas para exemplo
      const plataformasExemplo = "netflix,prime video,disney+,amc";

      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-platform', plataformasExemplo);

      card.innerHTML = `
        <img src="${posterUrl}" alt="${serie.name}" loading="lazy" />
        <h3>${serie.name}</h3>
        <p>Primeira exibição: ${serie.first_air_date || 'N/A'}</p>
        <div class="btn-wrapper">
          <a href="https://www.themoviedb.org/tv/${serie.id}" target="_blank" class="btn-red">Saiba Mais</a>
        </div>
      `;
      return card;
    }

    // Carrega séries populares
    async function carregarSeriesPopulares() {
      try {
        const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=1`);
        if (!res.ok) throw new Error('Erro ao buscar séries populares');
        const dados = await res.json();

        containerSeries.innerHTML = '';
        dados.results.forEach(serie => {
          const card = criarCardSerie(serie);
          containerSeries.appendChild(card);
        });
        aplicarFiltro();
      } catch (err) {
        console.error(err);
        containerSeries.innerHTML = '<p>Erro ao carregar séries.</p>';
      }
    }

    // Busca séries por termo
    async function buscarSeries(query) {
      if (!query) {
        carregarSeriesPopulares();
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
        if (!res.ok) throw new Error('Erro na busca');
        const dados = await res.json();

        containerSeries.innerHTML = '';
        if (dados.results.length === 0) {
          containerSeries.innerHTML = '<p>Nenhuma série encontrada.</p>';
          return;
        }

        dados.results.forEach(serie => {
          const card = criarCardSerie(serie);
          containerSeries.appendChild(card);
        });
        aplicarFiltro();
      } catch (err) {
        console.error(err);
        containerSeries.innerHTML = '<p>Erro ao buscar séries.</p>';
      }
    }

    // Filtro simples que verifica se plataforma está no atributo data-platform do card
    function aplicarFiltro() {
      const activePlatform = document.querySelector('#filter-buttons .tab-btn.active').getAttribute('data-platform').toLowerCase();
      const cards = containerSeries.querySelectorAll('.card');

      cards.forEach(card => {
        const plataformas = card.getAttribute('data-platform').toLowerCase();
        if (activePlatform === 'all' || plataformas.includes(activePlatform)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Eventos filtro por plataforma
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        aplicarFiltro();
      });
    });

    // Evento para buscar ao pressionar Enter no campo de pesquisa
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        buscarSeries(query);
      }
    });

    // Inicializa com séries populares
    document.addEventListener('DOMContentLoaded', () => {
      carregarSeriesPopulares();
    });
