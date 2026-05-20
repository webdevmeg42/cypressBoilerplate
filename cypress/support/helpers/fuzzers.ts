const ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMERIC = '0123456789';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;\':",.<>?/`~\\';

const EMOJIS = [
  '😀', '😂', '🥹', '😍', '🤔', '😎', '🥳', '😱', '🤯', '💀',
  '🔥', '💯', '✨', '🎉', '🚀', '💩', '👀', '🙈', '🦄', '🐉',
  '🍕', '🌮', '🍣', '🌈', '⚡', '❄️', '🌊', '🏔️', '🌺', '🎸',
];

type StringCharset = 'alpha' | 'alphanumeric' | 'all';

export function fuzzString(length = 10, charset: StringCharset = 'alphanumeric'): string {
  const pool =
    charset === 'alpha' ? ALPHA :
    charset === 'alphanumeric' ? ALPHA + NUMERIC :
    ALPHA + NUMERIC + SPECIAL;
  return Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)]).join('');
}

export function fuzzEmoji(count = 1): string {
  return Array.from(
    { length: count },
    () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
  ).join('');
}

export function fuzzIp(version: 4 | 6 = 4): string {
  if (version === 4) {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
  }
  return Array.from(
    { length: 8 },
    () => Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')
  ).join(':');
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}
