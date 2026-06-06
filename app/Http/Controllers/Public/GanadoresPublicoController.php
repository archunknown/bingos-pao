<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Ganador;
use App\Models\Sorteo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GanadoresPublicoController extends Controller
{
    public function index(Request $request): Response
    {
        $sorteos = Sorteo::whereHas('ganadores', fn ($q) => $q->where('publicado', true))
            ->orderByDesc('fecha_sorteo')
            ->get(['id', 'nombre']);

        $query = Ganador::where('publicado', true)
            ->with([
                'participante:id,nombres,apellidos',
                'premio:id,nombre,monto,descripcion_premio',
                'sorteo:id,nombre,tipo,fecha_sorteo',
            ]);

        if ($request->filled('sorteo_id')) {
            $query->where('sorteo_id', $request->integer('sorteo_id'));
        }

        $ganadores = $query->latest('created_at')->get()->map(fn ($g) => [
            'id'           => $g->id,
            'nombre'       => self::ofuscar($g->participante?->nombres, $g->participante?->apellidos),
            'inicial'      => mb_strtoupper(mb_substr($g->participante?->nombres ?? '?', 0, 1)),
            'premio'       => $g->premio?->nombre,
            'monto'        => $g->premio?->monto,
            'descripcion'  => $g->premio?->descripcion_premio,
            'sorteo'       => $g->sorteo?->nombre,
            'tipo_sorteo'  => $g->sorteo?->tipo,
            'fecha_sorteo' => $g->sorteo?->fecha_sorteo,
        ]);

        return Inertia::render('Public/Ganadores', [
            'ganadores'  => $ganadores,
            'sorteos'    => $sorteos,
            'filtro_sorteo_id' => $request->integer('sorteo_id') ?: null,
        ]);
    }

    private static function ofuscar(?string $nombres, ?string $apellidos): string
    {
        $primerNombre   = explode(' ', trim($nombres ?? '?'))[0];
        $primeraLetraAp = mb_strtoupper(mb_substr(trim($apellidos ?? ''), 0, 1));
        $sufijo         = $primeraLetraAp ? "{$primeraLetraAp}. ****" : '****';

        return "{$primerNombre} {$sufijo}";
    }
}
