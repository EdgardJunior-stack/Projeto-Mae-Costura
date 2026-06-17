document.addEventListener('DOMContentLoaded', function() {
	const hamburger = document.querySelector('.hamburger');
	const header = document.querySelector('.cabecalho');
	const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
	const parallaxImage = document.querySelector('#parallax_placeholder .img-background');
	const parallaxItems = document.querySelectorAll('.parallax-item');

	function updateScrollOffset() {
		if (!header) return;
		const h = header.offsetHeight;
		document.documentElement.style.setProperty('--scroll-offset', h + 'px');
	}

	function debounce(fn, time) {
		let timer;
		return function() {
			clearTimeout(timer);
			timer = setTimeout(fn, time);
		};
	}

	if (hamburger && header) {
		hamburger.addEventListener('click', function(e) {
			e.stopPropagation();
			header.classList.toggle('nav-open');
		});

		document.addEventListener('click', function(e) {
			if (!header.contains(e.target)) {
				header.classList.remove('nav-open');
			}
		});

		window.addEventListener('resize', debounce(updateScrollOffset, 120));
		updateScrollOffset();
	}

	navLinks.forEach(function(link) {
		link.addEventListener('click', function(e) {
			const href = this.getAttribute('href');
			if (href && href.startsWith('#')) {
				const target = document.querySelector(href);
				if (target) {
					e.preventDefault();
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
					if (header) header.classList.remove('nav-open');
					this.classList.add('clicked');
					setTimeout(() => this.classList.remove('clicked'), 220);

					// se quiser forçar um reveal imediato em cascata ao clicar
					const items = target.querySelectorAll('.parallax-item');
					const stagger = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--reveal-stagger')) || 90;
					if (items.length) {
						items.forEach((it, idx) => {
							const delay = (idx * stagger) + 'ms';
							it.style.setProperty('--delay', delay);
							// adiciona a classe visible (observer também cuidará dos demais)
							setTimeout(() => it.classList.add('visible'), 120);
						});
					} else if (target.classList && target.classList.contains('parallax-item')) {
						target.style.setProperty('--delay', '0ms');
						setTimeout(() => target.classList.add('visible'), 120);
					}
				}
			}
		});
	});

	function updateParallaxImage() {
		if (!parallaxImage) return;
		const rect = parallaxImage.parentElement.getBoundingClientRect();
		const speed = 0.18;
		const offset = rect.top * speed;
		parallaxImage.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
	}

	// IntersectionObserver: revela itens `.parallax-item` ao entrarem na viewport (toggle para reapper)
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			const el = entry.target;
			// se houver index definido, usa; senão usamos dataset.index preenchido abaixo
			const idx = parseInt(el.dataset.index || 0);
			const stagger = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--reveal-stagger')) || 90;
			const delay = el.dataset.delay ? el.dataset.delay : (idx * stagger) + 'ms';
			el.style.setProperty('--delay', delay);

			if (entry.isIntersecting) {
				el.classList.add('visible');
			} else {
				el.classList.remove('visible');
			}
		});
	}, { threshold: 0.12 });

	// atribui índice e observa cada item
	parallaxItems.forEach((el, i) => {
		el.dataset.index = i;
		observer.observe(el);
	});

	// somente atualiza a imagem principal (parallax do topo) no scroll/resize
	window.addEventListener('scroll', function() {
		updateParallaxImage();
	}, { passive: true });

	window.addEventListener('resize', function() {
		updateParallaxImage();
	});

	updateParallaxImage();
});

