// 1. คลังสัตว์ (เพิ่มข้อมูลคำศัพท์ภาษาอังกฤษ en)
const animalDB = [
    { emoji: "🐶", name: "หมา", en: "Dog", file: "dog.mp3" },
    { emoji: "🐱", name: "แมว", en: "Cat", file: "cat.mp3" },
    { emoji: "🐷", name: "หมู", en: "Pig", file: "pig.mp3" },
    { emoji: "🐮", name: "วัว", en: "Cow", file: "cow.mp3" },
    { emoji: "🐴", name: "ม้า", en: "Horse", file: "horse.mp3" },
    { emoji: "🐑", name: "แกะ", en: "Sheep", file: "sheep.mp3" },
    { emoji: "🐐", name: "แพะ", en: "Goat", file: "goat.mp3" },
    { emoji: "🐔", name: "ไก่", en: "Chicken", file: "chicken.mp3" },
    { emoji: "🦆", name: "เป็ด", en: "Duck", file: "duck.mp3" },
    { emoji: "🐭", name: "หนู", en: "Mouse", file: "mouse.mp3" },
    { emoji: "🐰", name: "กระต่าย", en: "Rabbit", file: "rabbit.mp3" },
    { emoji: "🐓", name: "ไก่โต้ง", en: "Rooster", file: "rooster.mp3" },
    { emoji: "🦁", name: "สิงโต", en: "Lion", file: "lion.mp3" },
    { emoji: "🐯", name: "เสือ", en: "Tiger", file: "tiger.mp3" },
    { emoji: "🐘", name: "ช้าง", en: "Elephant", file: "elephant.mp3" },
    { emoji: "🐵", name: "ลิง", en: "Monkey", file: "monkey.mp3" },
    { emoji: "🦍", name: "กอริลลา", en: "Gorilla", file: "gorilla.mp3" },
    { emoji: "🐻", name: "หมี", en: "Bear", file: "bear.mp3" },
    { emoji: "🐍", name: "งู", en: "Snake", file: "snake.mp3" },
    { emoji: "🐸", name: "กบ", en: "Frog", file: "frog.mp3" },
    { emoji: "🐺", name: "หมาป่า", en: "Wolf", file: "wolf.mp3" },
    { emoji: "🦊", name: "หมาจิ้งจอก", en: "Fox", file: "fox.mp3" },
    { emoji: "🦌", name: "กวาง", en: "Deer", file: "deer.mp3" },
    { emoji: "🦓", name: "ม้าลาย", en: "Zebra", file: "zebra.mp3" },
    { emoji: "🦒", name: "ยีราฟ", en: "Giraffe", file: "giraffe.mp3" },
    { emoji: "🦛", name: "ฮิปโป", en: "Hippo", file: "hippo.mp3" },
    { emoji: "🦏", name: "แรด", en: "Rhino", file: "rhino.mp3" },
    { emoji: "🐪", name: "อูฐ", en: "Camel", file: "camel.mp3" },
    { emoji: "🦘", name: "จิงโจ้", en: "Kangaroo", file: "kangaroo.mp3" }
];

let currentCorrectAnimal = null;
let stars = 0;
let timeLeft = 5;
let timerInterval;
let gameActive = false;
let currentAudioPlayer = null; 

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
const resultEnWord = document.getElementById('resultEnWord'); // ตัวแปรใหม่
const resultSpellWord = document.getElementById('resultSpellWord'); // ตัวแปรใหม่

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
    if(currentAudioPlayer) currentAudioPlayer.pause(); 
    gameActive = false;
    currentAudioPlayer = null;
    
    timeLeft = 5;
    timeDisplay.innerText = timeLeft;
    timerBoard.classList.remove('timer-warning');
    
    btnSpeaker.classList.remove('playing-sound');
    speakerText.innerText = "จิ้มฟังเสียงเลย!";
    instructionText.innerText = "จิ้มลำโพง เพื่อฟังคำถาม 🤫";
    
    // รีเซ็ตหน้าต่างเฉลย
    resultEnWord.innerText = "";
    resultSpellWord.innerText = "";
    
    choicesContainer.classList.remove('active');
    choicesZone.innerHTML = ''; 

    // สุ่มสัตว์
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

// 3. ระบบดำเนินรายการ (จับเวลา)
function playSoundAndStartTimer() {
    if(gameActive || btnSpeaker.classList.contains('playing-sound')) return; 

    btnSpeaker.classList.add('playing-sound');
    speakerText.innerText = "ตั้งใจฟังนะ...";
    instructionText.innerText = "คุณครูกำลังถาม... 🤫";

    const thVoice = getBestFemaleVoice('th');
    
    const step1 = new SpeechSynthesisUtterance("ทายสิ เสียงของอะไร");
    step1.lang = 'th-TH'; step1.rate = 0.9;
    if(thVoice) step1.voice = thVoice;

    const step3 = new SpeechSynthesisUtterance("จับเวลา 5 วิ เริ่ม!");
    step3.lang = 'th-TH'; step3.rate = 1.0;
    if(thVoice) step3.voice = thVoice;

    let fallback1 = setTimeout(() => { if(!currentAudioPlayer) step1.onend(); }, 3000);
    let fallback2;

    step1.onend = () => {
        clearTimeout(fallback1);
        currentAudioPlayer = new Audio(`sounds/${currentCorrectAnimal.file}`);
        currentAudioPlayer.play().catch(e => console.log("รอไฟล์ MP3"));

        setTimeout(() => {
            window.speechSynthesis.speak(step3);
            fallback2 = setTimeout(() => { if(!gameActive) step3.onend(); }, 3000);
        }, 1500);
    };

    step3.onend = () => {
        clearTimeout(fallback2);
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

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(step1);
}

// --- 🌟 4. ระบบคุณครูสอนสะกดภาษาอังกฤษ (ที่คุณขอมา!) ---
function speakSpellingLesson(animal) {
    window.speechSynthesis.cancel();
    
    const thVoice = getBestFemaleVoice('th');
    const enVoice = getBestFemaleVoice('en'); // หาเสียงสำเนียงฝรั่ง

    // 1. "หนูทายถูกใช่จ้า นี่คือ วัว ภาษาอังกฤษอ่านว่า..."
    const th1 = new SpeechSynthesisUtterance(`หนูทายถูกใช่จ้า นี่คือ ${animal.name} ภาษาอังกฤษอ่านว่า`);
    th1.lang = 'th-TH'; th1.rate = 0.9;
    if(thVoice) th1.voice = thVoice;

    // 2. "Cow" (สำเนียงอังกฤษ)
    const en1 = new SpeechSynthesisUtterance(animal.en);
    en1.lang = 'en-US'; en1.rate = 0.9;
    if(enVoice) en1.voice = enVoice;

    // 3. "สะกด"
    const th2 = new SpeechSynthesisUtterance("สะกด");
    th2.lang = 'th-TH'; th2.rate = 0.9;
    if(thVoice) th2.voice = thVoice;

    // 4. "C, O, W" (สะกดช้าๆ ทีละตัว)
    const spellStr = animal.en.split('').join(', ');
    const en2 = new SpeechSynthesisUtterance(spellStr);
    en2.lang = 'en-US'; en2.rate = 0.6; // พูดช้าๆ ให้น้องฟังทัน
    if(enVoice) en2.voice = enVoice;

    // 5. "แปลว่า วัว"
    const th3 = new SpeechSynthesisUtterance(`แปลว่า ${animal.name}`);
    th3.lang = 'th-TH'; th3.rate = 0.9;
    if(thVoice) th3.voice = thVoice;

    // สั่งให้พูดเรียงคิวกันตามลำดับ
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
        if(currentAudioPlayer) currentAudioPlayer.pause(); 

        stars++;
        starCountDisplay.innerText = stars;
        
        // --- อัปเดตหน้าต่างเฉลยให้แสดงการสะกดคำ ---
        resultEmoji.innerText = currentCorrectAnimal.emoji;
        resultTitle.innerText = "เก่งมาก ทันเวลา!";
        resultTitle.style.color = "#10b981";
        
        // โชว์คำว่า "COW"
        resultEnWord.innerText = currentCorrectAnimal.en;
        // โชว์คำว่า "C - O - W"
        resultSpellWord.innerText = currentCorrectAnimal.en.toUpperCase().split('').join(' - ');
        
        resultDesc.innerText = `แปลว่า ${currentCorrectAnimal.name}`;
        nextBtn.innerText = "👉 เล่นข้อต่อไป 👈";

        // เรียกฟังก์ชันสอนสะกดคำ
        speakSpellingLesson(currentCorrectAnimal);

        shootConfetti();
        setTimeout(() => winOverlay.classList.add('show'), 800);

    } else {
        // พูดเตือนสั้นๆ ให้รีบกดใหม่
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
    if(currentAudioPlayer) currentAudioPlayer.pause();
    
    // พูดเฉลยสั้นๆ ตอนแพ้
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