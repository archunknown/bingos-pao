<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Premio;
use App\Models\Sorteo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PremioController extends Controller
{
    public function index(Sorteo $sorteo): Response
    {
        return Inertia::render('Admin/Premios/Index', [
            'sorteo' => $sorteo->only('id', 'nombre', 'estado'),
            'premios' => $sorteo->premios()->orderBy('orden')->get(),
        ]);
    }

    public function store(Request $request, Sorteo $sorteo): RedirectResponse
    {
        $data = $request->validate([
            'nombre'           => ['required', 'string', 'max:100'],
            'cantidad'         => ['required', 'integer', 'min:1'],
            'monto'            => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'descripcion_premio' => ['nullable', 'string', 'max:200'],
            'visible'          => ['boolean'],
            'orden'            => ['integer', 'min:0'],
        ]);

        $sorteo->premios()->create($data);

        return back()->with('success', 'Premio agregado.');
    }

    public function update(Request $request, Premio $premio): RedirectResponse
    {
        $data = $request->validate([
            'nombre'           => ['required', 'string', 'max:100'],
            'cantidad'         => ['required', 'integer', 'min:1'],
            'monto'            => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'descripcion_premio' => ['nullable', 'string', 'max:200'],
            'visible'          => ['boolean'],
            'orden'            => ['integer', 'min:0'],
        ]);

        $premio->update($data);

        return back()->with('success', 'Premio actualizado.');
    }

    public function destroy(Premio $premio): RedirectResponse
    {
        $premio->delete();

        return back()->with('success', 'Premio eliminado.');
    }
}
