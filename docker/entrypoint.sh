#!/bin/bash
set -e
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
