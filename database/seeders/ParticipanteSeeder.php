<?php

namespace Database\Seeders;

use App\Models\Participante;
use App\Models\Sorteo;
use Illuminate\Database\Seeder;

class ParticipanteSeeder extends Seeder
{
    private array $nombres = [
        'Ana', 'Luis', 'Carmen', 'Jorge', 'María', 'Carlos', 'Rosa', 'Juan', 'Elena', 'Pedro',
        'Sofía', 'Miguel', 'Lucía', 'Roberto', 'Patricia', 'Diego', 'Claudia', 'Fernando', 'Gabriela', 'Óscar',
        'Verónica', 'Andrés', 'Natalia', 'Héctor', 'Valeria', 'Raúl', 'Pamela', 'Javier', 'Mónica', 'César',
        'Silvia', 'Marcos', 'Liliana', 'Álvaro', 'Rocío', 'Eduardo', 'Vanessa', 'Hugo', 'Beatriz', 'Rodrigo',
    ];

    private array $apellidos = [
        'García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Torres', 'Flores', 'Ramírez',
        'Cruz', 'Reyes', 'Morales', 'Ortiz', 'Herrera', 'Medina', 'Vargas', 'Castillo', 'Ramos', 'Quispe',
        'Huanca', 'Mamani', 'Ccopa', 'Condori', 'Apaza', 'Cano', 'Espinoza', 'Paredes', 'Chávez', 'Rojas',
    ];

    public function run(): void
    {
        $sorteos = Sorteo::all();

        $config = [
            'cerrado' => ['total' => 30, 'confirmado' => 22, 'rechazado' => 4],
            'activo'  => ['total' => 20, 'confirmado' => 12, 'rechazado' => 2],
            'borrador'=> ['total' => 5,  'confirmado' => 0,  'rechazado' => 0],
        ];

        foreach ($sorteos as $sorteo) {
            $cfg   = $config[$sorteo->estado] ?? $config['borrador'];
            $total = $cfg['total'];
            $nConf = $cfg['confirmado'];
            $nRech = $cfg['rechazado'];

            $estados = array_merge(
                array_fill(0, $nConf, 'confirmado'),
                array_fill(0, $nRech, 'rechazado'),
                array_fill(0, $total - $nConf - $nRech, 'pendiente'),
            );
            shuffle($estados);

            foreach ($estados as $estado) {
                $participante = Participante::create([
                    'sorteo_id'       => $sorteo->id,
                    'nombres'         => $this->nombres[array_rand($this->nombres)],
                    'apellidos'       => $this->apellidos[array_rand($this->apellidos)] . ' ' . $this->apellidos[array_rand($this->apellidos)],
                    'whatsapp'        => '9' . rand(10000000, 99999999),
                    'comprobante_path'=> 'comprobantes/fake_' . uniqid() . '.jpg',
                    'estado'          => $estado,
                    'nota_interna'    => $estado === 'rechazado' ? 'Comprobante ilegible.' : null,
                ]);

                if ($estado === 'confirmado') {
                    $participante->generarNumeroRegistro();
                }
            }
        }
    }
}
