import Home from './Home.svelte';
import GameBoard from './GameBoard.svelte';
import GameConfig from './GameConfig.svelte';

export default {
  '/': Home,
  '/game/:game/play': GameBoard,
  '/game/:game/config': GameConfig,
  '*': Home,
};
