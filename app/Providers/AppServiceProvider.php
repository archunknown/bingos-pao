<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Rate limiter global por IP — corrige el bug donde throttle:5,1 usa el path
        // como parte de la clave, permitiendo N sorteos × 5 req/min por IP.
        RateLimiter::for('sorteo-registro', function (Request $request) {
            return [
                Limit::perMinute(5)->by($request->ip()),
                Limit::perHour(25)->by($request->ip()),
            ];
        });
    }
}
