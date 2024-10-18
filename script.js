// window.addEventListener("load", (event) => {
//     console.log("page is fully loaded");
// });

const gameBoard = document.getElementById('gameBoard');
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');

const inputs = [];
const results = [];

let solutionWord = 'house';

function validate(guess) {
    console.log(guess);
    inputs.push(guess);
    // const validation = ["i", "i", "i", "i", "c"];
    // results.push(validation);
    // console.log(results.lenght);
    results[results.length] = [];

    for (let i= 0; i < 5; i++) {
        if (guess[i] === solutionWord[i]) {
            results[results.length - 1].push("c");
        } else if (solutionWord.includes(guess[i])) {
            results[results.length - 1].push("s");
        } else {
            results[results.length - 1].push("i");
        }
    }

    // console.log(inputs)
    // console.log(results)

    refreshGame();
}

function refreshGame() {
    const cells = gameBoard.getElementsByClassName('cell');
      for (let i = 0; i < 30; i++) { // 6 attempts, 5 letters each
        let cell = cells[i];
        let y = Math.floor(i / 5);
        let x = i - y * 5;
        if(inputs.length > y && inputs[y][x]) {
            let result = '';
            // console.log(results[y][x])
            if (results[y][x] === "c") {
                result = "correct"
            } else if (results[y][x] === "s") { 
                result = "semi-correct"
            } else {
                result = "incorrect"
            }
            cell.textContent = inputs[y][x].toUpperCase();
            cell.classList.add(result);
        }
    }
}

// Event listener para boton de guess
guessButton.addEventListener('click', function() {
    let guess = guessInput.value.toLowerCase();
    if (guess.length === 5) {
        validate(guess);
    } else {
        alert('Please enter a 5-letter word.');
    }
});

// guessInput.addEventListener('change', function() {
//     let guess = guessInput.value.toLowerCase();
//     console.log(guess)
// });

function initializeGame() {
    console.log(gameBoard);
    for (let i = 0; i < 30; i++) { // 6 attempts, 5 letters each
        let cell = document.createElement('div');
        cell.classList.add('cell');
        let y = Math.floor(i / 5);
        let x = i - y * 5;

        if(inputs.length > y && inputs[y][x]) {
            const result = results[y][x] === "+" ? "correct" : results[y][x] === "x" ? "semi-correct" : "incorrect";
            cell.textContent = inputs[y][x].toUpperCase();
            cell.classList.add(result);
        }

        gameBoard.appendChild(cell);
    }
}

initializeGame();
