const wordDisplay = document.getElementById('word-display');
const attemptsDisplay = document.getElementById('attempts');
const incorrectLettersDisplay = document.getElementById('incorrect-letters');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const hintButton = document.getElementById('hint-button');
const messageDisplay = document.getElementById('message');
const scoreDisplay = document.getElementById('score');
const hangmanArt = document.getElementById('hangman-art');

let secretWord = '';
let guessedWord = [];
let attempts = 6;
let guessedLetters = [];
let incorrectLetters = [];
let score = 0;

// Desenho da forca em formato de texto
const hangmanStages = [
    `
       -----
       |   |
           |
           |
           |
           |
    ------------
    `,
    `
       -----
       |   |
       O   |
           |
           |
           |
    ------------
    `,
    `
       -----
       |   |
       O   |
       |   |
           |
           |
    ------------
    `,
    `
       -----
       |   |
       O   |
      /|   |
           |
           |
    ------------
    `,
    `
       -----
       |   |
       O   |
      /|\\  |
           |
           |
    ------------
    `,
    `
       -----
       |   |
       O   |
      /|\\  |
      /    |
           |
    ------------
    `,
    `
       -----
       |   |
       O   |
      /|\\  |
      / \\  |
           |
    ------------
    `
];

// Função para carregar a palavra secreta do JSON
async function loadSecretWord() {
    try {
        const response = await fetch('db.json'); // Carrega o arquivo JSON
        const data = await response.json();
        secretWord = data.secretWord.toUpperCase(); // Define a palavra secreta
        initGame();
    } catch (error) {
        console.error('Erro ao carregar a palavra secreta:', error);
        messageDisplay.textContent = "Erro ao carregar o jogo. Tente novamente.";
    }
}

// Função para inicializar o jogo
function initGame() {
    guessedWord = Array(secretWord.length).fill('_');
    guessedLetters = [];
    incorrectLetters = [];
    updateDisplay();
}

// Atualiza a exibição da palavra, tentativas e desenho da forca
function updateDisplay() {
    wordDisplay.textContent = guessedWord.join(' ');
    attemptsDisplay.textContent = `Tentativas restantes: ${attempts}`;
    incorrectLettersDisplay.textContent = `Letras incorretas: ${incorrectLetters.join(', ')}`;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    hangmanArt.textContent = hangmanStages[6 - attempts];
}

// Verifica a letra digitada
function checkGuess() {
    const letter = guessInput.value.toUpperCase();
    guessInput.value = '';

    if (!letter || guessedLetters.includes(letter)) {
        messageDisplay.textContent = "Letra inválida ou já tentada.";
        return;
    }

    guessedLetters.push(letter);

    if (secretWord.includes(letter)) {
        for (let i = 0; i < secretWord.length; i++) {
            if (secretWord[i] === letter) {
                guessedWord[i] = letter;
            }
        }
        messageDisplay.textContent = "Boa! Letra correta.";
    } else {
        attempts--;
        incorrectLetters.push(letter);
        messageDisplay.textContent = "Letra incorreta. Tente novamente.";
    }

    updateDisplay();

    if (guessedWord.join('') === secretWord) {
        score += attempts * 10;
        messageDisplay.textContent = `Parabéns! Você venceu! Pontuação: ${score}`;
        endGame();
    } else if (attempts === 0) {
        messageDisplay.textContent = `Game over! A palavra era "${secretWord}".`;
        endGame();
    }
}

// Dica: Revela uma letra aleatória
function giveHint() {
    const hiddenLetters = [];
    for (let i = 0; i < secretWord.length; i++) {
        if (guessedWord[i] === '_') {
            hiddenLetters.push(i);
        }
    }

    if (hiddenLetters.length > 0) {
        const randomIndex = hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];
        guessedWord[randomIndex] = secretWord[randomIndex];
        updateDisplay();
        messageDisplay.textContent = `Dica: A letra "${secretWord[randomIndex]}" foi revelada.`;
    } else {
        messageDisplay.textContent = "Todas as letras já foram reveladas.";
    }
}

// Finaliza o jogo
function endGame() {
    guessInput.disabled = true;
    guessButton.disabled = true;
    hintButton.disabled = true;
}

// Event listeners
guessButton.addEventListener('click', checkGuess);
hintButton.addEventListener('click', giveHint);
guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

// Inicializa o jogo
loadSecretWord();