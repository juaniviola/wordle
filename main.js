import './style.css'
import Game from './utils/game'

const game = new Game();
game.buildUI();
document.addEventListener('keyup', game.keyPressed.bind(game));
