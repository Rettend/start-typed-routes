import antfu from '@antfu/eslint-config'

export default antfu({
  solid: true,
  typescript: true,
  rules: {
    'no-console': 'warn',
    'curly': ['warn', 'multi-or-nest', 'consistent'],
    'style/jsx-one-expression-per-line': ['warn', { allow: 'single-line' }],
  },
})
