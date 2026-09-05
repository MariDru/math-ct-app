const theoryDatabase = {
    trig: `
        <h1 class="article-title">Тригонометрические формулы</h1>
        <p class="article-text">Тригонометрия в ЦТ встречается в каждом третьем тесте. Основное, что нужно железно знать — это <b>Основное тригонометрическое тождество:</b></p>
        <div class="math-block">sin²(x) + cos²(x) = 1</div>
        <p class="article-text"><b>Формулы двойного угла:</b></p>
        <div class="math-block">sin(2x) = 2 · sin(x) · cos(x)<br>cos(2x) = cos²(x) - sin²(x)</div>
    `,
    eq: `
        <h1 class="article-title">Квадратные уравнения</h1>
        <p class="article-text">Для стандартного уравнения вида <b>ax² + bx + c = 0</b> корни ищутся через дискриминант:</p>
        <div class="math-block">D = b² - 4ac</div>
        <p class="article-text">Сумма корней приведённого уравнения равна второму коэффициенту с противоположным знаком, а произведение — свободному члену.</p>
    `
};

// База данных тестовых задач во вкладке "Практика"
const practiceDatabase = {
    nok: {
        topicTitle: "Задание 1. Числа и вычисления",
        question: "1. Найдите наименьшее общее кратное (НОК) чисел 18 и 24.",
        options: ["A. 36", "B. 48", "C. 72", "D. 144"],
        correctIndex: 2, // C. 72
        hint: "Разложи числа на простые множители: 18 = 2 · 3², 24 = 2³ · 3. Возьми максимальные степени каждого множителя: 2³ · 3² = 8 · 9 = 72.",
        imageUrl: "" // Без картинки
    },
    geom_square: {
        topicTitle: "Задание 4. Геометрия на клетке",
        question: "Найдите площадь заштрихованной фигуры, изображенной на клетчатой бумаге с размером клетки 1х1 см.",
        options: ["A. 12 см²", "B. 14 см²", "C. 16 см²", "D. 18 см²"],
        correctIndex: 1, // B. 14 см²
        hint: "Используй формулу Пика (В + Г/2 - 1) или дострой фигуру до полного прямоугольника и вычти площади лишних прямоугольных треугольников.",
        imageUrl: "https://unsplash.com" // Пример тестовой картинки
    }
};

let selectedOptionElement = null;
let selectedOptionIndex = null;
let currentActiveTopic = null;

// Переключение между вкладками главного меню
function switchTab(screenName, element) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    document.getElementById('screen-' + screenName).classList.add('active');
    element.classList.add('active');
    
    if(screenName !== 'theory') closeTheoryText();
    if(screenName !== 'practice') closePractice();
}

// Управление под-экранами вкладки "Теория"
function openTheoryText(key) {
    document.getElementById('theory-topics-list').style.display = 'none';
    document.getElementById('article-content').innerHTML = theoryDatabase[key] || 'Конспект подготавливается...';
    document.getElementById('theory-article-view').style.display = 'block';
}

function closeTheoryText() {
    document.getElementById('theory-article-view').style.display = 'none';
    document.getElementById('theory-topics-list').style.display = 'block';
}

// Запуск тестирования во вкладке "Практика"
function startPractice(topicKey) {
    currentActiveTopic = topicKey;
    const taskData = practiceDatabase[topicKey];
    
    document.getElementById('practice-topics-list').style.display = 'none';
    document.getElementById('practice-test-view').style.display = 'block';
    
    document.getElementById('test-topic-name').innerText = taskData.topicTitle;
    document.getElementById('test-question-text').innerText = taskData.question;
    document.getElementById('test-hint-text').innerText = taskData.hint;
    document.getElementById('test-counter').innerText = "1 / 1";
    
    // Проверка и вывод изображения
    const imgContainer = document.getElementById('test-image-container');
    const imgElement = document.getElementById('test-question-image');
    if (taskData.imageUrl && taskData.imageUrl !== "") {
        imgElement.src = taskData.imageUrl;
        imgContainer.style.display = "flex";
    } else {
        imgContainer.style.display = "none";
        imgElement.src = "";
    }

    // Закрываем и сбрасываем подсказку
    document.querySelector('.hint-container').classList.remove('open');
    document.getElementById('hint-arrow').innerText = "⬠";

    // Настройка кнопки "Ответить"
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = "Ответить";
    submitBtn.setAttribute('disabled', 'true');
    submitBtn.classList.remove('active', 'correct-btn', 'wrong-btn');
    submitBtn.onclick = submitAnswer;

    // Очистка и создание вариантов ответов
    const optionsContainer = document.getElementById('test-options-container');
    optionsContainer.innerHTML = "";
    selectedOptionElement = null;
    selectedOptionIndex = null;

    taskData.options.forEach((optionText, index) => {
        const item = document.createElement('div');
        item.className = 'option-item';
        item.onclick = function() { selectOption(item, index); };
        item.innerHTML = `<div class="radio-circle"></div><div class="option-text">${optionText}</div>`;
        optionsContainer.appendChild(item);
    });
}

// Выбор одного из вариантов ответа
function selectOption(element, index) {
    if (document.getElementById('submit-btn').innerText === "Дальше") return;
    
    document.querySelectorAll('.option-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
    
    selectedOptionElement = element;
    selectedOptionIndex = index;
    
    const btn = document.getElementById('submit-btn');
    btn.removeAttribute('disabled');
    btn.classList.add('active');
}

// Клик по кнопке "Ответить"
function submitAnswer() {
    const taskData = practiceDatabase[currentActiveTopic];
    const submitBtn = document.getElementById('submit-btn');
    const allOptions = document.querySelectorAll('.option-item');

    if (selectedOptionIndex === taskData.correctIndex) {
        selectedOptionElement.classList.add('correct-answer');
        submitBtn.classList.add('correct-btn');
        submitBtn.innerText = "Правильно! 🎉";
    } else {
        selectedOptionElement.classList.add('wrong-answer');
        allOptions[taskData.correctIndex].classList.add('correct-answer');
        submitBtn.classList.add('wrong-btn');
        submitBtn.innerText = "Ошибка ❌";
    }

    // Перевод кнопки в режим завершения теста
    setTimeout(() => {
        submitBtn.innerText = "Дальше";
        submitBtn.className = "btn-submit active";
        submitBtn.onclick = closePractice;
    }, 1250);
}

// Раскрытие/закрытие подсказки
function toggleHint() {
    const container = document.querySelector('.hint-container');
    const arrow = document.getElementById('hint-arrow');
    container.classList.toggle('open');
    arrow.innerText = container.classList.contains('open') ? "⬩" : "⬠";
}

function closePractice() {
    document.getElementById('practice-test-view').style.display = 'none';
    document.getElementById('practice-topics-list').style.display = 'block';
}
