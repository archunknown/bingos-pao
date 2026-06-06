<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    protected $table = 'configuracion';
    protected $primaryKey = 'clave';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'clave',
        'valor',
    ];

    protected $casts = [
        'updated_at' => 'datetime',
    ];

    public static function get(string $clave): ?string
    {
        return static::find($clave)?->valor;
    }

    public static function set(string $clave, string $valor): void
    {
        static::updateOrCreate(['clave' => $clave], ['valor' => $valor]);
    }
}
