/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts,jsx}"],
  theme: {
    extend: {
			spacing: {
				'128': '32rem',
			},
      fontFamily: {
        'computer': [ 'B612 Mono', 'monospace' ]
      }
		},
  },
  plugins: [],
}
