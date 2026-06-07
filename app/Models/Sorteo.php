<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int    $id
 * @property string $nombre
 * @property string $tipo
 * @property \Illuminate\Support\Carbon $fecha_sorteo
 * @property string $precio_participacion
 * @property string|null $descripcion
 * @property string $estado
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Sorteo extends Model
{
    protected $fillable = [
        'nombre',
        'tipo',
        'fecha_sorteo',
        'precio_participacion',
        'descripcion',
        'estado',
    ];

    protected $casts = [
        'fecha_sorteo' => 'datetime',
        'precio_participacion' => 'decimal:2',
    ];

    public function premios(): HasMany
    {
        return $this->hasMany(Premio::class);
    }

    public function participantes(): HasMany
    {
        return $this->hasMany(Participante::class);
    }

    public function ganadores(): HasMany
    {
        return $this->hasMany(Ganador::class);
    }

    public function scopeActivos(Builder $query): Builder
    {
        return $query->where('estado', 'activo');
    }
}
