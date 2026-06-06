<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Participante;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MiParticipacionController extends Controller
{
    public function index(Request $request): Response
    {
        $whatsapp  = trim($request->query('whatsapp', ''));
        $resultados = [];

        if ($whatsapp !== '') {
            $digits = preg_replace('/\D/', '', $whatsapp);

            $resultados = Participante::with('sorteo:id,nombre,fecha_sorteo,estado')
                ->select('id', 'sorteo_id', 'nombres', 'apellidos', 'numero_registro', 'estado', 'nota_interna', 'created_at')
                ->where(function ($q) use ($whatsapp, $digits) {
                    $q->where('whatsapp', $whatsapp)
                      ->orWhere(fn ($q2) => $q2->whereRaw("REGEXP_REPLACE(whatsapp, '[^0-9]', '') = ?", [$digits]));
                })
                ->latest()
                ->get()
                ->map(fn ($p) => [
                    'id'               => $p->id,
                    'numero_registro'  => $p->numero_registro,
                    'nombres'          => $p->nombres,
                    'apellidos'        => $p->apellidos,
                    'estado'           => $p->estado,
                    'nota_interna'     => $p->estado === 'rechazado' ? $p->nota_interna : null,
                    'created_at'       => $p->created_at,
                    'sorteo_nombre'    => $p->sorteo?->nombre,
                    'sorteo_fecha'     => $p->sorteo?->fecha_sorteo,
                    'sorteo_estado'    => $p->sorteo?->estado,
                ]);
        }

        return Inertia::render('Public/MiParticipacion', [
            'resultados' => $resultados,
            'busqueda'   => $whatsapp,
        ]);
    }
}
