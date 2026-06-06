import PublicLayout from '@/Layouts/PublicLayout';
import { router, useForm } from '@inertiajs/react';

function estadoDisplay(participante) {
    if (participante.sorteo_estado === 'cerrado' && participante.estado === 'confirmado') {
        return { label: 'FINALIZADO', cls: 'bg-surface2 text-muted border-muted/20' };
    }
    switch (participante.estado) {
        case 'confirmado':
            return { label: 'CONFIRMADO', cls: 'bg-success/10 text-success border-success/30' };
        case 'pendiente':
            return { label: 'PENDIENTE',  cls: 'bg-gold/10 text-gold border-gold/30' };
        default:
            return { label: 'FINALIZADO', cls: 'bg-surface2 text-muted border-muted/20' };
    }
}

export default function MiParticipacion({ resultados, busqueda }) {
    const { data, setData, post, processing, errors } = useForm({
        whatsapp: busqueda ?? '',
    });

    function submit(e) {
        e.preventDefault();
        post('/mi-participacion/buscar');
    }

    const buscado = busqueda !== '' && busqueda != null;

    return (
        <PublicLayout>
            <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="border-l-4 border-gold pl-4 font-display text-5xl text-cream">
                        MI PARTICIPACIÓN
                    </h1>
                    <p className="mt-3 pl-5 text-sm text-muted">
                        Ingresa tu número de WhatsApp para consultar el estado de tus registros.
                    </p>
                </div>

                {/* Buscador */}
                <form onSubmit={submit} noValidate>
                    <div className="flex">
                        <input
                            type="tel"
                            value={data.whatsapp}
                            onChange={(e) => setData('whatsapp', e.target.value)}
                            placeholder="+51 999 999 999"
                            maxLength={30}
                            className={[
                                'flex-1 border bg-surface2 px-4 py-3 text-sm text-cream placeholder-muted outline-none transition-colors',
                                errors.whatsapp ? 'border-danger' : 'border-gold/20 focus:border-gold',
                            ].join(' ')}
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-gold px-6 py-3 text-sm font-bold uppercase tracking-widest text-bg transition-colors hover:bg-gold-light disabled:opacity-50"
                        >
                            {processing ? 'Buscando…' : 'Buscar'}
                        </button>
                    </div>
                    {errors.whatsapp && (
                        <p className="mt-1.5 text-xs text-danger">{errors.whatsapp}</p>
                    )}
                </form>

                {/* Resultados */}
                {buscado && (
                    <div className="mt-8">
                        {resultados.length === 0 ? (
                            <EmptyState whatsapp={busqueda} />
                        ) : (
                            <div className="space-y-3">
                                <p className="text-xs text-muted">
                                    {resultados.length}{' '}
                                    registro{resultados.length !== 1 ? 's' : ''}{' '}
                                    encontrado{resultados.length !== 1 ? 's' : ''}{' '}
                                    para{' '}
                                    <span className="text-content">{busqueda}</span>
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
        <div className="border border-gold/20 bg-surface px-5 py-4 transition-colors hover:border-gold/40">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    {/* Número de registro */}
                    <p className="font-display text-3xl leading-none text-gold">
                        {participante.numero_registro ?? '—'}
                    </p>

                    {/* Nombre participante */}
                    <p className="mt-1 text-xs text-muted">
                        {participante.nombres} {participante.apellidos}
                    </p>

                    {/* Nombre sorteo */}
                    <p className="mt-2 truncate text-sm font-semibold text-cream">
                        {participante.sorteo_nombre ?? '—'}
                    </p>

                    {/* Fecha */}
                    {participante.sorteo_fecha && (
                        <p className="mt-0.5 text-xs text-muted">
                            {new Date(participante.sorteo_fecha).toLocaleString('es-PE', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            })}
                        </p>
                    )}
                </div>

                {/* Badge de estado */}
                <span className={`shrink-0 border px-3 py-1 text-xs font-bold uppercase tracking-wider ${cls}`}>
                    {label}
                </span>
            </div>
        </div>
    );
}

/* ── Estado vacío ── */
function EmptyState({ whatsapp }) {
    return (
        <div className="border border-gold/10 bg-surface px-6 py-14 text-center">
            <p className="font-display text-6xl text-gold/20">🔍</p>
            <p className="mt-4 text-sm font-semibold text-muted">Sin resultados</p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
                No encontramos registros para{' '}
                <span className="text-content">{whatsapp}</span>.
                Verifica que sea el mismo número con el que te registraste.
            </p>
            <button
                type="button"
                onClick={() => router.visit('/sorteos')}
                className="mt-6 border border-gold/50 px-6 py-3 text-sm font-bold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
            >
                Ver sorteos activos
            </button>
        </div>
    );
}
