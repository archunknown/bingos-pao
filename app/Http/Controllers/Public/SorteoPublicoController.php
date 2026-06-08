<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use App\Models\Sorteo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SorteoPublicoController extends Controller
{
    private const CONFIG_CLAVES = [
        'qr_yape_path',
        'qr_plin_path',
        'titular_pago',
        'whatsapp_contacto',
        'terminos_condiciones',
    ];

    public function index(): RedirectResponse
    {
        $sorteo = Sorteo::activos()->orderBy('fecha_sorteo')->first();
        return $sorteo
            ? redirect()->route('sorteos.show', $sorteo)
            : redirect()->route('landing');
    }

    public function show(Sorteo $sorteo): Response
    {
        abort_if($sorteo->estado !== 'activo', 404);

        $config = [];
        foreach (self::CONFIG_CLAVES as $clave) {
            $config[$clave] = Configuracion::get($clave) ?? '';
        }

        // Convertir rutas a URLs públicas
        foreach (['qr_yape_path', 'qr_plin_path'] as $campo) {
            if ($config[$campo]) {
                $config[$campo] = Storage::url($config[$campo]);
            }
        }

        return Inertia::render('Public/Sorteo', [
            'sorteo' => $sorteo->load([
                'premios' => fn ($q) => $q->where('visible', true)->orderBy('orden'),
            ]),
            'config' => $config,
        ]);
    }

    public function store(Request $request, Sorteo $sorteo): RedirectResponse
    {
        abort_if($sorteo->estado !== 'activo', 403);

        // Honeypot: si el campo "website" viene relleno es un bot.
        // Respuesta falsa de éxito para no revelar que fue detectado.
        if ($request->filled('website')) {
            return redirect()->route('sorteos.show', $sorteo)
                ->with('success', '¡Registro recibido! Tu participación está pendiente de confirmación. Te avisaremos por WhatsApp.');
        }

        $data = $request->validate([
            'nombres'     => ['required', 'string', 'max:100'],
            'apellidos'   => ['required', 'string', 'max:100'],
            'whatsapp'    => ['required', 'string', 'regex:/^\d{9}$/'],
            'comprobante' => ['required', 'image', 'max:5120'],
            'terminos'    => ['accepted'],
        ], [
            'whatsapp.regex'       => 'El WhatsApp debe tener exactamente 9 dígitos numéricos.',
            'terminos.accepted'    => 'Debes aceptar los términos y condiciones.',
            'comprobante.required' => 'Debes subir una foto del comprobante de pago.',
            'comprobante.image'    => 'El comprobante debe ser una imagen (JPG, PNG, etc.).',
            'comprobante.max'      => 'La imagen no puede pesar más de 5 MB.',
        ]);

        // Evitar duplicados: mismo WhatsApp activo en el mismo sorteo.
        $duplicado = $sorteo->participantes()
            ->where('whatsapp', $data['whatsapp'])
            ->whereIn('estado', ['pendiente', 'confirmado'])
            ->exists();

        if ($duplicado) {
            return back()->withErrors([
                'whatsapp' => 'Este número ya tiene un registro activo para este sorteo.',
            ])->withInput();
        }

        $path = $request->file('comprobante')->store('comprobantes', 'public');

        $sorteo->participantes()->create([
            'nombres'          => $data['nombres'],
            'apellidos'        => $data['apellidos'],
            'whatsapp'         => $data['whatsapp'],
            'comprobante_path' => $path,
            'estado'           => 'pendiente',
        ]);

        return redirect()->route('sorteos.show', $sorteo)
            ->with('success', '¡Registro recibido! Tu participación está pendiente de confirmación. Te avisaremos por WhatsApp.');
    }
}
