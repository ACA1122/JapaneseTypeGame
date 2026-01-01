const inputbox = document.getElementById('inputBox');
const lifeLabel = document.getElementById('life'); 

const resultModal = document.getElementById('result-modal');
const wrongList = document.getElementById('wrong-list');

let life = 3;
let combo = 0;
let isPlaying = false;
let spawnInterval; 
let fallInterval; 

const activeWords = [];
let wrongWords = [];

function GameStart() {
    alert("ゲームスタート！\n「ENTER」を押してプレイしてください");
    isPlaying = true;
    life = 3;
    combo = 0;

    updateUI(); 
    spawnInterval = setInterval(SpawnWord, 4000);
    fallInterval = setInterval(moveWords, 100);
    
    SpawnWord(); 
}

function GameOver() {
    isPlaying = false;
    clearInterval(spawnInterval);
    clearInterval(fallInterval);
    
    activeWords.forEach(word => word.remove());
    activeWords.length = 0; 

    showResult();
    // alert("ゲームオーバー！\nもう一度「시작」と入力してプレイしてください");
}

function RetryGame() {
    resultModal.classList.add('hidden'); 
    inputbox.value = "";
    inputbox.focus();
    alert("「시작」 入力してからエンターキーを押してください.");
}

function showResult() {
    wrongList.innerHTML = "";

    wrongWords.forEach(item => {
        const li = document.createElement('li');
        const meaning = Array.isArray(item.kr) ? item.kr.join(", ") : item.kr;
        
        li.innerHTML = `<strong>${item.jp}</strong> : ${meaning}`;
        wrongList.appendChild(li);
    });
    resultModal.classList.remove('hidden');
}

function SpawnWord() {
    if (typeof keys === 'undefined' || keys.length === 0) return;

    const randomIdx = Math.floor(Math.random() * keys.length);
    const wordText = keys[randomIdx];

    const wordDiv = document.createElement('div');
    wordDiv.classList.add('word');
    wordDiv.innerText = wordText;

    const randomX = Math.floor(Math.random() * (window.innerWidth - 150));
    wordDiv.style.left = `${randomX}px`;
    wordDiv.style.top = '0px';

    document.body.appendChild(wordDiv);
    activeWords.push(wordDiv);
}

function moveWords() {
    for (let i = activeWords.length - 1; i >= 0; i--) {
        const wordDiv = activeWords[i];
        let currentTop = parseInt(wordDiv.style.top);
        
        currentTop += 3;
        wordDiv.style.top = `${currentTop}px`;

        if (currentTop > window.innerHeight - 50) {
            life--;
            
            const jpWord = wordDiv.innerText;
            const krMeaning = dictionary.get(jpWord);
            wrongWords.push({ jp: jpWord, kr: krMeaning });

            updateUI(); 
            
            wordDiv.remove();
            activeWords.splice(i, 1);

            if (life <= 0) GameOver();
        }
    }
}

function updateUI() {
    lifeLabel.innerText = life;
}

inputbox.addEventListener("keydown", function(e) {
    if (e.key !== "Enter") return;

    const inputValue = inputbox.value.trim();
    
    if (!resultModal.classList.contains('hidden')) return;

    if (inputValue === "시작" && !isPlaying) {
        inputbox.value = "";
        GameStart();
        return;
    }

    if (!isPlaying) return;

    for (let i = 0; i < activeWords.length; i++) {
        const wordDiv = activeWords[i];
        const japaneseWord = wordDiv.innerText;
        const correctMeaning = dictionary.get(japaneseWord);

        let isCorrect = false;
        if (Array.isArray(correctMeaning)) {
            isCorrect = correctMeaning.includes(inputValue);
        } else {
            isCorrect = (correctMeaning === inputValue);
        }

        if (isCorrect) {
            combo++;

            if (combo >= 5) {
                life = Math.min(life + 1, 3);
                combo = 0;
                updateUI();
                console.log("ボーナス·ライフ獲得！");
            }

            wordDiv.remove();
            activeWords.splice(i, 1);
            break;
        }
    }

    inputbox.value = "";
});
