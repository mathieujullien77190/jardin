// Shows the code a consumer would write instead of the JSX rebuilt from args.
export const source = (code: string) => ({
  docs: {
    source: {
      code: code.replace(/^```tsx\n|\n```\s*$/g, ''),
      language: 'tsx',
      type: 'code',
    },
  },
});
