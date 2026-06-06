<?php

namespace App\Http\Middleware;

use App\Models\Configuracion;
use App\Models\Participante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    private static function configPublica(): array
    {
        $textos = ['nombre_negocio', 'titular_pago', 'whatsapp_contacto'];

        $config = [];
        foreach ($textos as $clave) {
            $config[$clave] = Configuracion::get($clave) ?? '';
        }

        $logoPath = Configuracion::get('logo_path');
        $config['logo_url'] = $logoPath ? Storage::url($logoPath) : null;

        return $config;
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'pendientes_count' => $request->user()
                ? Participante::where('estado', 'pendiente')->count()
                : 0,
            'config_publica' => static::configPublica(),
        ];
    }
}
