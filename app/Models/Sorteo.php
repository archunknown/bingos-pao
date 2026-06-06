<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
