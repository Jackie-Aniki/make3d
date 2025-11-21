# make3d

## ddd retro boomer game engine

<img alt="https://legacyofpain.app" src="https://pietal.dev/screenshot/legacy-of-pain-app.webp" width="50%" />

**https://legacyofpain.app**

### example usage

```ts
// Game.tsx
import { CubeLevel, loadTextures, textures } from 'make3d'
import { FC, useEffect, useRef } from 'react'

export const createLevel = async (canvas: HTMLCanvasElement) => {
  await loadTextures(['biome/top.webp', 'biome/side.webp']);
  return new CubeLevel(canvas, {
    sides: textures.side,
    floor: textures.top,
    ocean: textures.ocean
  });
};

export const Game: FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;

    if (canvas) {
      createLevel(canvas).then((level) => {
        // createObjects(level);
      });
    }
  }, [ref]);

  return <canvas ref={ref} id="game" />;
};
```
