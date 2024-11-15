let n = 3;
let boxes = "";
let word_number = 1;
let word_array = [];
let game = 0;
let game_box = document.querySelector(`.game-box:nth-child(${word_number})`);
let letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
let green = [];
let yellow = [];
let grey = [];
document.querySelector(`.change-box:nth-child(${1})`).style.backgroundColor = `#888`;
document.querySelector(`.change-box:nth-child(${1})`).style.cursor = `default`;

function getSecretWords() {
    return "let post audio heaven request contrast".split(" ");
}
let secretWords = getSecretWords();

let today = '';
setWord(n);

for (let j = 0; j < n; j++) {
    boxes += `<div class="letter-box"></div>`;
}
for (let i = 1; i < 7; i++) {
    document.querySelector(`.game-box:nth-child(${i})`).innerHTML = boxes;
}

function previewGame(start=true) {
    document.querySelector(`.change`).innerHTML = `<div class="change-box" onclick="newPage('-')">-</div><div class="change-box" onclick="newPage('+')">+</div>`;
    document.querySelector(`.start`).innerHTML = start?`<div class="start-box" onclick="startGame()">START</div>`:``;
    document.querySelector(`.keyboard`).style.marginTop = `-1000%`;
    document.querySelector(`.keyboard`).style.display = `none`;
}

function startGame() {
    game = 1;
    document.querySelector(`.change`).innerHTML = ``;
    document.querySelector(`.start`).innerHTML = ``;
    document.querySelector(`.keyboard`).style.marginTop = `0`;
    document.querySelector(`.keyboard`).style.display = `flex`;
}

function hideOverlay() {
    let overlay = document.querySelector(`.overlay`);
    overlay.style.opacity = `0`;
    overlay.style.left = `-100%`;
    let error_box = document.querySelector(`.error-box`);
    error_box.style.display = `none`;
    previewGame(false);
}

function goToNextWord() {
    word_number++;
    word_array = [];
    game_box = document.querySelector(`.game-box:nth-child(${word_number})`);
}

function setWord(n) {
    today = secretWords[n-3];
}

function newPage(s) {
    if (!((n === 3 && s === "-") || (n === 8 && s === "+"))) {
        boxes = "";
        s === "+" ? n++ : n--;
        setWord(n);
        for (let j = 0; j < n; j++) {
            boxes += `<div class="letter-box"></div>`;
        }
        for (let i = 1; i < 7; i++) {
            document.querySelector(`.game-box:nth-child(${i})`).innerHTML = boxes;
        }
        word_number = 1;
        word_array = [];
        game_box = document.querySelector(`.game-box:nth-child(${word_number})`);
        previewGame();
    }
    if ((n === 3) || (n === 8)) {
        document.querySelector(`.change-box:nth-child(${n === 3 ? 1 : 2})`).style.backgroundColor = `#888`;
        document.querySelector(`.change-box:nth-child(${n === 3 ? 1 : 2})`).style.cursor = `default`;
    }
    else {
        document.querySelector(`.change-box:nth-child(${1})`).style.backgroundColor = `#ddd`;
        document.querySelector(`.change-box:nth-child(${1})`).style.cursor = `pointer`;
        document.querySelector(`.change-box:nth-child(${2})`).style.backgroundColor = `#ddd`;
        document.querySelector(`.change-box:nth-child(${2})`).style.cursor = `pointer`;
    }

    green = [];
    yellow= [];
    grey = [];
    for (let i = 0; i < letters.length; i++) {
        document.getElementById(letters[i]).style.backgroundColor = `#d9dcde`;
    }
}

async function checkWord(word) {
    let res = await fetch("https://api.lessgames.com/wordless/validate/" + word).then(x => x.json())
    return await res.exists;
}

function displayWord() {
    for (let i = 0; i < n; i++) {
        if (word_array[i] != null) {
            game_box.querySelector(`.letter-box:nth-child(${i + 1})`).innerHTML = word_array[i];
        }
        else{
            game_box.querySelector(`.letter-box:nth-child(${i + 1})`).innerHTML = "";
        }
    }
}

function checkLetter() {
    todayUpper = today.toUpperCase();
    today_array = todayUpper.split("");
    check_today_array = today_array;
    colors = [];
    for (let i = 0; i < n; i++) {
        if (check_today_array[i] == word_array[i]) {
            colors[i] = `#55B725`;
            check_today_array[i] = null;
            green.push(word_array[i]);
        }
    }
    for (let i = 0; i < n; i++) {
        if (check_today_array.includes(word_array[i])) {
            colors[i] = `#cab216`;
            check_today_array[check_today_array.indexOf(word_array[i])] = null;
            yellow.push(word_array[i]);
        }
    }
    for (let i = 0; i < n; i++) {
        if (colors[i] == null) {
            colors[i] = `#777780`;
            grey.push(word_array[i]);
        }
    }

    for (let i = 0; i < grey.length; i++) {
        document.getElementById(grey[i]).style.backgroundColor = `#777780`;
    }
    for (let i = 0; i < yellow.length; i++) {
        document.getElementById(yellow[i]).style.backgroundColor = `#cab216`;
    }
    for (let i = 0; i < green.length; i++) {
        document.getElementById(green[i]).style.backgroundColor = `#55B725`;
    }
    return colors;
}

function applyPopEffect(divId, key, push = true) {
    var popDiv = game_box.querySelector(divId);
    popDiv.style.transform = 'scale(1.1)';
    push ? word_array.push(key) : word_array.pop();
    displayWord();
    setTimeout(function() {
        popDiv.style.transform = 'scale(1)';
    }, 100);
}

async function enterLetter(key) {
    if (letters.includes(key) && word_array.length < n) {
        applyPopEffect(`.letter-box:nth-child(${word_array.length + 1})`, key);
    }
    else if (key === 'BACKSPACE') {
        try {
            applyPopEffect(`.letter-box:nth-child(${word_array.length})`, key, push=false);
        }
        catch (e) {
            e ='';
        }
    }

    else if (key === 'ENTER') {
        word = word_array.join("").toLowerCase();

        if (word_array.length < n) {
            let error_box = document.querySelector(`.error-box`);
            error_box.innerHTML = `Word too short!`;
            error_box.style.backgroundColor = `#888`;
            error_box.style.padding = `10px 0`;
            error_box.style.opacity = `1`;
            error_box.style.display = `flex`;
            setTimeout(function() {
                error_box.style.display = `none`;
            }, 1500);
        }

        else {
            if (await checkWord(word)) {
                if (today === word) {
                    game = 0;
                    var divElements = game_box.querySelectorAll('.letter-box');
                    divElements.forEach(function (div, index) {
                        setTimeout(function () {
                            div.style.transform = 'scale(1.1)';
                            div.style.backgroundColor = `#55B725`;
                            setTimeout(function() {
                                div.style.transform = 'scale(1)';
                            }, 100);
                        }, index * 250);
                    });
                    let error_box = document.querySelector(`.error-box`);
                    setTimeout(function() {
                        error_box.innerHTML = `You won!<button class="hide-box" onclick="hideOverlay()">Back</button>`;
                        error_box.style.display = `flex`;
                        error_box.style.padding = `30px 0`;
                        error_box.style.backgroundColor = `#55B725`;
                        document.querySelector(`.overlay`).style.opacity = `0.5`;
                        document.querySelector(`.overlay`).style.left = `0`;
                    }, 250*n);
                }

                else {
                    i = 0;
                    colors = checkLetter(word);
                    var divElements = game_box.querySelectorAll('.letter-box');
                    divElements.forEach(function (div, index) {
                        setTimeout(function () {
                            div.style.transform = 'scale(1.1)';
                            div.style.backgroundColor = colors[i];
                            setTimeout(function() {
                                div.style.transform = 'scale(1)';
                            }, 100);
                            i++;
                        }, index * 250);
                    });
                }
                if (word_number < 6) {
                    goToNextWord();
                }
                else {
                    let error_box = document.querySelector(`.error-box`);
                    setTimeout(function() {
                        error_box.innerHTML = `Game over!<span style="margin-top:10px;font-size:30px;">${today.toUpperCase()}</span><button class="hide-box" onclick="hideOverlay()">Back</button>`;
                        error_box.style.display = `flex`;
                        error_box.style.padding = `50px 0`;
                        error_box.style.backgroundColor = `#dd3333`;
                        document.querySelector(`.overlay`).style.opacity = `0.5`;
                        document.querySelector(`.overlay`).style.left = `0`;
                    }, 250*n);
                }
            }

            else {
                let error_box = document.querySelector(`.error-box`);
                error_box.innerHTML = `Word not found!`;
                error_box.style.backgroundColor = `#888`;
                error_box.style.padding = `10px 0`;
                error_box.style.display = `flex`;
                setTimeout(function() {
                    error_box.style.display = `none`;
                }, 1500);
            }
        }
    }
}

document.addEventListener('keydown', (event) => {
    if (game === 1) {
        key = event.key.toUpperCase();
        enterLetter(key);
    }
});
