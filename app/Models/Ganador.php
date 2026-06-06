<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ganador extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'sorteo_id',
        'participante_id',
        'premio_id',
        'publicado',
    ];

    protected $casts = [
        'publicado' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function sorteo(): BelongsTo
    {
        return $this->belongsTo(Sorteo::class);
    }

    public function participante(): BelongsTo
    {
        return $this->belongsTo(Participante::class);
    }

    public function premio(): BelongsTo
    {
        return $this->belongsTo(Premio::class);
    }
}
