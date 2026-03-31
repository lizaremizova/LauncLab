#!/bin/sh
set -e

echo "Preparing Laravel directories..."

mkdir -p /var/www/storage/logs
mkdir -p /var/www/storage/framework/cache
mkdir -p /var/www/storage/framework/sessions
mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/bootstrap/cache

chmod -R 777 /var/www/storage /var/www/bootstrap/cache

if [ -f /var/www/artisan ]; then
    echo "Clearing Laravel caches..."
    php /var/www/artisan optimize:clear || true
fi

echo "Starting php-fpm..."
exec php-fpm
