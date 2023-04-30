/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts,jsx}"],
  theme: {
    extend: {
			spacing: {
				'128': '32rem',
			},
      fontFamily: {
        'computer': [ '"Roboto Mono"', 'monospace' ],
        'dialogue': [ '"Darumadrop One"', 'handwriting' ]
      },
      animation: {
        'dialogue_letter_in': 'dialogue_letter_in 0.1s ease-in-out 1 forwards',
        'product_on': 'product_on 1s ease-in-out 1 forwards',
        'product_off': 'product_off 1s ease-in-out 1 forwards',
        'conveyor_move': 'conveyor_move 1s ease-in-out 1 forwards',
        'screen_activate': 'screen_activate 0.1s ease-in-out 1 forwards',
        'time_flash': 'time_flash 0.5s ease-in-out 1 forwards',
      },
      keyframes: {
        'dialogue_letter_in': {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'product_on': {
          '0%': { transform: 'translateX(calc(-50% - 80vw))' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'product_off': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(calc(-50% + 80vw))' },
        },
        'conveyor_move': {
          '0%': { transform: 'translateX(-80vw)' },
          '100%': { transform: 'translateX(0)' },
        },
        'screen_activate': {
          '0%': { transform: 'scaleX(0.5) scaleY(0)', opacity: 0, filter: 'blur(4px)' },
          '30%': { transform: 'scaleX(0.55) scaleY(0.85)', opacity: 0.3, filter: 'blur(2px)' },
          '100%': { transform: 'scaleX(1) scaleY(1)', opacity: 1, filter: 'none' }
        },
        'time_flash': {
          '0%': { opacity: 0, transform: 'scale(20)' },
          '50%': { opacity: 1, transform: 'scale(15)' },
          '100%': { opacity: 0, transform: 'scale(10)' },
        }
      }
		},
  },
  plugins: [],
}
