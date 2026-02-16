// 1. คลังสัตว์ พร้อม "เสียงร้องจำลอง" (Text-to-Speech)
const animalDB = [
    { emoji: "🐶", name: "หมา", en: "Dog", sound: "โฮ่ง โฮ่ง โฮ่ง" },
    { emoji: "🐱", name: "แมว", en: "Cat", sound: "เมี้ยววว เมี้ยววว" },
    { emoji: "🐷", name: "หมู", en: "Pig", sound: "อู๊ด อู๊ด อู๊ด" },
    { emoji: "🐮", name: "วัว", en: "Cow", sound: "มอออ มอออ" },
    { emoji: "🐴", name: "ม้า", en: "Horse", sound: "ฮี้ ฮี้ ฮี้" },
    { emoji: "🐑", name: "แกะ", en: "Sheep", sound: "แบ้ แบ้" },
    { emoji: "🐐", name: "แพะ", en: "Goat", sound: "แบะ แบะ" },
    { emoji: "🐔", name: "ไก่", en: "Chicken", sound: "กะต๊าก กะต๊าก" },
    { emoji: "🦆", name: "เป็ด", en: "Duck", sound: "ก้าบ ก้าบ ก้าบ" },
    { emoji: "🐭", name: "หนู", en: "Mouse", sound: "จี๊ด จี๊ด จี๊ด" },
    { emoji: "🐰", name: "กระต่าย", en: "Rabbit", sound: "หงุบ หงับ หงุบ หงับ" },
    { emoji: "🐓", name: "ไก่โต้ง", en: "Rooster", sound: "เอก อี เอ้ก เอ้ก" },
    { emoji: "🦁", name: "สิงโต", en: "Lion", sound: "โฮกกกกก โฮกกกกก" },
    { emoji: "🐯", name: "เสือ", en: "Tiger", sound: "แฮ่ แฮ่" },
    { emoji: "🐘", name: "ช้าง", en: "Elephant", sound: "แปล๊น แปล๊น" },
    { emoji: "🐵", name: "ลิง", en: "Monkey", sound: "เจี๊ยก เจี๊ยก เจี๊ยก" },
    { emoji: "🦍", name: "กอริลลา", en: "Gorilla", sound: "ฮูฮู ฮ่าฮ่า" },
    { emoji: "🐻", name: "หมี", en: "Bear", sound: "แฮ่ก แฮ่ก" },
    { emoji: "🐍", name: "งู", en: "Snake", sound: "ฟ่อออ ฟ่อออ" },
    { emoji: "🐸", name: "กบ", en: "Frog", sound: "อ๊บ อ๊บ อ๊บ" },
    { emoji: "🐺", name: "หมาป่า", en: "Wolf", sound: "บรู๊วววววว" },
    { emoji: "🦊", name: "หมาจิ้งจอก", en: "Fox", sound: "อิ๊ อิ๊ อิ๊" },
    { emoji: "🦌", name: "กวาง", en: "Deer", sound: "แอะ แอะ" },
    { emoji: "🦓", name: "ม้าลาย", en: "Zebra", sound: "อี๊ฮ่า อี๊ฮ่า" },
    { emoji: "🦒", name: "ยีราฟ", en: "Giraffe", sound: "หง่ำ หง่ำ" },
    { emoji: "🦛", name: "ฮิปโป", en: "Hippo", sound: "ฮึ่ม ฮึ่ม" },
    { emoji: "🦏", name: "แรด", en: "Rhino", sound: "ฟืด ฟาด ฟืด ฟาด" },
    { emoji: "🐪", name: "อูฐ", en: "Camel", sound: "ฮื้ม ฮื้ม" },
    { emoji: "🦘", name: "จิงโจ้", en: "Kangaroo", sound: "ดึ๋ง ดึ๋ง ดึ๋ง" }
];

let currentCorrectAnimal = null;
let stars = 0;
let timeLeft = 5;
let timerInterval;
let gameActive = false;

// ดึง Elements
const btnSpeaker = document.getElementById('btnSpeaker');
const speakerText = document.getElementById('speakerText');
const choicesZone = document.getElementById('choicesZone');
const winOverlay = document.getElementById('winOverlay');
const starCountDisplay = document.getElementById('starCount');
const instructionText = document.getElementById('instructionText');
const timeDisplay = document.getElementById('timeDisplay');
const timerBoard = document.getElementById('timerBoard');
const choicesContainer = document.querySelector('.choices-container');

// Elements หน้าต่างผลลัพธ์
const resultEmoji = document.getElementById('resultEmoji');
const resultTitle = document.getElementById('resultTitle');
const resultDesc = document.getElementById('resultDesc');
const nextBtn = document.getElementById('nextBtn');
const resultEnWord = document.getElementById('resultEnWord'); 
const resultSpellWord = document.getElementById('resultSpellWord'); 

// ระบบหาเสียงผู้หญิง
let availableVoices = [];
window.speechSynthesis.onvoiceschanged = () => availableVoices = window.speechSynthesis.getVoices();

function getBestFemaleVoice(langCode) {
    let langVoices = availableVoices.filter(v => v.lang.includes(langCode));
    if (langVoices.length === 0) return null;
    let preferredNames = ['Premwadee', 'Google ภาษาไทย', 'Pattara', 'Samantha', 'Google UK English Female'];
    for (let name of preferredNames) {
        let found = langVoices.find(v => v.name.includes(name));
        if (found) return found;
    }
    return langVoices.find(v => v.name.includes('Female') || v.name.includes('female')) || langVoices[0];
}

function shootConfetti() {
    const colors = ['#ea580c', '#3b82f6', '#10b981', '#fbbf24'];
    for (let i = 0; i < 40; i++) {
        const conf = document.createElement('div');
        conf.style.position = 'absolute'; conf.style.width = '12px'; conf.style.height = '12px'; conf.style.zIndex = '90';
        conf.style.left = Math.random() * 100 + 'vw'; conf.style.top = '-10px';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.animation = `fall ${Math.random() * 2 + 2}s linear forwards`;
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 4000);
    }
}

// 2. เริ่มเตรียมด่าน
function startNewRound() {
    winOverlay.classList.remove('show');
    clearInterval(timerInterval);
    gameActive = false;
    
    timeLeft = 5;
    timeDisplay.innerText = timeLeft;
    timerBoard.classList.remove('timer-warning');
    
    btnSpeaker.classList.remove('playing-sound');
    speakerText.innerText = "จิ้มฟังเสียงเลย!";
    instructionText.innerText = "จิ้มลำโพง เพื่อฟังคำถาม 🤫";
    
    resultEnWord.innerText = "";
    resultSpellWord.innerText = "";
    
    choicesContainer.classList.remove('active');
    choicesZone.innerHTML = ''; 

    const shuffledDB = [...animalDB].sort(() => 0.5 - Math.random());
    currentCorrectAnimal = shuffledDB[0];

    let choices = [currentCorrectAnimal, shuffledDB[1], shuffledDB[2]];
    choices = choices.sort(() => 0.5 - Math.random());

    choices.forEach(animal => {
        const btn = document.createElement('div');
        btn.classList.add('choice-btn');
        btn.innerText = animal.emoji;
        btn.addEventListener('click', () => { if(gameActive) handleChoiceClick(btn, animal); });
        choicesZone.appendChild(btn);
    });
}

// 3. ระบบดำเนินรายการ (จับเวลา + ให้คอมพิวเตอร์พูดเสียงร้อง)
function playSoundAndStartTimer() {
    if(gameActive || btnSpeaker.classList.contains('playing-sound')) return; 

    btnSpeaker.classList.add('playing-sound');
    speakerText.innerText = "ตั้งใจฟังนะ...";
    instructionText.innerText = "คุณครูกำลังถาม... 🤫";

    const thVoice = getBestFemaleVoice('th');
    
    // สเต็ป 1
    const step1 = new SpeechSynthesisUtterance("ทายสิ เสียงของอะไร");
    step1.lang = 'th-TH'; step1.rate = 0.9;
    if(thVoice) step1.voice = thVoice;

    // สเต็ป 2: ทำเสียงสัตว์ (ปรับ pitch ให้แหลมขึ้นนิดนึงจะได้ฟังดูเป็นการจำลองเสียง)
    const step2 = new SpeechSynthesisUtterance(currentCorrectAnimal.sound);
    step2.lang = 'th-TH'; step2.rate = 0.8; step2.pitch = 1.3;
    if(thVoice) step2.voice = thVoice;

    // สเต็ป 3
    const step3 = new SpeechSynthesisUtterance("จับเวลา 5 วิ เริ่ม!");
    step3.lang = 'th-TH'; step3.rate = 1.0;
    if(thVoice) step3.voice = thVoice;

    // สั่งพูดต่อคิวกัน
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(step1);
    window.speechSynthesis.speak(step2);
    window.speechSynthesis.speak(step3);

    // เมื่อพูดสเต็ป 3 จบ
    step3.onend = () => {
        speakerText.innerText = "รีบตอบเลย!!";
        instructionText.innerText = "จับเวลา! ⏱️";
        choicesContainer.classList.add('active'); 
        gameActive = true;

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timeDisplay.innerText = timeLeft;
            if (timeLeft <= 2 && timeLeft > 0) timerBoard.classList.add('timer-warning');
            if (timeLeft <= 0) { clearInterval(timerInterval); loseGame(); }
        }, 1000);
    };
    
    // กันบั๊ก ถ้าระบบเสียงค้าง ให้บังคับเริ่มเวลา
    setTimeout(() => {
        if(!gameActive) step3.onend();
    }, 6000);
}

// 4. ระบบคุณครูสอนสะกดภาษาอังกฤษ
function speakSpellingLesson(animal) {
    window.speechSynthesis.cancel();
    
    const thVoice = getBestFemaleVoice('th');
    const enVoice = getBestFemaleVoice('en'); 

    const th1 = new SpeechSynthesisUtterance(`หนูทายถูกใช่จ้า นี่คือ ${animal.name} ภาษาอังกฤษอ่านว่า`);
    th1.lang = 'th-TH'; th1.rate = 0.9;
    if(thVoice) th1.voice = thVoice;

    const en1 = new SpeechSynthesisUtterance(animal.en);
    en1.lang = 'en-US'; en1.rate = 0.9;
    if(enVoice) en1.voice = enVoice;

    const th2 = new SpeechSynthesisUtterance("สะกด");
    th2.lang = 'th-TH'; th2.rate = 0.9;
    if(thVoice) th2.voice = thVoice;

    const spellStr = animal.en.split('').join(', ');
    const en2 = new SpeechSynthesisUtterance(spellStr);
    en2.lang = 'en-US'; en2.rate = 0.6; 
    if(enVoice) en2.voice = enVoice;

    const th3 = new SpeechSynthesisUtterance(`แปลว่า ${animal.name}`);
    th3.lang = 'th-TH'; th3.rate = 0.9;
    if(thVoice) th3.voice = thVoice;

    window.speechSynthesis.speak(th1);
    window.speechSynthesis.speak(en1);
    window.speechSynthesis.speak(th2);
    window.speechSynthesis.speak(en2);
    window.speechSynthesis.speak(th3);
}

// 5. ตรวจคำตอบตอนจิ้ม
function handleChoiceClick(btn, selectedAnimal) {
    if (selectedAnimal.name === currentCorrectAnimal.name) {
        clearInterval(timerInterval); 
        gameActive = false; 
        btnSpeaker.classList.remove('playing-sound');

        stars++;
        starCountDisplay.innerText = stars;
        
        resultEmoji.innerText = currentCorrectAnimal.emoji;
        resultTitle.innerText = "เก่งมาก ทันเวลา!";
        resultTitle.style.color = "#10b981";
        
        resultEnWord.innerText = currentCorrectAnimal.en;
        resultSpellWord.innerText = currentCorrectAnimal.en.toUpperCase().split('').join(' - ');
        
        resultDesc.innerText = `แปลว่า ${currentCorrectAnimal.name}`;
        nextBtn.innerText = "👉 เล่นข้อต่อไป 👈";

        speakSpellingLesson(currentCorrectAnimal);

        shootConfetti();
        setTimeout(() => winOverlay.classList.add('show'), 800);

    } else {
        window.speechSynthesis.cancel();
        const wrongVoice = new SpeechSynthesisUtterance("อุ๊ย ยังไม่ใช่จ้า รีบตอบใหม่เร็ว!");
        wrongVoice.lang = 'th-TH'; 
        window.speechSynthesis.speak(wrongVoice);
        
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 400); 
    }
}

// 6. หมดเวลา
function loseGame() {
    gameActive = false; 
    btnSpeaker.classList.remove('playing-sound');
    
    window.speechSynthesis.cancel();
    const loseVoice = new SpeechSynthesisUtterance(`หมดเวลาแล้วจ้า เฉลยคือ ${currentCorrectAnimal.name}`);
    loseVoice.lang = 'th-TH';
    window.speechSynthesis.speak(loseVoice);

    resultEmoji.innerText = "⏰";
    resultTitle.innerText = "หมดเวลา!";
    resultTitle.style.color = "#ef4444";
    resultDesc.innerText = `เฉลยคือ ${currentCorrectAnimal.emoji} ${currentCorrectAnimal.name}`;
    nextBtn.innerText = "🔄 ลองข้อนี้ใหม่อีกครั้ง";

    winOverlay.classList.add('show');
}

window.onload = () => {
    setTimeout(startNewRound, 500);
};
