document.addEventListener('DOMContentLoaded', function() {
	const hamburger = document.querySelector('.hamburger');
	const header = document.querySelector('.cabecalho');

	if (hamburger && header) {
		hamburger.addEventListener('click', function(e) {
			e.stopPropagation();
			header.classList.toggle('nav-open');
			// Atualiza o offset quando o menu abre/fecha
			updateScrollOffset();
		});

		// Fecha o menu ao clicar fora
		document.addEventListener('click', function(e) {
			if (!header.contains(e.target)) {
				header.classList.remove('nav-open');
			}

			// Define uma variável CSS com a altura do header para ajustar o scroll-margin-top
			function updateScrollOffset() {
				if (!header) return;
				// use offsetHeight para incluir padding
				const h = header.offsetHeight;
				document.documentElement.style.setProperty('--scroll-offset', h + 'px');
			}

			// Atualiza no carregamento e quando a janela é redimensionada
			updateScrollOffset();
			window.addEventListener('resize', function() {
				// Debounce simples
				clearTimeout(window._headerResizeTimeout);
				window._headerResizeTimeout = setTimeout(updateScrollOffset, 120);
			});
		});
	}

	// Scroll suave para links internos
	document.querySelectorAll('a[href^="#"]').forEach(function(link) {
		link.addEventListener('click', function(e) {
			const href = this.getAttribute('href');
			if (href && href.startsWith('#')) {
				const target = document.querySelector(href);
				if (target) {
					e.preventDefault();
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
					// Fecha o menu móvel após clicar
					if (header) header.classList.remove('nav-open');
				}
			}
		});
	});
});

