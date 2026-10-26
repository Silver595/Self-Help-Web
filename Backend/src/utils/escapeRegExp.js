// Treat user input as plain text inside a RegExp ("c++" must not break the pattern)
export const escapeRegExp = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
