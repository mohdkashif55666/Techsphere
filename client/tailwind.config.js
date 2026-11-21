/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFFFF',
        surface: '#F8F9FA',
        surfaceHover: '#F1F3F4',
        border: '#E0E0E0',
        borderStrong: '#DADCE0',
        borderSubtle: '#E0E0E0', // backward compatibility alias
        borderFocus: '#1A73E8',
        ink: '#202124',
        muted: '#5F6368',
        subtle: '#80868B',
        lightMuted: '#80868B', // backward compatibility alias
        blue: '#1A73E8',
        blueHover: '#1765CC',
        blueBg: '#E8F0FE',
        googleBlue: '#1A73E8', // backward compatibility alias
        googleBlueBg: '#E8F0FE', // backward compatibility alias
        // Restrained semantic colors
        success: '#1E8E3E',
        successBg: '#E6F4EA',
        warning: '#B06000',
        warningBg: '#FEF7E0',
        danger: '#D93025',
        dangerBg: '#FCE8E6',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      letterSpacing: {
        display: '-0.025em',
        normal: '0',
      },
    },
  },
  plugins: [],
};
