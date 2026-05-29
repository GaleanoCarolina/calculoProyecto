document.addEventListener('DOMContentLoaded', () => {
    // 1. FÓRMULAS AL PORTAPAPELES
    const copyBtns = document.querySelectorAll('.btn-copy');
    const toast = document.getElementById('toast');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const formula = e.target.getAttribute('data-formula');
            navigator.clipboard.writeText(formula).then(() => {
                toast.classList.add('show');
                setTimeout(() => { toast.classList.remove('show'); }, 2000);
            });
        });
    });

    // 2. BUSCADOR FAQ
    const searchInput = document.getElementById('faq-search');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqTitles = document.querySelectorAll('.faq-category-title');
    const noFaqMsg = document.getElementById('no-faq-msg');

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            let visibleCount = 0;

            faqItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if(text.includes(val)) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });

            // Ocultar títulos si hay búsqueda
            faqTitles.forEach(t => t.style.display = val === '' ? 'block' : 'none');
            
            if(visibleCount === 0 && val !== '') {
                noFaqMsg.classList.remove('hidden');
            } else {
                noFaqMsg.classList.add('hidden');
            }
        });
    }

    // 3. VIDEOS PLACEHOLDERS (ARREGLO EXACTO DE 10 VIDEOS SOLICITADO)
    const videos = [
        { id: 1, categoria: "Límites al infinito", titulo: "Límite racional con grados iguales", descripcion: "Resolución paso a paso comparando coeficientes principales.", youtubeId: "", estado: "Próximamente" },
        { id: 2, categoria: "Derivadas básicas", titulo: "Regla de la potencia paso a paso", descripcion: "Cómo derivar potencias de x correctamente.", youtubeId: "", estado: "Próximamente" },
        { id: 3, categoria: "Límites al infinito", titulo: "Cuando el denominador domina", descripcion: "Ejercicio cuyo resultado se aproxima a cero.", youtubeId: "", estado: "Próximamente" },
        { id: 4, categoria: "Derivadas básicas", titulo: "Derivada de un polinomio", descripcion: "Aplicación término por término.", youtubeId: "", estado: "Próximamente" },
        { id: 5, categoria: "Límites al infinito", titulo: "Asíntotas horizontales", descripcion: "Cómo identificar el valor de la asíntota.", youtubeId: "", estado: "Próximamente" },
        { id: 6, categoria: "Derivadas básicas", titulo: "Derivada de funciones con raíz", descripcion: "Conversión a exponentes fraccionarios.", youtubeId: "", estado: "Próximamente" },
        { id: 7, categoria: "Límites al infinito", titulo: "Racionalización en límites con raíces", descripcion: "Uso del conjugado para resolver una indeterminación.", youtubeId: "", estado: "Próximamente" },
        { id: 8, categoria: "Derivadas básicas", titulo: "Recta tangente y significado de la derivada", descripcion: "Interpretación gráfica de la pendiente.", youtubeId: "", estado: "Próximamente" },
        { id: 9, categoria: "Límites al infinito", titulo: "Análisis de signo cuando x tiende a −∞", descripcion: "Cómo determinar si el resultado es positivo o negativo.", youtubeId: "", estado: "Próximamente" },
        { id: 10, categoria: "Derivadas básicas", titulo: "Introducción a la regla de la cadena", descripcion: "Identificación de función interna y externa.", youtubeId: "", estado: "Próximamente" }
    ];

    const videoGrid = document.getElementById('video-grid');
    const ytModal = document.getElementById('yt-modal');
    const iframeContainer = document.getElementById('iframe-container');
    const closeModal = document.querySelector('.close-modal');

    function renderVideos(filterCat = "Todos") {
        if(!videoGrid) return;
        videoGrid.innerHTML = '';
        videos.forEach(v => {
            if(filterCat === "Todos" || v.categoria === filterCat) {
                const isReady = v.youtubeId !== "";
                const btnClass = isReady ? "btn-primary btn-yt" : "btn-outline disabled";
                const btnText = isReady ? "Ver tutorial" : "Video próximamente";
                
                const card = document.createElement('div');
                card.className = 'video-card fade-in visible';
                card.innerHTML = `
                    <div class="video-thumb">
                        <div class="play-btn">▶</div>
                        <span class="video-badge">${v.estado}</span>
                    </div>
                    <div class="video-info">
                        <span class="video-category">0${v.id} - ${v.categoria}</span>
                        <h4>${v.titulo}</h4>
                        <p class="text-sm text-sec mb-2">${v.descripcion}</p>
                        <button class="btn ${btnClass} mt-1 w-100" data-id="${v.youtubeId}">${btnText}</button>
                    </div>
                `;
                videoGrid.appendChild(card);
            }
        });

        // Eventos para abrir modal
        document.querySelectorAll('.btn-yt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if(id) {
                    iframeContainer.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                    ytModal.classList.add('show');
                }
            });
        });
    }

    if(videoGrid) renderVideos();

    // Filtros de videos
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderVideos(e.target.getAttribute('data-filter'));
        });
    });

    // Cerrar modal
    if(ytModal) {
        const closeMod = () => {
            ytModal.classList.remove('show');
            setTimeout(() => iframeContainer.innerHTML = '', 300);
        };
        closeModal.addEventListener('click', closeMod);
        window.addEventListener('click', (e) => { if(e.target === ytModal) closeMod(); });
        document.addEventListener('keydown', (e) => { if(e.key === "Escape" && ytModal.classList.contains('show')) closeMod(); });
    }
});