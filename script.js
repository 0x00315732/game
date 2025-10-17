// --- 1. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ ---
const storyTextElement = document.getElementById('story-text');
const optionsElement = document.getElementById('options');
const errorCountElement = document.getElementById('error-count'); 
const bgMusic = document.getElementById('bg-music'); 
const musicToggleButton = document.getElementById('music-toggle-btn');
const sceneImageElement = document.getElementById('scene-image'); // НОВЫЙ ЭЛЕМЕНТ: изображение сцены

let errorCount = 0; 
let isMusicPlaying = false; 

// Функция для обновления отображения счета
function updateScore() {
    errorCountElement.textContent = errorCount;
}

// --- ФУНКЦИЯ: УПРАВЛЕНИЕ МУЗЫКОЙ ---
function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggleButton.textContent = "▶️ Play Music";
        isMusicPlaying = false;
    } else {
        bgMusic.volume = 0.4;
        bgMusic.play().catch(e => {
            console.error("Audio playback failed:", e);
            musicToggleButton.textContent = "🚫 Blocked";
        }); 
        musicToggleButton.textContent = "⏸️ Pause Music";
        isMusicPlaying = true;
    }
}

// --- 2. СТРУКТУРА ДАННЫХ: ВСЕ СЦЕНЫ ИСТОРИИ (ДОБАВЛЕНО СВОЙСТВО 'image') ---
const story = {
    start: {
        text: "Goldilocks entered the Bears' house and saw three bowls of porridge on the table. She was very hungry. Which bowl will she choose first?",
        image: "kitchen.jpg", // Сцена начинается на кухне
        options: [
            { text: "Try the biggest bowl (Papa Bear's)", nextScene: "papaBear", isError: true },
            { text: "Try the medium-sized bowl (Mama Bear's)", nextScene: "mamaBear", isError: true },
            { text: "Try the smallest bowl (Baby Bear's)", nextScene: "babyBear", isError: false }
        ]
    },
    // Сценарии с кашей
    papaBear: {
        text: "Papa Bear's porridge was too hot! Goldilocks burned her tongue. What should she do next?",
        image: "kitchen.jpg",
        options: [
            { text: "Try Mama Bear's porridge", nextScene: "mamaBear", isError: true },
            { text: "Try Baby Bear's porridge", nextScene: "babyBear", isError: false },
        ]
    },
    mamaBear: {
        text: "Mama Bear's porridge was **too cold**. It wasn't what she wanted! What should she do next?",
        image: "kitchen.jpg",
        options: [
            { text: "Try Papa Bear's porridge", nextScene: "papaBear", isError: true },
            { text: "Try Baby Bear's porridge", nextScene: "babyBear", isError: false },
        ]
    },
    babyBear: {
        text: "Baby Bear's porridge was just right! Goldilocks ate it all up. She felt a little guilty, but now she is full. Now she needs to decide what to do next.",
        image: "kitchen.jpg",
        options: [
            { text: "Go into the parlor to sit down", nextScene: "chairs", isError: false },
            { text: "Leave the house immediately", nextScene: "end_exit", isError: false },
        ]
    },
    
    // Сценарии со стульями
    chairs: {
        text: "Goldilocks entered the parlor and saw three chairs. Her legs were tired, and she wanted a rest. Which chair will she choose?",
        image: "parlor.jpg", // Смена сцены на гостиную
        options: [
            { text: "Sit in the biggest chair (Papa Bear's)", nextScene: "papaChair", isError: true },
            { text: "Sit in the medium-sized chair (Mama Bear's)", nextScene: "mamaChair", isError: true },
            { text: "Sit in the smallest chair (Baby Bear's)", nextScene: "babyChair", isError: true },
        ]
    },
    papaChair: {
        text: "Papa Bear's chair was too hard and uncomfortable! Goldilocks quickly stood up. What now?",
        image: "parlor.jpg",
        options: [
            { text: "Try Mama Bear's chair", nextScene: "mamaChair", isError: true },
            { text: "Try Baby Bear's chair", nextScene: "babyChair", isError: true },
        ]
    },
    mamaChair: {
        text: "Mama Bear's chair was too soft and bouncy! Goldilocks nearly fell over. What now?",
        image: "parlor.jpg",
        options: [
            { text: "Try Papa Bear's chair", nextScene: "papaChair", isError: true },
            { text: "Try Baby Bear's chair", nextScene: "babyChair", isError: true },
        ]
    },
    babyChair: {
        text: "Baby Bear's chair was just right! But alas, Goldilocks sat on it so hard that it broke into pieces! She is very upset and tired. What should she do?",
        image: "parlor.jpg",
        options: [
            { text: "Go upstairs to the bedrooms", nextScene: "beds", isError: true },
            { text: "Cry and leave the house", nextScene: "end_broken", isError: false }
        ]
    },
    
    // Сценарии с кроватями
    beds: {
        text: "Goldilocks went upstairs and found three beds in the bedroom. She was so sleepy after her porridge and broken chair adventure. Which bed will she try?",
        image: "bedroom.jpg", // Смена сцены на спальню
        options: [
            { text: "Try the enormous bed (Papa Bear's)", nextScene: "papaBed", isError: true },
            { text: "Try the cozy looking bed (Mama Bear's)", nextScene: "mamaBed", isError: true },
            { text: "Try the tiny bed (Baby Bear's)", nextScene: "babyBed", isError: false },
        ]
    },
    papaBed: {
        text: "Papa Bear's bed was too hard! It felt like sleeping on a log. Goldilocks can't sleep here. What's next?",
        image: "bedroom.jpg",
        options: [
            { text: "Try Mama Bear's bed", nextScene: "mamaBed", isError: true },
            { text: "Try Baby Bear's bed", nextScene: "babyBed", isError: false },
        ]
    },
    mamaBed: {
        text: "Mama Bear's bed was too soft and sinking! Goldilocks felt like she was drowning in feathers. What's next?",
        image: "bedroom.jpg",
        options: [
            { text: "Try Papa Bear's bed", nextScene: "papaBed", isError: true },
            { text: "Try Baby Bear's bed", nextScene: "babyBed", isError: false },
        ]
    },
    babyBed: {
        text: "Baby Bear's bed was just right! Goldilocks immediately fell fast asleep... Suddenly, she hears a noise! The Bears are home!",
        image: "bedroom.jpg",
        options: [
            { text: "Wake up and run away!", nextScene: "end_run", isError: false }, 
            { text: "Pretend to be asleep", nextScene: "end_caught", isError: false }, 
        ]
    },
    
    // КОНЕЧНЫЕ СЦЕНЫ (Снаружи или в пути)
    end_run: {
        text: "Goldilocks jumps out of bed and runs down the stairs, straight out the door, never to return. She learned her lesson: curiosity should respect boundaries!",
        image: "forest.jpg", // Возвращаемся в лес
        options: []
    },
    end_caught: {
        text: "Goldilocks tries to pretend to sleep, but Papa Bear's gruff voice scares her! She jumps up, runs out the door, and never looks back. She's sorry for using the Bears' things without asking.",
        image: "forest.jpg",
        options: []
    },
    end_broken: {
        text: "Goldilocks ran out of the house, feeling terrible for breaking the chair. She learned a hard lesson about respecting other people's property.",
        image: "forest.jpg",
        options: []
    },
    end_exit: {
        text: "Goldilocks realized her mistake and hurried away. Moral learned.",
        image: "forest.jpg",
        options: [] 
    }
};

// --- 3. ФУНКЦИЯ ЗАГРУЗКИ СЦЕНЫ (С ИЗМЕНЕНИЯМИ ДЛЯ ИЗОБРАЖЕНИЯ) ---
function loadScene(sceneKey) {
    const currentScene = story[sceneKey];
    let sceneText = currentScene.text; 
    
    // НОВОЕ: Обновляем фоновое изображение сцены
    if (currentScene.image) {
        sceneImageElement.style.backgroundImage = `url('${currentScene.image}')`;
    }

    // Добавляем финальный счет ошибок
    if (sceneKey.startsWith('end') || sceneKey === 'babyBed') {
        sceneText += ` (Total Errors: ${errorCount}). (The End.)`;
    }

    storyTextElement.innerHTML = sceneText; 
    optionsElement.innerHTML = ''; 

    currentScene.options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.textContent = option.text;
        
        button.onclick = () => {
            if (option.isError) {
                errorCount++;
                updateScore();
            }
            loadScene(option.nextScene); 
        };
        
        optionsElement.appendChild(button);
    });
}

// --- 4. ЗАПУСК ИГРЫ И ОБРАБОТЧИК ЗВУКА ---
updateScore(); 
loadScene('start');

musicToggleButton.addEventListener('click', toggleMusic);

// Инициализация кнопки звука
if (bgMusic.paused) {
    musicToggleButton.textContent = "▶️ Play Music";
    isMusicPlaying = false;
} else {
    musicToggleButton.textContent = "⏸️ Pause Music";
    isMusicPlaying = true;
}
