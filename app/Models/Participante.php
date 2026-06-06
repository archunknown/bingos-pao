<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Participante extends Model
{
    protected $fillable = [
        'sorteo_id',
        'nombres',
        'apellidos',
        'whatsapp',
        'numero_registro',
        'comprobante_path',
        'estado',
        'nota_interna',
    ];

    protected $casts = [
        'estado' => 'string',
    ];

    public function sorteo(): BelongsTo
    {
        return $this->belongsTo(Sorteo::class);
    }

    public function ganadores(): HasMany
    {
        return $this->hasMany(Ganador::class);
    }

    public function generarNumeroRegistro(): string
    {
        $ultimo = static::where('sorteo_id', $this->sorteo_id)
            ->whereNotNull('numero_registro')
            ->orderByDesc('numero_registro')
            ->value('numero_registro');

        $siguiente = $ultimo ? ((int) ltrim($ultimo, '#0') + 1) : 1;

        $numero = '#' . str_pad($siguiente, 4, '0', STR_PAD_LEFT);

        $this->update(['numero_registro' => $numero]);

        return $numero;
    }
}
