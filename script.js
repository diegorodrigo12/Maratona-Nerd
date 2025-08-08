 /* ======= Pagina Index ======= */


  /* ======= Espera o DOM estar pronto ======= */
  document.addEventListener('DOMContentLoaded', () => {
    /* ======= TABS ======= */
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });

    /* ======= ENQUETES ======= */
    const pollsData = [
      {
        id: 'poll1',
        question: 'Qual foi o melhor vilão da Marvel nos cinemas?',
        options: ['Thanos', 'Loki', 'Killmonger', 'Duende Verde'],
      },
      {
        id: 'poll2',
        question: 'Qual série você mais espera em 2025?',
        options: ['Stranger Things (final)', 'The Last of Us T2', 'The Boys T5', 'House of the Dragon T2'],
      }
    ];

    function getPollVotes(id) {
      const stored = localStorage.getItem('poll_' + id);
      return stored ? JSON.parse(stored) : Array(pollsData.find(p => p.id === id).options.length).fill(0);
    }

    function setPollVotes(id, votes) {
      localStorage.setItem('poll_' + id, JSON.stringify(votes));
    }

    function hasVoted(id) {
      return localStorage.getItem('poll_voted_' + id) === 'true';
    }

    function markVoted(id) {
      localStorage.setItem('poll_voted_' + id, 'true');
    }

    function renderPolls() {
      const root = document.getElementById('polls-root');
      root.innerHTML = '';

      pollsData.forEach(poll => {
        const votes = getPollVotes(poll.id);
        const total = votes.reduce((a, b) => a + b, 0) || 1;

        const card = document.createElement('div');
        card.className = 'poll-card';

        const title = document.createElement('h4');
        title.textContent = poll.question;
        card.appendChild(title);

        const form = document.createElement('div');
        poll.options.forEach((opt, i) => {
          const wrap = document.createElement('label');
          wrap.className = 'poll-option';

          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = poll.id;
          radio.value = i;
          radio.disabled = hasVoted(poll.id);

          const span = document.createElement('span');
          span.textContent = opt;

          wrap.appendChild(radio);
          wrap.appendChild(span);
          form.appendChild(wrap);
        });
        card.appendChild(form);

        const voteBtn = document.createElement('button');
        voteBtn.className = 'vote-btn';
        voteBtn.textContent = hasVoted(poll.id) ? 'Voto registrado' : 'Votar';
        voteBtn.disabled = hasVoted(poll.id);
        voteBtn.addEventListener('click', () => {
          const selected = form.querySelector('input[type="radio"]:checked');
          if (!selected) return alert('Escolha uma opção!');
          const index = parseInt(selected.value, 10);
          const v = getPollVotes(poll.id);
          v[index] += 1;
          setPollVotes(poll.id, v);
          markVoted(poll.id);
          renderPolls();
        });
        card.appendChild(voteBtn);

        const results = document.createElement('div');
        results.className = 'poll-results';

        poll.options.forEach((opt, i) => {
          const percent = Math.round((votes[i] / total) * 100);
          const line = document.createElement('div');
          line.innerHTML = `<strong>${opt}</strong> — ${votes[i]} voto(s) (${percent}%)`;
          const barWrap = document.createElement('div');
          barWrap.className = 'bar-wrap';
          const bar = document.createElement('div');
          bar.className = 'bar';
          bar.style.width = percent + '%';
          barWrap.appendChild(bar);
          results.appendChild(line);
          results.appendChild(barWrap);
        });

        card.appendChild(results);
        root.appendChild(card);
      });
    }
    renderPolls();

    /* ======= QUIZ ======= */
    const quizAnswers = { q1: 'b', q2: 'b', q3: 'b' };
    document.getElementById('quiz-form').addEventListener('submit', (e) => {
      e.preventDefault();
      let score = 0, total = Object.keys(quizAnswers).length;
      Object.keys(quizAnswers).forEach(q => {
        const selected = document.querySelector(`input[name="${q}"]:checked`);
        if (selected && selected.value === quizAnswers[q]) score++;
      });
      const msg = `Você acertou ${score} de ${total}!`;
      const res = document.getElementById('quiz-result');
      res.textContent = msg;
    });

    /* ======= COMENTÁRIOS ======= */
    function getComments() {
      const data = localStorage.getItem('comments');
      return data ? JSON.parse(data) : [];
    }

    function saveComments(list) {
      localStorage.setItem('comments', JSON.stringify(list));
    }

    function renderComments() {
      const container = document.getElementById('comments-list');
      container.innerHTML = '';
      const comments = getComments().reverse();
      comments.forEach(c => {
        const item = document.createElement('div');
        item.className = 'comment-item';
        item.innerHTML = `
  <div class="author">${c.name}</div>
  <div class="text">${c.text}</div>
  <div class="date">${new Date(c.date).toLocaleString()}</div>
  `;
        container.appendChild(item);
      });
    }
    renderComments();

    document.getElementById('comment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('comment-name').value.trim();
      const text = document.getElementById('comment-text').value.trim();
      if (!name || !text) return;
      const comments = getComments();
      comments.push({ name, text, date: Date.now() });
      saveComments(comments);
      document.getElementById('comment-form').reset();
      renderComments();
    });

    /* ======= CAMPO DE BUSCA ======= */
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.grid .card');

    searchInput.addEventListener('input', () => {
      const filter = searchInput.value.toLowerCase();

      cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  const API_KEY = 'e33ea358df3fec9b511058ec9ef1701f'; // substitua pela sua chave TMDB
  const BASE_URL = 'https://api.themoviedb.org/3';

  async function carregarFilmesTMDB() {
    try {
      const resposta = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`);
      if (!resposta.ok) throw new Error('Erro ao buscar filmes: ' + resposta.status);
      const dados = await resposta.json();

      const container = document.getElementById('tmdb-filmes');
      container.innerHTML = ''; // Limpa antes de adicionar

      dados.results.forEach(filme => {
        const card = document.createElement('div');
        card.className = 'card'; // reutiliza sua classe card para estilo

        // URL da imagem do poster
        const posterUrl = filme.poster_path
          ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
          : 'img/poster-placeholder.jpg'; // uma imagem fallback

        card.innerHTML = `
        <img src="${posterUrl}" alt="${filme.title}" loading="lazy" />
        <h3>${filme.title}</h3>
        <p>Data de lançamento: ${filme.release_date || 'N/A'}</p>
        <div class="btn-wrapper">
          <a href="https://www.themoviedb.org/movie/${filme.id}" target="_blank" class="btn-red">Saiba Mais</a>
        </div>
      `;
        container.appendChild(card);
      });

    } catch (error) {
      console.error(error);
    }
  }

  // Chama para carregar assim que a página estiver pronta
  document.addEventListener('DOMContentLoaded', carregarFilmesTMDB);

  const slides = document.querySelectorAll(".carrossel-em-alta .slide");
  const dots = document.querySelectorAll(".carrossel-dots .dot");
  let currentIndex = 0;
  let intervalId;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      dots[i].classList.toggle("active", i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function startAutoSlide() {
    intervalId = setInterval(nextSlide, 6000);
  }

  function stopAutoSlide() {
    clearInterval(intervalId);
  }

  // Inicializa
  showSlide(0);
  startAutoSlide();

  // Evento click nos dots
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      stopAutoSlide();
      showSlide(parseInt(dot.dataset.index));
      startAutoSlide();
    });
  });

  // Publicar Comentarios Inifinity
  document.getElementById('comment-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('comment-name').value;
    const comentario = document.getElementById('comment-text').value;

    const resposta = await fetch('https://maratonandogeek.infinityfreeapp.com/salvar_comentario.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, comentario })
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      alert('Comentário publicado!');
      document.getElementById('comment-form').reset();
    } else {
      alert('Erro: ' + (resultado.erro || 'Não foi possível publicar.'));
    }
  });



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


