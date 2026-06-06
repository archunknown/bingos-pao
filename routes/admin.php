<?php

use App\Http\Controllers\Admin\ConfiguracionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GanadorController;
use App\Http\Controllers\Admin\ParticipanteController;
use App\Http\Controllers\Admin\PremioController;
use App\Http\Controllers\Admin\SorteoController;
use App\Http\Controllers\Admin\TransmisionController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware(['web', 'auth'])->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Sorteos
    Route::resource('sorteos', SorteoController::class);

    // Premios — CRUD anidado bajo sorteos + índice plano para la sidebar
    Route::get('premios', [PremioController::class, 'index'])->name('premios.index');
    Route::resource('sorteos.premios', PremioController::class)
        ->except(['index'])
        ->shallow();

    // Participantes — CRUD anidado bajo sorteos + índice plano para la sidebar
    Route::get('participantes', [ParticipanteController::class, 'index'])->name('participantes.index');
    Route::resource('sorteos.participantes', ParticipanteController::class)
        ->except(['index'])
        ->shallow();

    // Ganadores
    Route::resource('ganadores', GanadorController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    // Configuración
    Route::get('configuracion', [ConfiguracionController::class, 'index'])->name('configuracion.index');
    Route::post('configuracion', [ConfiguracionController::class, 'update'])->name('configuracion.update');

    // Transmisión
    Route::get('transmision', [TransmisionController::class, 'index'])->name('transmision.index');
    Route::post('transmision', [TransmisionController::class, 'update'])->name('transmision.update');
});
