document.addEventListener('DOMContentLoaded', () => {

    // 1. DATOS DEL QUIZ (10 preguntas exactas)
    const quizData = [
        { q: "Si el grado del numerador es menor que el grado del denominador en un límite racional al infinito, ¿cuál suele ser el resultado?", opts: ["A. ∞", "B. 0", "C. 1", "D. No existe"], ans: 1, exp: "El denominador crece más rápido que el numerador, por lo que la fracción se aproxima a cero." },
        { q: "Si lim(x → ∞) f(x) = 4, ¿cuál es la asíntota horizontal?", opts: ["A. x = 4", "B. y = 4", "C. x = 0", "D. y = −4"], ans: 1, exp: "Cuando el límite al infinito vale 4, la gráfica se aproxima a la recta horizontal y = 4." },
        { q: "¿Qué procedimiento suele utilizarse cuando aparece una expresión del tipo ∞ - ∞ con raíces?", opts: ["A. Integrar", "B. Racionalizar", "C. Eliminar la raíz", "D. Sustituir por cero"], ans: 1, exp: "La racionalización mediante el conjugado permite simplificar límites con raíces." },
        { q: "¿Qué representa geométricamente la derivada en un punto?", opts: ["A. Área bajo la curva", "B. Pendiente de la recta tangente", "C. Asíntota vertical", "D. Punto de corte con el eje y"], ans: 1, exp: "La derivada es la pendiente instantánea de la recta tangente a la gráfica." },
        { q: "¿Cuál es la derivada de x³?", opts: ["A. x²", "B. 3x", "C. 3x²", "D. x³"], ans: 2, exp: "Aplicando la regla de la potencia: d/dx(x³) = 3x²." },
        { q: "¿Cuál es la derivada de una constante?", opts: ["A. La misma constante", "B. 1", "C. 0", "D. x"], ans: 2, exp: "Una constante no cambia con respecto a x, por eso su derivada es cero." },
        { q: "¿Qué recta representa la tasa de cambio instantánea?", opts: ["A. Recta vertical", "B. Recta secante", "C. Recta tangente", "D. Asíntota horizontal"], ans: 2, exp: "La recta tangente muestra la pendiente exacta en un punto." },
        { q: "Para derivar √x, ¿qué transformación es útil?", opts: ["A. Escribirla como x²", "B. Escribirla como x^(1/2)", "C. Eliminar la raíz", "D. Convertirla en constante"], ans: 1, exp: "Al expresar la raíz como potencia fraccionaria se puede aplicar la regla de potencia." },
        { q: "Si el numerador y denominador tienen el mismo grado en un límite racional al infinito, ¿qué se debe hacer?", opts: ["A. Sumar exponentes", "B. Dividir coeficientes principales", "C. Racionalizar siempre", "D. El límite siempre es cero"], ans: 1, exp: "Cuando los grados son iguales, el límite se obtiene dividiendo los coeficientes líderes." },
        { q: "¿Cuándo se utiliza la regla de la cadena?", opts: ["A. Cuando existe una función dentro de otra", "B. Cuando solo existe una constante", "C. Cuando el límite vale cero", "D. Cuando aparece una asíntota horizontal"], ans: 0, exp: "La regla de la cadena se aplica cuando una función está compuesta dentro de otra." }
    ];

    let currentQ = 0;
    let score = 0;
    const quizContent = document.getElementById('quiz-content');
    const progressFill = document.getElementById('progress-fill');
    const qCounter = document.getElementById('q-counter');
    const bestScoreDisplay = document.getElementById('best-score-display');

    // Cargar mejor puntaje
    const bestScore = localStorage.getItem('calculaPlusBestScore');
    if(bestScore && bestScoreDisplay) bestScoreDisplay.textContent = `Mejor puntaje: ${bestScore}/10`;

    function loadQuiz() {
        if(!quizContent) return;
        if(currentQ >= quizData.length) { showResult(); return; }
        
        progressFill.style.width = `${(currentQ / quizData.length) * 100}%`;
        qCounter.textContent = `Pregunta ${currentQ + 1} de 10`;
        const q = quizData[currentQ];

        // Añadimos la clase específica 'quiz-btn' para no afectar a los demás botones de la página
        let html = `<div class="q-text">${q.q}</div><div class="opts-container">`;
        q.opts.forEach((opt, idx) => {
            html += `<button class="opt-btn quiz-btn" data-idx="${idx}">${opt}</button>`;
        });
        html += `</div>
                <div class="feedback-box" id="feedback">
                    <p id="feedback-text"></p>
                    <button class="btn btn-primary mt-1" id="next-btn">Siguiente</button>
                </div>`;
        quizContent.innerHTML = html;

        quizContent.querySelectorAll('.quiz-btn').forEach(btn => {
            btn.addEventListener('click', handleAnswer);
        });
    }

    function handleAnswer(e) {
        // CORRECCIÓN DEL BUG: Buscamos y deshabilitamos SOLO los botones que están dentro del contenedor del quiz
        quizContent.querySelectorAll('.quiz-btn').forEach(b => b.disabled = true);
        
        const selected = parseInt(e.target.getAttribute('data-idx'));
        const q = quizData[currentQ];
        const feedback = document.getElementById('feedback');
        const feedbackText = document.getElementById('feedback-text');

        if(selected === q.ans) {
            e.target.classList.add('correct');
            score++;
            feedbackText.innerHTML = `<strong>¡Correcto!</strong> ${q.exp}`;
        } else {
            e.target.classList.add('wrong');
            // Buscamos la respuesta correcta SOLO dentro del quiz
            quizContent.querySelector(`.quiz-btn[data-idx="${q.ans}"]`).classList.add('correct');
            feedbackText.innerHTML = `<strong>Incorrecto.</strong> ${q.exp}`;
        }
        feedback.style.display = 'block';
        
        // Añadimos { once: true } para que el evento no se acumule si el usuario hace clics rápidos
        document.getElementById('next-btn').addEventListener('click', () => { 
            currentQ++; 
            loadQuiz(); 
        }, { once: true });
    }

    function showResult() {
        progressFill.style.width = '100%';
        qCounter.textContent = "Resultados";
        let msg = "";
        if(score >= 9) msg = "Excelente dominio del tema.";
        else if(score >= 7) msg = "Muy buen trabajo, continúa practicando.";
        else if(score >= 5) msg = "Vas avanzando, repasa algunos procedimientos.";
        else msg = "Te recomendamos revisar el contenido y volver a intentarlo.";

        // Guardar mejor puntaje
        const prevBest = localStorage.getItem('calculaPlusBestScore') || 0;
        if(score > prevBest) {
            localStorage.setItem('calculaPlusBestScore', score);
            bestScoreDisplay.textContent = `Mejor puntaje: ${score}/10`;
        }

        quizContent.innerHTML = `
            <div class="text-center">
                <h3 class="text-purple" style="font-size:3.5rem; margin-bottom:10px">${score} / 10</h3>
                <p style="font-size:1.2rem; font-weight:600; margin-bottom:20px">${score * 10}% de aciertos</p>
                <p class="text-sec" style="margin-bottom:30px; font-size:1.1rem;">${msg}</p>
                <button class="btn btn-outline" id="restart-quiz">Intentar nuevamente</button>
            </div>
        `;
        document.getElementById('restart-quiz').addEventListener('click', () => { 
            currentQ = 0; 
            score = 0; 
            loadQuiz(); 
        });
    }

    if(quizContent) loadQuiz();


    // 2. EJERCICIOS MATEMÁTICOS (6 exactos)
    const exData = [
        { t: "Límites", p: "lim(x → ∞) (4x² + 1)/(2x² - 5)", opts: ["A. 0", "B. 1", "C. 2", "D. ∞"], ans: 2, exp: "Ambos polinomios tienen grado 2, por lo tanto se dividen los coeficientes principales: 4/2 = 2." },
        { t: "Límites", p: "lim(x → ∞) (3x + 4)/(x² + 1)", opts: ["A. 0", "B. 3", "C. ∞", "D. −∞"], ans: 0, exp: "El denominador tiene grado mayor que el numerador y crece más rápido, por lo que el límite es cero." },
        { t: "Límites", p: "lim(x → −∞) (5x³)/(x² + 1)", opts: ["A. 0", "B. 5", "C. +∞", "D. −∞"], ans: 3, exp: "La expresión se comporta como 5x³/x² = 5x. Cuando x → −∞, entonces 5x → −∞." },
        { t: "Derivadas", p: "f(x) = 6x³ - 2x", opts: ["A. 18x² - 2", "B. 6x² - 2", "C. 18x³", "D. 3x² - 2"], ans: 0, exp: "La derivada de 6x³ es 18x² y la derivada de −2x es −2." },
        { t: "Derivadas", p: "f(x) = 4x⁴ + 7", opts: ["A. 4x³", "B. 16x³", "C. 16x⁴ + 7", "D. 4x⁴"], ans: 1, exp: "Aplicando regla de potencia, la derivada de 4x⁴ es 16x³; la derivada de 7 es cero." },
        { t: "Derivadas", p: "f(x) = √x", opts: ["A. √x/2", "B. 2√x", "C. 1/(2√x)", "D. x"], ans: 2, exp: "Se convierte √x en x^(1/2) y se aplica la regla de potencia, obteniendo 1/(2√x)." }
    ];

    const exGrid = document.getElementById('exercises-grid');
    if(exGrid) {
        exData.forEach((ex, i) => {
            let html = `
                <div class="card" id="ex-${i}">
                    <div><span class="badge" style="margin-bottom:10px;">${ex.t}</span></div>
                    <div class="formula-box mt-1 mb-2">${ex.p}</div>
                    <div class="ex-opts">`;
            ex.opts.forEach((o, idx) => { 
                html += `<button class="opt-btn ex-btn" data-ex="${i}" data-idx="${idx}">${o}</button>`; 
            });
            html += `</div>
                    <div class="feedback-box ex-fb hidden mt-2">
                        <p class="ex-fb-txt"></p>
                        <p class="text-sm mt-1 text-sec" style="margin-top: 10px;"><strong>Procedimiento:</strong> ${ex.exp}</p>
                    </div>
                </div>`;
            exGrid.innerHTML += html;
        });

        document.querySelectorAll('.ex-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exId = parseInt(e.target.getAttribute('data-ex'));
                const optIdx = parseInt(e.target.getAttribute('data-idx'));
                const card = document.getElementById(`ex-${exId}`);
                const fbBox = card.querySelector('.ex-fb');
                const fbTxt = card.querySelector('.ex-fb-txt');
                
                // Deshabilitamos SOLO los botones dentro de la tarjeta de este ejercicio específico
                card.querySelectorAll('.ex-btn').forEach(b => b.disabled = true);

                if(optIdx === exData[exId].ans) {
                    e.target.classList.add('correct');
                    fbTxt.innerHTML = '<span style="color:#5D8010;font-weight:800;font-size:1.1rem;">✓ Respuesta correcta</span>';
                } else {
                    e.target.classList.add('wrong');
                    card.querySelector(`.ex-btn[data-idx="${exData[exId].ans}"]`).classList.add('correct');
                    fbTxt.innerHTML = '<span style="color:#D32F2F;font-weight:800;font-size:1.1rem;">✗ Respuesta incorrecta</span>';
                }
                fbBox.classList.remove('hidden');
                fbBox.style.display = 'block';
            });
        });
    }

    // 3. ASISTENTE INTERACTIVO DE PROCEDIMIENTOS
    const assCard = document.getElementById('assistant-card');
    
    const states = {
        start: {
            q: "¿Qué tema estás resolviendo?",
            opts: [{t: "Tengo un ejercicio de límites", next: "lim1"}, {t: "Tengo un ejercicio de derivadas", next: "der1"}]
        },
        lim1: {
            q: "¿Tu expresión es una fracción de polinomios?",
            opts: [{t: "Sí", next: "lim_frac"}, {t: "No", next: "lim_nofrac"}]
        },
        lim_frac: {
            q: "¿Qué ocurre con los grados?",
            opts: [{t: "El numerador tiene menor grado.", next: "res_lim1"}, {t: "Ambos tienen el mismo grado.", next: "res_lim2"}, {t: "El numerador tiene mayor grado.", next: "res_lim3"}]
        },
        lim_nofrac: {
            q: "¿La expresión contiene raíces?",
            opts: [{t: "Sí", next: "res_lim4"}, {t: "No", next: "res_lim5"}]
        },
        der1: {
            q: "¿Qué tipo de expresión observas?",
            opts: [{t: "Polinomio", next: "res_der1"}, {t: "Raíz", next: "res_der2"}, {t: "Función dentro de otra función", next: "res_der3"}, {t: "No estoy seguro", next: "res_der4"}]
        }
    };

    const results = {
        res_lim1: { t: "denominador dominante", txt: "El denominador crece más rápido, por lo que el límite generalmente es cero.", ej: "lim(x → ∞) (3x + 1)/(x² + 2) = 0" },
        res_lim2: { t: "dividir coeficientes principales", txt: "Cuando los grados son iguales, divide los coeficientes de los términos de mayor grado.", ej: "lim(x → ∞) (4x² + 1)/(2x² - 3) = 2" },
        res_lim3: { t: "analizar crecimiento y signo", txt: "La función puede crecer hacia +∞ o −∞. Examina el término dominante y la dirección hacia la que tiende x.", ej: "lim(x → −∞) (5x³)/(x² + 1) = −∞" },
        res_lim4: { t: "racionalización", txt: "Cuando aparece una forma como ∞ - ∞, multiplica y divide por el conjugado.", ej: "lim(x → ∞) (√(x² + 5x) - x) = 5/2" },
        res_lim5: { t: "identificar el término dominante", txt: "Analiza qué término crece más rápido y observa su signo.", ej: "N/A" },
        res_der1: { t: "regla de la potencia", txt: "Deriva término por término multiplicando por el exponente y reduciendo el exponente en uno.", ej: "d/dx (3x³ - 2x) = 9x² - 2" },
        res_der2: { t: "convertir a exponente fraccionario", txt: "Reescribe la raíz como potencia y aplica la regla de potencia.", ej: "√x = x^(1/2)  ⇒  f'(x) = 1/(2√x)" },
        res_der3: { t: "regla de la cadena", txt: "Deriva la función externa y multiplícala por la derivada de la función interna.", ej: "d/dx (3x² + 1)⁴ = 24x(3x² + 1)³" },
        res_der4: { t: "Observa la estructura antes de derivar", txt: "Busca exponentes, raíces o expresiones dentro de paréntesis elevadas a una potencia. Eso te ayudará a seleccionar la regla correcta.", ej: "N/A" }
    };

    function renderAssistant(stateKey) {
        if(!assCard) return;
        assCard.innerHTML = '';
        
        if(results[stateKey]) {
            const r = results[stateKey];
            assCard.innerHTML = `
                <div class="feature-icon" style="margin: 0 auto 20px;">💡</div>
                <h3 class="text-purple">Método recomendado: <br> ${r.t.charAt(0).toUpperCase() + r.t.slice(1)}</h3>
                <p class="mt-1" style="font-size:1.1rem;">${r.txt}</p>
                ${r.ej !== "N/A" ? `<div class="formula-box mt-2" style="max-width:500px;margin:20px auto;">${r.ej}</div>` : ''}
                <button class="btn btn-outline mt-2" id="restart-ass">Reiniciar asistente</button>
            `;
            document.getElementById('restart-ass').addEventListener('click', () => renderAssistant('start'));
        } else {
            const s = states[stateKey];
            let html = `<h3 style="margin-bottom:25px;">${s.q}</h3><div style="max-width:500px; margin:0 auto;">`;
            s.opts.forEach(opt => {
                html += `<button class="opt-btn ass-btn" data-next="${opt.next}">${opt.t}</button>`;
            });
            html += `</div>`;
            assCard.innerHTML = html;
            
            document.querySelectorAll('.ass-btn').forEach(btn => {
                btn.addEventListener('click', (e) => renderAssistant(e.target.getAttribute('data-next')));
            });
        }
    }

    if(assCard) renderAssistant('start');

});