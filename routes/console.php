<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Purga automática cada hora: elimina pendientes +48h y rechazados +7 días con sus archivos.
Schedule::command('spam:purgar')->hourly();
