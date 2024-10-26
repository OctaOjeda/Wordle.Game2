async function obtenerPalabra() {
    const url = `https://random-word-api.vercel.app/api?words=1&length=5`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

// Function que valida la palabra ingresa por el usuario
function validateWord(targetWord, guessedWord, inputs, results, gameBoard) {
    console.log("validateWord")
    inputs.push(guessedWord);
    
    // Convert words to arrays for easier manipulation
    const guessArr = guessedWord.toLowerCase().split('');
    const targetArr = targetWord.toLowerCase().split('');

    // Array to store the result of each letter's validation
    let result = new Array(guessedWord.length).fill(''); // 'correct', 'semi-correct', or 'incorrect'

    // First pass: check for letters in the correct position (green in Wordle)
    for (let i = 0; i < guessArr.length; i++) {
        if (guessArr[i] === targetArr[i]) {
            result[i] = 'c';
            targetArr[i] = null; // Mark as used to avoid duplicate checks in second pass
        }
    }

    // Second pass: check for misplaced letters (yellow in Wordle)
    for (let i = 0; i < guessArr.length; i++) {
        if (result[i] === '') { // If not already marked as correct
            const indexInTarget = targetArr.indexOf(guessArr[i]);
            if (indexInTarget !== -1) {
                result[i] = 's';
                targetArr[indexInTarget] = null; // Mark as used
            } else {
                result[i] = 'i'; // Letter is not in the word
            }
        }
    }

    results[results.length] = result;
    refreshGame(inputs, results, gameBoard);

    // Mostrar un alert si el usuario gana WIN o pierde LOST el juego
    const corrects = results[results.length - 1].filter((value) => value === "c")
    if (corrects.length === 5) {
        alert('WIN');
    } else if (results.length === 6) {
        alert("LOST")
    }
}

// Function que refresca el tablero y agrega la clase correspondiente (verde, amarillo, gris)
function refreshGame(inputs, results, gameBoard) {
    const cells = gameBoard.getElementsByClassName('cell');
    for (let i = 0; i < 30; i++) { // 6 attempts, 5 letters each
        let cell = cells[i];
        let y = Math.floor(i / 5);
        let x = i - y * 5;
        if(inputs.length > y && inputs[y][x]) {
            let result = '';
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

window.onload = async (event) => {
    // Obtiene la palabra e imprime, es un array
    const apiWord = await obtenerPalabra();
    console.log(apiWord)

    const gameBoard = document.getElementById('gameBoard');
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');

    const inputs = [];
    const results = [];

    if (apiWord.length > 0){
        // Obtiene el primer elemento del array que es la palabra a adivinar
        const targetWord = apiWord[0];

        // Function que llama a la validacion de la palabra
        function handleUpdate() {
            let guess = guessInput.value.toLowerCase();
            if (guess.length === 5) {
                validateWord(targetWord, guess, inputs, results, gameBoard);
            } else {
                alert('Please enter a 5-letter word.');
            }
        }

        // Event listener para boton de guess
        guessButton.addEventListener('click', function() {
            handleUpdate();
        });

        // Event listener para input de guess
        // guessInput.addEventListener('change', function() {
        //     handleUpdate();
        // });

        // Function que inicializa el tablero
        function initializeGame() {
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
    } else {
        alert("Ha ocurrido un error al obtener datos de la Api")
    }
};

const keys = document.querySelectorAll('.key');
keys.forEach(key => {
    key.addEventListener('click', () => {
        const guessInput = document.getElementById('guessInput');
        if (guessInput.value.length < 5) {
            guessInput.value += key.textContent;
        }
    });
});