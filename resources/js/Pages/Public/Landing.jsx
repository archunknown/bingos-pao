import PublicLayout from '@/Layouts/PublicLayout';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const TIPO_LABEL = {
    bingo: 'Bingo', pozito: 'Pozito', especial: 'Especial', aniversario: 'Aniversario',
};

const ESTADO_STREAM_LABEL = {
    en_vivo:         'En vivo ahora',
    sin_transmision: 'Sin transmisión activa',
    proximamente:    'Próximamente',
};

export default function Landing({ sorteos_activos, ganadores_recientes, config, proxima_fecha }) {
    return (
        <PublicLayout>
            <HeroSection config={config} proxima_fecha={proxima_fecha} sorteos={sorteos_activos} />
            <StreamSection config={config} />
            {sorteos_activos.length > 0 && <SorteosSection sorteos={sorteos_activos} />}
            {ganadores_recientes.length > 0 && <GanadoresSection ganadores={ganadores_recientes} />}
            <SeguridadBanner config={config} />
        </PublicLayout>
    );
}

/* ── Hero ── */
function HeroSection({ config, proxima_fecha, sorteos }) {
    const countdown = useCountdown(proxima_fecha);
    const nombre = config.nombre_negocio || 'Bingos Pao';

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-pink-950 px-4 py-20 text-center">
            {/* Fondo decorativo */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(236,72,153,0.15)_0%,_transparent_60%)]" />

            <div className="relative mx-auto max-w-3xl">
                <p className="mb-3 text-sm font-medium uppercase tracking-widest text-pink-400">
                    Sorteos en vivo
                </p>
                <h1 className="font-[BebasNeue,sans-serif] text-5xl leading-tight tracking-wide text-white sm:text-7xl">
                    {nombre}
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-slate-300">
                    Participa en nuestros sorteos y bingos en vivo por Facebook. Registra tu comprobante y espera el resultado en directo.
                </p>

                {/* Countdown */}
                {proxima_fecha && countdown && !countdown.expired && (
                    <div className="mx-auto mt-8 inline-flex flex-wrap justify-center gap-3">
                        <p className="w-full text-xs font-medium uppercase tracking-wider text-slate-400">
                            Próximo sorteo en
                        </p>
                        {[
                            { v: countdown.days,    l: 'días' },
                            { v: countdown.hours,   l: 'horas' },
                            { v: countdown.minutes, l: 'min' },
                            { v: countdown.seconds, l: 'seg' },
                        ].map(({ v, l }) => (
                            <div key={l} className="flex w-16 flex-col items-center rounded-xl border border-slate-700 bg-slate-800/80 py-3">
                                <span className="font-[BebasNeue,sans-serif] text-3xl leading-none text-pink-400">
                                    {String(v).padStart(2, '0')}
                                </span>
                                <span className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">{l}</span>
                            </div>
                        ))}
                    </div>
                )}

                {countdown?.expired && (
                    <p className="mt-6 text-sm font-medium text-yellow-400">¡El sorteo está en curso!</p>
                )}

                {/* CTA */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.visit('/sorteos')}
                        className="rounded-xl bg-pink-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-pink-900/40 transition-colors hover:bg-pink-700"
                    >
                        Participar ahora
                    </button>
                    {config.url_stream_live && (
                        <a
                            href={config.url_stream_live}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-slate-600 bg-slate-800/60 px-7 py-3 text-sm font-medium text-white transition-colors hover:border-slate-400"
                        >
                            Ver en vivo
                        </a>
                    )}
                </div>

                {config.mensaje_destacado && (
                    <p className="mt-6 rounded-lg border border-pink-500/20 bg-pink-500/10 px-4 py-2 text-sm text-pink-200">
                        {config.mensaje_destacado}
                    </p>
                )}
            </div>
        </section>
    );
}

/* ── Stream ── */
function StreamSection({ config }) {
    const { estado_stream, url_stream_live, url_stream_grabado } = config;

    if (!estado_stream || (estado_stream === 'sin_transmision' && !url_stream_grabado)) return null;

    return (
        <section className="border-b border-slate-700/50 px-4 py-12">
            <div className="mx-auto max-w-3xl">
                <div className="mb-5 flex items-center gap-3">
                    {estado_stream === 'en_vivo' && (
                        <span className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
                            <span className="size-2 animate-pulse rounded-full bg-red-500" />
                            EN VIVO
                        </span>
                    )}
                    <h2 className="text-lg font-semibold text-white">
                        {ESTADO_STREAM_LABEL[estado_stream] ?? 'Transmisión'}
                    </h2>
                </div>

                {estado_stream === 'en_vivo' && url_stream_live && (
                    <a
                        href={url_stream_live}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-red-950/30 py-10 text-sm font-medium text-red-300 transition-colors hover:bg-red-950/50"
                    >
                        <svg className="size-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Ver transmisión en vivo →
                    </a>
                )}

                {estado_stream !== 'en_vivo' && url_stream_grabado && (
                    <a
                        href={url_stream_grabado}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800/60 py-10 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500"
                    >
                        <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                        Ver última transmisión grabada →
                    </a>
                )}
            </div>
        </section>
    );
}

/* ── Grid de sorteos activos ── */
function SorteosSection({ sorteos }) {
    return (
        <section className="border-b border-slate-700/50 px-4 py-12">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-6 font-[BebasNeue,sans-serif] text-3xl tracking-wide text-white">
                    Sorteos activos
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sorteos.map((s) => (
                        <SorteoCard key={s.id} sorteo={s} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function SorteoCard({ sorteo }) {
    return (
        <div className="flex flex-col rounded-xl border border-slate-700 bg-slate-800 p-5 transition-colors hover:border-pink-500/40">
            <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white">{sorteo.nombre}</h3>
                <span className="shrink-0 rounded-full bg-slate-700 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                    {TIPO_LABEL[sorteo.tipo] ?? sorteo.tipo}
                </span>
            </div>

            <p className="mb-1 text-xs text-slate-400">
                {new Date(sorteo.fecha_sorteo).toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
            <p className="mb-4 text-sm font-medium text-pink-400">
                S/ {Number(sorteo.precio_participacion).toFixed(2)} por participación
            </p>

            {sorteo.premios?.length > 0 && (
                <ul className="mb-4 space-y-1">
                    {sorteo.premios.slice(0, 4).map((p) => (
                        <li key={p.id} className="flex items-center gap-2 text-xs text-slate-300">
                            <span className="size-1.5 shrink-0 rounded-full bg-pink-500" />
                            {p.nombre}
                            {p.monto != null && <span className="text-slate-400">· S/ {Number(p.monto).toFixed(2)}</span>}
                        </li>
                    ))}
                    {sorteo.premios.length > 4 && (
                        <li className="text-xs text-slate-500">+{sorteo.premios.length - 4} premios más</li>
                    )}
                </ul>
            )}

            <button
                type="button"
                onClick={() => router.visit(`/sorteos/${sorteo.id}`)}
                className="mt-auto w-full rounded-lg bg-pink-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-700"
            >
                Participar
            </button>
        </div>
    );
}

/* ── Ganadores recientes ── */
function GanadoresSection({ ganadores }) {
    return (
        <section className="border-b border-slate-700/50 bg-slate-800/30 px-4 py-12">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-6 font-[BebasNeue,sans-serif] text-3xl tracking-wide text-white">
                    Ganadores recientes
                </h2>
                <div className="flex flex-wrap gap-3">
                    {ganadores.map((g) => (
                        <div key={g.id} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm">
                            <p className="font-medium text-white">
                                {g.participante?.nombres} {g.participante?.apellidos}
                            </p>
                            <p className="text-xs text-pink-400">{g.premio?.nombre}</p>
                            <p className="text-xs text-slate-500">{g.sorteo?.nombre}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Banner de seguridad ── */
function SeguridadBanner({ config }) {
    const alerta = config.alerta_seguridad_texto;
    const titular = config.titular_pago;

    if (!alerta && !titular) return null;

    return (
        <section className="px-4 py-10">
            <div className="mx-auto max-w-3xl rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-6 text-center">
                <p className="text-sm font-semibold text-yellow-300">⚠ Aviso de seguridad</p>
                {alerta && <p className="mt-2 text-sm text-yellow-200">{alerta}</p>}
                {titular && (
                    <p className="mt-2 text-xs text-yellow-400">
                        Titular verificado: <span className="font-semibold">{titular}</span>
                    </p>
                )}
            </div>
        </section>
    );
}

/* ── Hook countdown ── */
function calcDiff(iso) {
    if (!iso) return null;
    const remaining = new Date(iso).getTime() - Date.now();
    if (remaining <= 0) return { expired: true };
    return {
        expired:  false,
        days:     Math.floor(remaining / 86_400_000),
        hours:    Math.floor((remaining % 86_400_000) / 3_600_000),
        minutes:  Math.floor((remaining % 3_600_000) / 60_000),
        seconds:  Math.floor((remaining % 60_000) / 1000),
    };
}

function useCountdown(iso) {
    const [diff, setDiff] = useState(() => calcDiff(iso));
    const ref = useRef(iso);
    ref.current = iso;

    useEffect(() => {
        const id = setInterval(() => setDiff(calcDiff(ref.current)), 1000);
        return () => clearInterval(id);
    }, []);

    return diff;
}
