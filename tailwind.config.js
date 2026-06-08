import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                bg:       '#0D0D0D',
                surface:  '#1A1A1A',
                surface2: '#242424',
                gold: {
                    DEFAULT: '#D4AF37',
                    dark:    '#B8960C',
                    light:   '#F0D060',
                },
                danger: {
                    DEFAULT: '#C0392B',
                    dark:    '#962d22',
                },
                cream:   '#F5F0E8',
                content: '#E0E0E0',
                muted:   '#888888',
                success: '#27AE60',
                'border-default': 'rgba(212,175,55,0.2)',
            },
            fontFamily: {
                sans:    ['Outfit', ...defaultTheme.fontFamily.sans],
                display: ['"Bebas Neue"', 'cursive'],
            },
            borderRadius: {
                none: '0px',
                sm:   '2px',
                md:   '4px',
            },
            boxShadow: {
                'glow-gold':   '0 0 20px rgba(212,175,55,0.15)',
                'glow-danger': '0 0 20px rgba(192,57,43,0.20)',
            },
            transitionDuration: {
                150: '150ms',
                200: '200ms',
                300: '300ms',
            },
        },
    },

    plugins: [forms],
};
