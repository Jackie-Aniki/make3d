import { normalizeAngle } from './utils';

const defaultPrecision = Math.PI / 18;

const fastSin = (precision = defaultPrecision) => {
  const cache = new Map();

  return (angle: number) => {
    const key = Math.floor(normalizeAngle(angle) / precision);
    if (!cache.has(key)) {
      cache.set(key, Math.sin(key * precision));
    }

    return cache.get(key);
  };
};

const fastCos = (precision = defaultPrecision) => {
  const cache = new Map();

  return (angle: number) => {
    const key = Math.floor(normalizeAngle(angle) / precision);
    if (!cache.has(key)) {
      cache.set(key, Math.cos(key * precision));
    }

    return cache.get(key);
  };
};

export const sin = fastSin();

export const cos = fastCos();
