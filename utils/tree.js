import words from './words';

class Tree {
  constructor() {
    const RANDOM_WORD = Math.trunc(Math.random() * (words.length - 1));

    this.words = {};
    this.selected = words[RANDOM_WORD];
  }

  build() {
    words.forEach((word) => {
      let ref = this.words;
      for (let index = 0; index < 5; index += 1) {
        const letter = word[index];
        const n = index === 4 ? 1 : {};
        ref[letter] = !ref[letter] ? n : {...ref[letter]};
        ref = ref[letter];
      }
    });

    return this.words;
  }

  isInDictionary(word) {
    let copy = this.words;
    for (let index = 0; index < 5; index += 1) {
      const letter = word[index];
      if (!copy[letter]) return false;

      copy = copy[letter];
    }

    return true;
  }

  getHints(word) {
    if (this.selected === word) {
      return Array(6).fill('green');
    }

    const selectedMap = [], userWordMap = [], hints = new Array(5).fill('-');

    this.selected.split('').forEach((letter) => selectedMap[letter] = (selectedMap[letter] + 1) || 1);
    word.split('').forEach((letter) => userWordMap[letter] = (userWordMap[letter] + 1 || 1));

    // looking correct and incorrect letters
    for (let i = 0; i < 5; i += 1) {
      if (this.selected[i] === word[i] && userWordMap[word[i]] > 0 && selectedMap[word[i]] > 0) {
        hints[i] = 'green';
        userWordMap[word[i]] -= 1;
        selectedMap[word[i]] -= 1;
      } else if (!selectedMap[word[i]]) {
        hints[i] = 'grey';
      }
    }

    // looking for letters in incorrect position
    for (let i = 0; i < 5; i += 1) {
      if (hints[i] === '-' && userWordMap[word[i]] > 0 && selectedMap[word[i]] > 0) {
        hints[i] = 'yellow';
        userWordMap[word[i]] -= 1;
        selectedMap[word[i]] -= 1;
      } else if (hints[i] === '-') {
        hints[i] = 'grey';
      }
    }

    return hints;
  }
}

export default Tree;
