export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ink: '#0F172A', paper: '#F7F8FA', ledger: '#E7EAEF', gain: '#0F9D6B', loss: '#D64545', accent: '#4F5FEA' },
    fontFamily: { display: ['"Space Grotesk"', 'sans-serif'], body: ['"Inter"', 'sans-serif'], mono: ['"IBM Plex Mono"', 'monospace'] },
  } },
  plugins: [],
};
