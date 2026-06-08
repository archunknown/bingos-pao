<?php

namespace App\Console\Commands;

use App\Models\Participante;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class PurgarRegistrosSpam extends Command
{
    protected $signature   = 'spam:purgar';
    protected $description = 'Elimina registros pendientes antiguos y sus archivos para evitar inflación de almacenamiento.';

    public function handle(): int
    {
        // Pendientes sin revisar después de 48 horas = sin intención real de seguimiento.
        $antiguos = Participante::where('estado', 'pendiente')
            ->where('created_at', '<', now()->subHours(48))
            ->get();

        $eliminados = 0;

        foreach ($antiguos as $participante) {
            if ($participante->comprobante_path) {
                Storage::disk('public')->delete($participante->comprobante_path);
            }
            $participante->delete();
            $eliminados++;
        }

        // Rechazados con más de 7 días: el admin ya los procesó, no sirven guardarlos.
        $rechazados = Participante::where('estado', 'rechazado')
            ->where('updated_at', '<', now()->subDays(7))
            ->get();

        foreach ($rechazados as $participante) {
            if ($participante->comprobante_path) {
                Storage::disk('public')->delete($participante->comprobante_path);
            }
            $participante->delete();
            $eliminados++;
        }

        $this->info("Purga completada: {$eliminados} registro(s) eliminado(s).");

        return self::SUCCESS;
    }
}
