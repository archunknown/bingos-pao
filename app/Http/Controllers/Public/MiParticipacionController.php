<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Participante;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MiParticipacionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/MiParticipacion', [
            'resultados' => [],
            'busqueda'   => '',
        ]);
    }

    public function buscar(Request $request): Response
    {
        $request->validate([
            'whatsapp' => ['required', 'string', 'max:30'],
        ]);

        $whatsapp = trim($request->whatsapp);

        // Normaliza a solo dígitos para comparar independiente de espacios/guiones/+51
        $digits = preg_replace('/\D/', '', $whatsapp);

        $resultados = Participante::with('sorteo:id,nombre,fecha_sorteo,estado')
            ->select('id', 'sorteo_id', 'nombres', 'apellidos', 'numero_registro', 'estado', 'created_at')
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
                'created_at'       => $p->created_at,
                'sorteo_nombre'    => $p->sorteo?->nombre,
                'sorteo_fecha'     => $p->sorteo?->fecha_sorteo,
                'sorteo_estado'    => $p->sorteo?->estado,
            ]);

        return Inertia::render('Public/MiParticipacion', [
            'resultados' => $resultados,
            'busqueda'   => $whatsapp,
        ]);
    }
}
