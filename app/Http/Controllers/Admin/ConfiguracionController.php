<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ConfiguracionController extends Controller
{
    private const TEXTO = [
        'nombre_negocio',
        'titular_pago',
        'whatsapp_contacto',
        'alerta_seguridad_texto',
        'url_facebook',
        'url_instagram',
        'url_tiktok',
        'terminos_condiciones',
    ];

    private const ARCHIVOS = [
        'logo'    => 'logo_path',
        'qr_yape' => 'qr_yape_path',
        'qr_plin' => 'qr_plin_path',
    ];

    public function index(): Response
    {
        $config = [];

        foreach (self::TEXTO as $clave) {
            $config[$clave] = Configuracion::get($clave) ?? '';
        }

        foreach (self::ARCHIVOS as $clave_path) {
            $path = Configuracion::get($clave_path);
            $config[$clave_path] = $path ? Storage::url($path) : null;
        }

        return Inertia::render('Admin/Configuracion/Index', compact('config'));
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre_negocio'        => ['nullable', 'string', 'max:200'],
            'titular_pago'          => ['nullable', 'string', 'max:200'],
            'whatsapp_contacto'     => ['nullable', 'string', 'max:20'],
            'alerta_seguridad_texto'=> ['nullable', 'string', 'max:500'],
            'url_facebook'          => ['nullable', 'url', 'max:500'],
            'url_instagram'         => ['nullable', 'url', 'max:500'],
            'url_tiktok'            => ['nullable', 'url', 'max:500'],
            'terminos_condiciones'  => ['nullable', 'string'],
            'logo'                  => ['nullable', 'image', 'max:5120'],
            'qr_yape'               => ['nullable', 'image', 'max:5120'],
            'qr_plin'               => ['nullable', 'image', 'max:5120'],
        ]);

        foreach (self::TEXTO as $clave) {
            Configuracion::set($clave, $request->input($clave, ''));
        }

        foreach (self::ARCHIVOS as $campo => $clave_path) {
            if ($request->hasFile($campo)) {
                // Eliminar archivo anterior si existe
                $anterior = Configuracion::get($clave_path);
                if ($anterior) {
                    Storage::delete($anterior);
                }

                $path = $request->file($campo)->store("configuracion", 'public');
                Configuracion::set($clave_path, $path);
            }
        }

        return back()->with('success', 'Configuración guardada correctamente.');
    }
}
