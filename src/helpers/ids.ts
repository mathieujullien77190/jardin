export const createId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const createCode = (): string =>
  String(Math.floor(100000 + Math.random() * 900000));
