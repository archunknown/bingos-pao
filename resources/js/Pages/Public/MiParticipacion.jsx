import PublicLayout from '@/Layouts/PublicLayout';
import { router, useForm } from '@inertiajs/react';

/* Estado visible al participante — mapea estado interno a etiqueta + estilo */
function estadoDisplay(participante) {
    // Si el sorteo ya cerró y el participante estaba confirmado → FINALIZADO
    if (participante.sorteo_estado === 'cerrado' && participante.estado === 'confirmado') {
        return { label: 'Finalizado', cls: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
    switch (participante.estado) {
        case 'confirmado':
            return { label: 'Confirmado', cls: 'bg-green-500/20 text-green-300 border-green-500/30' };
        case 'pendiente':
            return { label: 'Pendiente',  cls: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
        default:
            return { label: 'Finalizado', cls: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
}

export default function MiParticipacion({ resultados, busqueda }) {
    const { data, setData, post, processing, errors } = useForm({ whatsapp: busqueda ?? '' });

    function submit(e) {
        e.preventDefault();
        post('/mi-participacion/buscar');
    }

    const buscado = busqueda !== '' && busqueda != null;

    return (
        <PublicLayout>
            <div className="mx-auto max-w-2xl px-4 py-12">
                <div className="mb-8 text-center">
                    <h1 className="font-[BebasNeue,sans-serif] text-4xl tracking-wide text-white">
                        Mi participación
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Ingresa tu número de WhatsApp para consultar el estado de tus registros.
                    </p>
                </div>

                {/* Buscador */}
                <form onSubmit={submit} noValidate className="flex gap-2">
                    <div className="flex-1">
                        <input
                            type="tel"
                            value={data.whatsapp}
                            onChange={(e) => setData('whatsapp', e.target.value)}
                            placeholder="+51 999 999 999"
                            maxLength={30}
                            className={[
                                'w-full rounded-xl border bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:ring-2 focus:ring-pink-500',
                                errors.whatsapp ? 'border-red-500' : 'border-slate-600',
                            ].join(' ')}
                        />
                        {errors.whatsapp && (
                            <p className="mt-1 text-xs text-red-400">{errors.whatsapp}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-700 disabled:opacity-50"
                    >
                        {processing ? 'Buscando…' : 'Buscar'}
                    </button>
                </form>

                {/* Resultados */}
                {buscado && (
                    <div className="mt-8">
                        {resultados.length === 0 ? (
                            <EmptyState whatsapp={busqueda} />
                        ) : (
                            <div className="space-y-3">
                                <p className="text-xs text-slate-500">
                                    {resultados.length} registro{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''} para <span className="text-slate-300">{busqueda}</span>
                                </p>
                                {resultados.map((p) => (
                                    <ResultadoCard key={p.id} participante={p} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

/* ── Tarjeta de resultado ── */
function ResultadoCard({ participante }) {
    const { label, cls } = estadoDisplay(participante);

    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-800 px-5 py-4">
            <div className="min-w-0">
                {/* Número de registro */}
                <p className="font-mono text-xs text-slate-500">
                    {participante.numero_registro ?? 'Sin N° asignado'}
                </p>

                {/* Nombre */}
                <p className="truncate font-medium text-white">
                    {participante.nombres} {participante.apellidos}
                </p>

                {/* Sorteo */}
                <p className="mt-0.5 truncate text-sm text-slate-400">
                    {participante.sorteo_nombre ?? '—'}
                </p>

                {/* Fecha del sorteo */}
                {participante.sorteo_fecha && (
                    <p className="text-xs text-slate-500">
                        {new Date(participante.sorteo_fecha).toLocaleString('es-PE', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                        })}
                    </p>
                )}
            </div>

            {/* Badge de estado */}
            <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
                {label}
            </span>
        </div>
    );
}

/* ── Estado vacío ── */
function EmptyState({ whatsapp }) {
    return (
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-12 text-center">
            <p className="text-3xl">🔍</p>
            <p className="mt-3 font-medium text-white">Sin resultados</p>
            <p className="mt-1 text-sm text-slate-400">
                No encontramos registros para el número{' '}
                <span className="text-slate-300">{whatsapp}</span>.
            </p>
            <p className="mt-3 text-xs text-slate-500">
                Verifica que sea el mismo número con el que te registraste, incluyendo el código de país.
            </p>
            <button
                type="button"
                onClick={() => router.visit('/sorteos')}
                className="mt-5 rounded-lg bg-pink-600 px-5 py-2 text-sm font-semibold text-white hover:bg-pink-700"
            >
                Ver sorteos activos
            </button>
        </div>
    );
}
