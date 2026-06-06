<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Participante;
use App\Models\Sorteo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ParticipanteController extends Controller
{
    public function index(Request $request): Response
    {
        $sorteos = Sorteo::orderByDesc('created_at')->get(['id', 'nombre']);

        $query = Participante::with('sorteo:id,nombre')->latest();

        if ($request->filled('sorteo_id')) {
            $query->where('sorteo_id', $request->sorteo_id);
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        return Inertia::render('Admin/Participantes/Index', [
            'sorteos'       => $sorteos,
            'participantes' => $query->get(),
            'filtros'       => $request->only('sorteo_id', 'estado'),
        ]);
    }

    public function show(Participante $participante): Response
    {
        return Inertia::render('Admin/Participantes/Show', [
            'participante'    => $participante->load('sorteo:id,nombre'),
            'comprobante_url' => Storage::url($participante->comprobante_path),
        ]);
    }

    public function confirmar(Participante $participante): RedirectResponse
    {
        if ($participante->estado !== 'pendiente') {
            return back()->with('error', 'Solo se pueden confirmar participantes pendientes.');
        }

        $participante->estado = 'confirmado';
        $participante->save();
        $participante->generarNumeroRegistro();

        return redirect()->route('admin.participantes.index')
            ->with('success', "Participante confirmado con número {$participante->numero_registro}.");
    }

    public function rechazar(Request $request, Participante $participante): RedirectResponse
    {
        $request->validate([
            'nota_interna' => ['required', 'string', 'max:1000'],
        ]);

        if ($participante->estado !== 'pendiente') {
            return back()->with('error', 'Solo se pueden rechazar participantes pendientes.');
        }

        $participante->update([
            'estado'       => 'rechazado',
            'nota_interna' => $request->nota_interna,
        ]);

        return redirect()->route('admin.participantes.index')
            ->with('success', 'Participante rechazado.');
    }
}
