  let categoriaSelecionada = 'all';

    function filtrarReviews(categoria, textoBusca) {
      const texto = textoBusca.toLowerCase();

      document.querySelectorAll('.review-card').forEach(card => {
        const categorias = card.dataset.category.split(' ');
        const titulo = card.querySelector('.review-title').textContent.toLowerCase();

        const correspondeCategoria = categoria === 'all' || categorias.includes(categoria);
        const correspondeBusca = titulo.includes(texto);

        if (correspondeCategoria && correspondeBusca) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      // Atualiza os botões ativos
      document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.category === categoria) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      filtrarReviews(categoriaSelecionada, '');
    });

    // Evento para filtro de categoria
    document.querySelectorAll('.tab-btn').forEach(button => {
      button.addEventListener('click', () => {
        categoriaSelecionada = button.getAttribute('data-category');
        const textoBusca = document.getElementById('search-input').value || '';
        filtrarReviews(categoriaSelecionada, textoBusca);
      });
    });

    // Evento para busca em tempo real
    document.getElementById('search-input').addEventListener('input', (e) => {
      const textoBusca = e.target.value;
      filtrarReviews(categoriaSelecionada, textoBusca);
    });



    // Quantidade de cards por página
    const cardsPorPagina = 4;
    let paginaAtual = 0;

    const grid = document.querySelector('.grid');
    const cards = Array.from(grid.querySelectorAll('.review-card'));
    const totalPaginas = Math.ceil(cards.length / cardsPorPagina);

    function mostrarPagina(pagina) {
      // Fade out
      grid.style.opacity = 0;

      setTimeout(() => {
        // Esconde todos os cards
        cards.forEach(card => (card.style.display = 'none'));

        // Calcula quais cards mostrar
        const start = pagina * cardsPorPagina;
        const end = start + cardsPorPagina;

        // Mostra os cards da página atual
        cards.slice(start, end).forEach(card => (card.style.display = 'block'));

        // Fade in
        grid.style.opacity = 1;
      }, 300);
    }

    // Mostrar a primeira página ao carregar
    mostrarPagina(paginaAtual);

    // Controla clique no botão Carregar Mais
    const btnLoadMore = document.getElementById('loadMoreBtn');
    btnLoadMore.addEventListener('click', () => {
      paginaAtual++;
      if (paginaAtual >= totalPaginas) {
        paginaAtual = 0; // volta para a primeira página
      }
      mostrarPagina(paginaAtual);
    });
