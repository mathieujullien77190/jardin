// Page description (markdown) of a story, read from its `.fr.md` file.
export const prose = (fr: string) => ({
  docs: { description: { component: fr } },
});
