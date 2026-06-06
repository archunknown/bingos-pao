<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use App\Models\Ganador;
use App\Models\Sorteo;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    private const CONFIG_CLAVES = [
        'nombre_negocio',
        'url_stream_live',
        'url_stream_grabado',
        'estado_stream',
        'mensaje_destacado',
        'titular_pago',
    ];

    public function index(): Response
    {
        $sorteos_activos = Sorteo::activos()
            ->with(['premios' => fn ($q) => $q->where('visible', true)->orderBy('orden')])
            ->orderBy('fecha_sorteo')
            ->get();

        $ganadores_recientes = Ganador::where('publicado', true)
            ->with([
                'participante:id,nombres,apellidos',
                'premio:id,nombre',
                'sorteo:id,nombre',
            ])
            ->latest('created_at')
            ->limit(5)
            ->get();

        $config = [];
        foreach (self::CONFIG_CLAVES as $clave) {
            $config[$clave] = Configuracion::get($clave) ?? '';
        }

        $fechas_sorteos = $sorteos_activos
            ->pluck('fecha_sorteo')
            ->map(fn ($f) => $f->toIso8601String())
            ->values();

        return Inertia::render('Public/Landing', compact(
            'sorteos_activos',
            'ganadores_recientes',
            'config',
            'fechas_sorteos',
        ));
    }
}
