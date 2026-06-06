<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sorteos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 200);
            $table->enum('tipo', ['bingo', 'pozito', 'especial', 'aniversario']);
            $table->dateTime('fecha_sorteo');
            $table->decimal('precio_participacion', 8, 2);
            $table->text('descripcion')->nullable();
            $table->enum('estado', ['borrador', 'activo', 'cerrado']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sorteos');
    }
};
