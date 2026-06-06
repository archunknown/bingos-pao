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
    Route::patch('sorteos/{sorteo}/toggle-estado', [SorteoController::class, 'toggleEstado'])->name('sorteos.toggle-estado');

    // Premios — CRUD anidado bajo sorteos + índice plano para la sidebar
    Route::resource('sorteos.premios', PremioController::class)
    ->shallow();

    // Participantes
    Route::get('participantes', [ParticipanteController::class, 'index'])->name('participantes.index');
    Route::get('participantes/{participante}', [ParticipanteController::class, 'show'])->name('participantes.show');
    Route::patch('participantes/{participante}/confirmar', [ParticipanteController::class, 'confirmar'])->name('participantes.confirmar');
    Route::patch('participantes/{participante}/rechazar', [ParticipanteController::class, 'rechazar'])->name('participantes.rechazar');
    Route::resource('sorteos.participantes', ParticipanteController::class)
        ->only(['store'])
        ->shallow();

    // Ganadores
    Route::get('ganadores/opciones', [GanadorController::class, 'opciones'])->name('ganadores.opciones');
    Route::resource('ganadores', GanadorController::class)->only(['index', 'store']);
    Route::patch('ganadores/{ganador}/toggle-publicado', [GanadorController::class, 'togglePublicado'])->name('ganadores.toggle-publicado');

    // Configuración
    Route::get('configuracion', [ConfiguracionController::class, 'index'])->name('configuracion.index');
    Route::post('configuracion', [ConfiguracionController::class, 'update'])->name('configuracion.update');

    // Transmisión
    Route::get('transmision', [TransmisionController::class, 'index'])->name('transmision.index');
    Route::post('transmision', [TransmisionController::class, 'update'])->name('transmision.update');
});
