<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Premio extends Model
{
    protected $fillable = [
        'sorteo_id',
        'nombre',
        'cantidad',
        'monto',
        'descripcion_premio',
        'visible',
        'orden',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'visible' => 'boolean',
        'cantidad' => 'integer',
        'orden' => 'integer',
    ];

    public function sorteo(): BelongsTo
    {
        return $this->belongsTo(Sorteo::class);
    }

    public function ganadores(): HasMany
    {
        return $this->hasMany(Ganador::class);
    }
}
