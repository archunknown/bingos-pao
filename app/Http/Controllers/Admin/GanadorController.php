<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ganador;
use App\Models\Participante;
use App\Models\Premio;
use App\Models\Sorteo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GanadorController extends Controller
{
    public function index(): Response
    {
        $sorteos = Sorteo::orderByDesc('created_at')->get(['id', 'nombre']);

        $ganadores = Ganador::with([
            'participante:id,nombres,apellidos',
            'premio:id,nombre',
            'sorteo:id,nombre',
        ])
            ->latest('created_at')
            ->get();

        return Inertia::render('Admin/Ganadores/Index', compact('sorteos', 'ganadores'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'sorteo_id'       => ['required', 'exists:sorteos,id'],
            'participante_id' => ['required', 'exists:participantes,id'],
            'premio_id'       => ['required', 'exists:premios,id'],
        ]);

        // El participante debe estar confirmado y pertenecer al sorteo
        $participante = Participante::findOrFail($data['participante_id']);
        if ($participante->estado !== 'confirmado' || $participante->sorteo_id != $data['sorteo_id']) {
            return back()->with('error', 'El participante debe estar confirmado y pertenecer al sorteo seleccionado.');
        }

        // El premio debe pertenecer al sorteo
        $premio = Premio::findOrFail($data['premio_id']);
        if ($premio->sorteo_id != $data['sorteo_id']) {
            return back()->with('error', 'El premio no pertenece al sorteo seleccionado.');
        }

        // El participante no puede ganar dos veces en el mismo sorteo
        $yaGanador = Ganador::where('participante_id', $data['participante_id'])
            ->where('sorteo_id', $data['sorteo_id'])
            ->exists();
        if ($yaGanador) {
            return back()->with('error', 'Este participante ya fue registrado como ganador en este sorteo.');
        }

        Ganador::create($data);

        return back()->with('success', 'Ganador registrado correctamente.');
    }

    public function opciones(Request $request): JsonResponse
    {
        $sorteoId = $request->integer('sorteo_id');

        return response()->json([
            'participantes' => Participante::where('sorteo_id', $sorteoId)
                ->where('estado', 'confirmado')
                ->orderBy('numero_registro')
                ->get(['id', 'nombres', 'apellidos', 'numero_registro']),
            'premios' => Premio::where('sorteo_id', $sorteoId)
                ->orderBy('orden')
                ->get(['id', 'nombre']),
        ]);
    }

    public function togglePublicado(Ganador $ganador): RedirectResponse
    {
        $ganador->update(['publicado' => ! $ganador->publicado]);

        return back()->with('success', $ganador->publicado ? 'Ganador publicado.' : 'Ganador ocultado.');
    }
}
