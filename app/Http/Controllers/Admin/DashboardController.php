<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Participante;
use App\Models\Sorteo;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'sorteos_activos' => Sorteo::activos()->count(),

            'participantes_hoy' => Participante::whereDate('created_at', today())
                ->whereIn('estado', ['pendiente', 'confirmado'])
                ->count(),

            'comprobantes_pendientes' => Participante::where('estado', 'pendiente')->count(),

            'pozo_acumulado' => Sorteo::activos()
                ->withCount(['participantes as confirmados' => fn ($q) => $q->where('estado', 'confirmado')])
                ->get()
                ->sum(fn ($s) => $s->precio_participacion * $s->confirmados),

            'actividad_reciente' => Participante::with('sorteo:id,nombre')
                ->select('id', 'sorteo_id', 'nombres', 'apellidos', 'estado', 'created_at')
                ->latest()
                ->limit(8)
                ->get(),
        ]);
    }
}
