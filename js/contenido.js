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

    // 3. VIDEOS, NOMBRES DE ESTUDIANTES Y MINIATURAS (¡Colección Completa!)
    const videos = [
        { id: 1, categoria: "Límites al infinito", titulo: "Resolviendo ejercicios", estudiante: "Krystel Alvarado", youtubeId: "couOuhnHjJ0", estado: "Disponible" },
        { id: 2, categoria: "Derivadas básicas", titulo: "Resolviendo ejercicios", estudiante: "Krystel Alvarado", youtubeId: "HRtEM2dYosc", estado: "Disponible" },
        { id: 3, categoria: "Límites al infinito", titulo: "Resolviendo ejercicios", estudiante: "Rocio Ruano", youtubeId: "VY3FJipYg1s", estado: "Disponible" },
        { id: 4, categoria: "Derivadas básicas", titulo: "Resolviendo ejercicios", estudiante: "Rocio Ruano", youtubeId: "g0dcFjeYVyE", estado: "Disponible" },
        { id: 5, categoria: "Derivadas básicas", titulo: "Resolviendo ejercicios", estudiante: "Krystel Canas", youtubeId: "QY77oZ0MsUA", estado: "Disponible" },
        { id: 6, categoria: "Límites al infinito", titulo: "Resolviendo ejercicios", estudiante: "Krystel Canas", youtubeId: "FQIdZJIJp2s", estado: "Disponible" },
        { id: 7, categoria: "Límites al infinito", titulo: "Resolviendo ejercicios", estudiante: "Adriana Cruz", youtubeId: "lC_tiqJ97uU", estado: "Disponible" },
        { id: 8, categoria: "Derivadas básicas", titulo: "Resolviendo ejercicios", estudiante: "Adriana Cruz", youtubeId: "VBVQ8Fmr7-o", estado: "Disponible" },
        { id: 9, categoria: "Límites al infinito", titulo: "Resolviendo ejercicios", estudiante: "Genesis Galeano", youtubeId: "sX1Q-RRur-s", estado: "Disponible" },
        { id: 10, categoria: "Derivadas básicas", titulo: "Resolviendo ejercicios", estudiante: "Genesis Galeano", youtubeId: "ZOtm4J5YtVM", estado: "Disponible" }
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
                
                // Si el video está disponible, extraemos la miniatura de YouTube, si no, se queda el degradado
                const thumbStyle = isReady ? `style="background-image: url('https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg'); background-size: cover; background-position: center;"` : '';
                
                const card = document.createElement('div');
                card.className = 'video-card fade-in visible';
                
                card.innerHTML = `
                    <div class="video-thumb" ${thumbStyle}>
                        <div class="play-btn" ${isReady ? `data-id="${v.youtubeId}"` : ''}>▶</div>
                        <span class="video-badge">${v.estado}</span>
                    </div>
                    <div class="video-info">
                        <span class="video-category">0${v.id} - ${v.categoria}</span>
                        <h4 style="margin-bottom: auto;">${v.titulo}</h4>
                        <p class="text-sm text-purple mt-2 mb-2" style="font-weight: 600;">👨‍🎓 Estudiante: <span style="font-weight: normal; color: var(--text-main);">${v.estudiante}</span></p>
                        <button class="btn ${btnClass} mt-1 w-100" data-id="${v.youtubeId}">${btnText}</button>
                    </div>
                `;
                videoGrid.appendChild(card);
            }
        });

        // Eventos para abrir modal de YouTube
        document.querySelectorAll('.btn-yt, .play-btn').forEach(btn => {
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