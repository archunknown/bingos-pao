<?php

namespace Database\Seeders;

use App\Models\Ganador;
use App\Models\Sorteo;
use Illuminate\Database\Seeder;

class GanadorSeeder extends Seeder
{
    public function run(): void
    {
        $sorteosCerrados = Sorteo::where('estado', 'cerrado')->with(['premios', 'participantes'])->get();

        foreach ($sorteosCerrados as $sorteo) {
            $confirmados = $sorteo->participantes
                ->where('estado', 'confirmado')
                ->shuffle();

            $usados = collect();

            foreach ($sorteo->premios as $premio) {
                $ganadores = $confirmados
                    ->whereNotIn('id', $usados->all())
                    ->take($premio->cantidad);

                foreach ($ganadores as $participante) {
                    Ganador::create([
                        'sorteo_id'       => $sorteo->id,
                        'participante_id' => $participante->id,
                        'premio_id'       => $premio->id,
                        'publicado'       => (bool) rand(0, 1),
                    ]);

                    $usados->push($participante->id);
                }
            }
        }
    }
}
