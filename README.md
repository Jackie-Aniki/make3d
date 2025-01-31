```ts
import {
  addEventListeners,
  Enemy,
  loadTextures,
  Player,
  state,
  ViewLevel
} from 'engine25d';

export const start = async () => {
  await loadTextures(['./elf.png', './grass-side.png', './skybox.jpg']);

  const levelTextures = Array.from({ length: 6 }, () => textures.grassSide);
  const level = new ViewLevel(levelTextures);
  const props = {
    textureName: 'elf',
    totalFrames: 6,
    frameDuration: 120,
    cols: 3,
    rows: 6,
    directionsToRows: {
      down: 0,
      up: 2,
      default: 4
    }
  };

  state.player = new Player(level, props);
  state.enemies = Array.from({ length: 64 }, () => new Enemy(level, props));

  addEventListeners();
};
```
