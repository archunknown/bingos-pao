<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TransmisionController extends Controller
{
    private const CLAVES = [
        'url_stream_live',
        'url_stream_grabado',
        'estado_stream',
        'mensaje_destacado',
    ];

    public function index(): Response
    {
        $config = [];
        foreach (self::CLAVES as $clave) {
            $config[$clave] = Configuracion::get($clave) ?? '';
        }

        return Inertia::render('Admin/Transmision/Index', compact('config'));
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'url_stream_live'    => ['nullable', 'url', 'max:500'],
            'url_stream_grabado' => ['nullable', 'url', 'max:500'],
            'estado_stream'      => ['required', Rule::in(['en_vivo', 'sin_transmision', 'proximamente'])],
            'mensaje_destacado'  => ['nullable', 'string', 'max:500'],
        ]);

        foreach ($data as $clave => $valor) {
            Configuracion::set($clave, $valor ?? '');
        }

        return back()->with('success', 'Configuración de transmisión guardada.');
    }
}
