<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\GanadoresPublicoController;
use App\Http\Controllers\Public\LandingController;
use App\Http\Controllers\Public\MiParticipacionController;
use App\Http\Controllers\Public\SorteoPublicoController;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/sorteos', [SorteoPublicoController::class, 'index'])->name('sorteos.index');
Route::get('/sorteos/{sorteo}', [SorteoPublicoController::class, 'show'])->name('sorteos.show');
Route::post('/sorteos/{sorteo}/registrar', [SorteoPublicoController::class, 'store'])->name('sorteos.registrar')->middleware('throttle:5,1');
Route::get('/ganadores', [GanadoresPublicoController::class, 'index'])->name('ganadores');
Route::get('/mi-participacion', [MiParticipacionController::class, 'index'])->name('mi-participacion');

Route::get('/dashboard', function () {
    return Redirect::route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
