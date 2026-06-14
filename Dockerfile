# Stage 1: Frontend build
FROM node:20 AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Composer dependencies
FROM composer:2 AS backend
WORKDIR /app
COPY composer.json composer.lock ./
COPY database/ database/
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Stage 3: Production image
FROM php:8.3-fpm AS production

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql zip gd bcmath \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copy application source
COPY . .

# Copy compiled frontend assets
COPY --from=frontend /app/public/build public/build

# Copy vendor dependencies
COPY --from=backend /app/vendor vendor/

# Copy Docker runtime config
COPY docker/nginx.conf /etc/nginx/sites-available/default
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set correct ownership for writable directories
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
