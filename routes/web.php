<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\LandingController;
use App\Http\Controllers\Public\MiParticipacionController;
use App\Http\Controllers\Public\SorteoPublicoController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/sorteos/{sorteo}', [SorteoPublicoController::class, 'show'])->name('sorteos.show');
Route::post('/sorteos/{sorteo}/registrar', [SorteoPublicoController::class, 'store'])->name('sorteos.registrar');
Route::get('/mi-participacion', [MiParticipacionController::class, 'index'])->name('mi-participacion');
Route::post('/mi-participacion/buscar', [MiParticipacionController::class, 'buscar'])->name('mi-participacion.buscar');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
