# make3d

## ddd retro boomer game engine

<img alt="https://legacyofpain.app" src="https://pietal.dev/screenshot/legacy-of-pain-app.webp" width="50%" />

**https://legacyofpain.app**

### example usage

```ts
import {
  addEventListeners,
  Enemy,
  loadTextures,
  Player,
  state,
  textures,
  ViewLevel
} from 'make3d';

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

  state.player = new Player({ level, ...props });
  state.enemies = Array.from(
    { length: 64 },
    () => new Enemy({ level, ...props })
  );

  addEventListeners();
};

start();
```
