import anime from "animejs";
import Tree from "./tree";

class Game {
  constructor() {
    this.tree = new Tree();
    this.userWords = new Array(6).fill(['', '', '', '', '']);
    this.lastIndex = 0;
    this.lastTry = 0;
    this.endGame = 0;

    this.tree.build();
  }

  keyPressed (ev) {
    if (this.endGame || this.lastTry === 6) return;

    const { key, code } = ev;

    // delete letter
    if (code === 'Backspace' && this.lastIndex - 1 >= 0) {
      document.getElementById(`w:${this.lastTry}-${this.lastIndex - 1}`).innerHTML = '';
      this.lastIndex -= 1;
      return;
    }

    // send word
    if (code === 'Enter' && this.lastIndex === 5) {
      let currentWord = '';
      for (let i = 0; i < 5; i++) {
        currentWord += this.userWords[this.lastTry][i];
      }

      if (!this.tree.isInDictionary(currentWord)) {
        alert('La palabra no esta en el diccionario.');
        return;
      }

      const hints = this.tree.getHints(currentWord);
      for (let i = 0; i < 5; i++) {
        const color = hints[i];

        const currentLetter = document.getElementById(`l:${currentWord[i]}`);
        const currentCell = document.getElementById(`w:${this.lastTry}-${i}`);
        currentCell.className = 'letter '.concat(color);
        anime({
          targets: currentCell,
          rotateX: '1turn',
          duration: 1500,
        });

        if ((currentLetter.className === 'key yellow' || currentCell.className === 'key green') && color === 'grey') continue;
        if (currentLetter.className === 'key green' && color === 'yellow') continue;

        currentLetter.className = 'key '.concat(color);
      }

      if (hints.length === 6) {
        this.endGame = true;
        setTimeout(() => alert('Felicidades ganaste!'), 1600);
      } else {
        this.lastTry += 1;
        this.lastIndex = 0;

        if (this.lastTry === 6) setTimeout(() => alert('La palabra correcta es: ' + this.tree.selected), 1600);
      }
    }

    if ((code.startsWith('Key') || code === 'Semicolon') && this.lastIndex < 5) {
      this.userWords[this.lastTry][this.lastIndex] = key.toUpperCase();
      document.getElementById(`w:${this.lastTry}-${this.lastIndex}`).innerHTML = key.toUpperCase();
      this.lastIndex += 1;
    }
  }

  buildUI() {
    this.userWords.forEach((_, index) => {
      let letterBlocks = '';
      for (let i = 0; i < 5; i++) {
        letterBlocks += `<div class="letter" id="w:${index}-${i}"></div>`
      }

      document.querySelector('#board').innerHTML += `
        <div class="try" id="try-${index}">
          ${letterBlocks}
        </div>
      `;
    });

    const keyboard = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
      ['🆗', 'Z', 'X', 'C', 'V', 'B', 'N', 'M' ,'🔙'],
    ];

    keyboard.forEach((keys, index) => {
      let currentKeys = '';
      keys.forEach((key) => {
        currentKeys += `<div class="key" id="l:${key}" onclick="clickKeyboard('${key}')">${key}</div>`;
      });

      document.querySelector('#keyboard').innerHTML += `
        <div class="line" id="line-${index}">
          ${currentKeys}
        </div>`;
    });

    const clickKeyboard = (key) => {
      const code = key === '🆗' ? 'Enter' : 'Backspace';
      this.keyPressed({ key, code: (key === '🆗' || key === '🔙') ? code : 'Key' });
    }
    window.clickKeyboard = clickKeyboard;
  }
}

export default Game;
