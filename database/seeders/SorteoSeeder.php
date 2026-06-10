<?php

namespace Database\Seeders;

use App\Models\Premio;
use App\Models\Sorteo;
use Illuminate\Database\Seeder;

class SorteoSeeder extends Seeder
{
    public function run(): void
    {
        $sorteos = [
            [
                'sorteo' => [
                    'nombre'               => 'Gran Sorteo Navideño 2025',
                    'tipo'                 => 'sorteo',
                    'fecha_sorteo'         => now()->subDays(20),
                    'precio_participacion' => 10.00,
                    'descripcion'          => 'El gran sorteo de fin de año con premios increíbles para toda la familia.',
                    'estado'               => 'cerrado',
                ],
                'premios' => [
                    ['nombre' => 'Premio Mayor',    'cantidad' => 1, 'monto' => 500.00, 'orden' => 1],
                    ['nombre' => 'Segundo Premio',  'cantidad' => 2, 'monto' => 200.00, 'orden' => 2],
                    ['nombre' => 'Premio Consuelo', 'cantidad' => 5, 'monto' => null, 'descripcion_premio' => 'Canasta navideña', 'orden' => 3],
                ],
            ],
            [
                'sorteo' => [
                    'nombre'               => 'Sorteo Especial Año Nuevo',
                    'tipo'                 => 'especial',
                    'fecha_sorteo'         => now()->subDays(5),
                    'precio_participacion' => 15.00,
                    'descripcion'          => 'Sorteo especial para recibir el nuevo año con grandes premios en efectivo.',
                    'estado'               => 'cerrado',
                ],
                'premios' => [
                    ['nombre' => 'Premio Mayor',   'cantidad' => 1, 'monto' => 300.00, 'orden' => 1],
                    ['nombre' => 'Premio Segundo', 'cantidad' => 3, 'monto' => 100.00, 'orden' => 2],
                ],
            ],
            [
                'sorteo' => [
                    'nombre'               => 'Pozito Semanal #12',
                    'tipo'                 => 'pozito',
                    'fecha_sorteo'         => now()->addDays(6),
                    'precio_participacion' => 5.00,
                    'descripcion'          => 'Nuestro pozito semanal, ¡participa y gana cada semana!',
                    'estado'               => 'activo',
                ],
                'premios' => [
                    ['nombre' => 'Premio Mayor',    'cantidad' => 1, 'monto' => 400.00, 'orden' => 1],
                    ['nombre' => 'Segundo Premio',  'cantidad' => 2, 'monto' => 150.00, 'orden' => 2],
                    ['nombre' => 'Premio Consuelo', 'cantidad' => 5, 'monto' => null, 'descripcion_premio' => 'Billeteras', 'orden' => 3],
                ],
            ],
            [
                'sorteo' => [
                    'nombre'               => 'Sorteo Aniversario Edición Oro',
                    'tipo'                 => 'aniversario',
                    'fecha_sorteo'         => now()->addDays(30),
                    'precio_participacion' => 20.00,
                    'descripcion'          => 'Celebramos nuestro aniversario con el sorteo más grande del año.',
                    'estado'               => 'borrador',
                ],
                'premios' => [
                    ['nombre' => 'Gran Premio',      'cantidad' => 1, 'monto' => 1000.00, 'orden' => 1],
                    ['nombre' => 'Segundo Premio',   'cantidad' => 2, 'monto' => 300.00,  'orden' => 2],
                    ['nombre' => 'Tercer Premio',    'cantidad' => 3, 'monto' => 100.00,  'orden' => 3],
                ],
            ],
        ];

        foreach ($sorteos as $item) {
            $sorteo = Sorteo::create($item['sorteo']);

            foreach ($item['premios'] as $premio) {
                Premio::create(array_merge(['sorteo_id' => $sorteo->id], $premio));
            }
        }
    }
}
