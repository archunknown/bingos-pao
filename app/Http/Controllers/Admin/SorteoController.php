<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSorteoRequest;
use App\Http\Requests\Admin\UpdateSorteoRequest;
use App\Models\Sorteo;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SorteoController extends Controller
{
    public function index(): Response
    {
        $sorteos = Sorteo::withCount('participantes')
            ->latest()
            ->get();

        return Inertia::render('Admin/Sorteos/Index', compact('sorteos'));
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Sorteos/Form');
    }

    public function store(StoreSorteoRequest $request): RedirectResponse
    {
        Sorteo::create($request->validated());

        return redirect()->route('admin.sorteos.index')
            ->with('success', 'Sorteo creado correctamente.');
    }

    public function edit(Sorteo $sorteo): Response
    {
        return Inertia::render('Admin/Sorteos/Form', compact('sorteo'));
    }

    public function update(UpdateSorteoRequest $request, Sorteo $sorteo): RedirectResponse
    {
        $sorteo->update($request->validated());

        return redirect()->route('admin.sorteos.index')
            ->with('success', 'Sorteo actualizado correctamente.');
    }

    public function destroy(Sorteo $sorteo): RedirectResponse
    {
        if ($sorteo->estado !== 'borrador' && $sorteo->participantes()->exists()) {
            return back()->with('error', 'No se puede eliminar un sorteo con participantes registrados.');
        }

        $sorteo->delete();

        return redirect()->route('admin.sorteos.index')
            ->with('success', 'Sorteo eliminado.');
    }

    public function toggleEstado(Sorteo $sorteo): RedirectResponse
    {
        $transiciones = [
            'borrador' => 'activo',
            'activo'   => 'cerrado',
        ];

        if (! isset($transiciones[$sorteo->estado])) {
            return back()->with('error', 'Este sorteo ya está cerrado y no puede cambiar de estado.');
        }

        $sorteo->update(['estado' => $transiciones[$sorteo->estado]]);

        return back()->with('success', 'Estado actualizado a "' . $sorteo->estado . '".');
    }
}
