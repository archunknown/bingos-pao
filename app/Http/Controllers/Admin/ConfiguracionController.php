<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\ImageManager;
use Inertia\Inertia;
use Inertia\Response;

class ConfiguracionController extends Controller
{
    private const TEXTO = [
        'nombre_negocio',
        'titular_pago',
        'whatsapp_contacto',
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

        $imagenes = ImageManager::usingDriver(GdDriver::class);

        foreach (self::ARCHIVOS as $campo => $clave_path) {
            if ($request->hasFile($campo)) {
                $anterior = Configuracion::get($clave_path);
                if ($anterior) {
                    Storage::disk('public')->delete($anterior);
                }

                $encoded = $imagenes->decode($request->file($campo)->getPathname())
                    ->scaleDown(1200, 1200)
                    ->encode(new JpegEncoder(quality: 80));

                $path = 'configuracion/' . uniqid() . '.jpg';
                Storage::disk('public')->put($path, (string) $encoded);
                Configuracion::set($clave_path, $path);
            }
        }

        return back()->with('success', 'Configuración guardada correctamente.');
    }
}
