<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE sorteos MODIFY tipo ENUM('bingo', 'sorteo', 'pozito', 'especial', 'aniversario') NOT NULL");
        DB::statement("UPDATE sorteos SET tipo = 'sorteo' WHERE tipo = 'bingo'");
        DB::statement("ALTER TABLE sorteos MODIFY tipo ENUM('sorteo', 'pozito', 'especial', 'aniversario') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE sorteos MODIFY tipo ENUM('sorteo', 'bingo', 'pozito', 'especial', 'aniversario') NOT NULL");
        DB::statement("UPDATE sorteos SET tipo = 'bingo' WHERE tipo = 'sorteo'");
        DB::statement("ALTER TABLE sorteos MODIFY tipo ENUM('bingo', 'pozito', 'especial', 'aniversario') NOT NULL");
    }
};
