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
            },
            fontFamily: {
                sans:    ['Outfit', ...defaultTheme.fontFamily.sans],
                display: ['"Bebas Neue"', 'cursive'],
            },
        },
    },

    plugins: [forms],
};
