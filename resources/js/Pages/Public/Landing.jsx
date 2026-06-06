import PublicLayout from '@/Layouts/PublicLayout';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const TIPO_LABEL = {
    bingo: 'BINGO', pozito: 'POZITO', especial: 'ESPECIAL', aniversario: 'ANIVERSARIO',
};

/* ── Variants compartidos ── */
const heroContainer = {
    hidden:   {},
    visible:  { transition: { staggerChildren: 0.15 } },
};
const heroItem = {
    hidden:   { opacity: 0, y: 30 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const cardContainer = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.1 } },
};
const cardItem = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const chipContainer = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.06 } },
};
const chipItem = {
    hidden:  { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function Landing({ sorteos_activos, ganadores_recientes, config, proxima_fecha }) {
    return (
        <PublicLayout>
            <HeroSection config={config} proxima_fecha={proxima_fecha} />
            <Divider />
            <StreamSection config={config} />
            {sorteos_activos.length > 0 && (
                <>
                    <Divider />
                    <SorteosSection sorteos={sorteos_activos} />
                </>
            )}
            {ganadores_recientes.length > 0 && (
                <>
                    <Divider />
                    <GanadoresSection ganadores={ganadores_recientes} />
                </>
            )}
            <Divider />
            <SeguridadBanner config={config} />
        </PublicLayout>
    );
}

function Divider() {
    return <div className="h-px bg-gold/10" />;
}

/* ── Hero ── */
function HeroSection({ config, proxima_fecha }) {
    const countdown = useCountdown(proxima_fecha);

    return (
        <section className="relative overflow-hidden bg-bg px-4 py-16 text-center md:py-24">
            {/* Fondo con puntos — escala pulsante sutil */}
            <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.07) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            {/* Glow radial */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 35%, rgba(212,175,55,0.10), transparent 70%)' }}
            />

            {/* Contenido con stagger */}
            <motion.div
                className="relative mx-auto max-w-4xl"
                variants={heroContainer}
                initial="hidden"
                animate="visible"
            >
                <motion.p
                    variants={heroItem}
                    className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-muted"
                >
                    Sorteos en vivo · Facebook Live
                </motion.p>

                <motion.h1 variants={heroItem} className="font-display leading-none">
                    <span className="block text-7xl text-cream md:text-9xl">GANA</span>
                    <span
                        className="block text-7xl md:text-9xl"
                        style={{
                            WebkitTextStroke: '2px #D4AF37',
                            WebkitTextFillColor: 'transparent',
                            color: 'transparent',
                        }}
                    >
                        PREMIOS
                    </span>
                </motion.h1>

                <motion.p variants={heroItem} className="mx-auto mt-6 max-w-lg font-light text-muted">
                    Participa en nuestros sorteos y bingos en vivo por Facebook. Registra tu
                    comprobante y espera el resultado en directo.
                </motion.p>

                {/* Countdown */}
                {proxima_fecha && countdown && !countdown.expired && (
                    <motion.div variants={heroItem} className="mt-10">
                        <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-muted">
                            Próximo sorteo en
                        </p>
                        <div className="inline-flex items-center gap-1.5 md:gap-3">
                            {[
                                { v: countdown.days,    l: 'días' },
                                { v: countdown.hours,   l: 'horas' },
                                { v: countdown.minutes, l: 'min' },
                                { v: countdown.seconds, l: 'seg' },
                            ].map(({ v, l }, i) => (
                                <div key={l} className="flex items-center gap-1.5 md:gap-3">
                                    <div className="flex flex-col items-center border border-gold/30 bg-surface2 px-3 py-2.5 md:px-5 md:py-4">
                                        <span className="font-display text-5xl leading-none text-gold md:text-6xl">
                                            {String(v).padStart(2, '0')}
                                        </span>
                                        <span className="mt-1.5 text-[9px] uppercase tracking-widest text-muted">
                                            {l}
                                        </span>
                                    </div>
                                    {i < 3 && (
                                        <span className="font-display text-3xl text-gold/50 md:text-4xl">:</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {countdown?.expired && (
                    <motion.p variants={heroItem} className="mt-8 font-display text-3xl tracking-widest text-gold">
                        ¡EL SORTEO ESTÁ EN CURSO!
                    </motion.p>
                )}

                {/* CTA */}
                <motion.div variants={heroItem} className="mt-10 flex flex-wrap justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.visit('/sorteos')}
                        className="bg-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-bg transition-colors hover:bg-gold-light"
                    >
                        Participar ahora
                    </button>
                    {config.url_stream_live && (
                        <a
                            href={config.url_stream_live}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-gold/50 bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
                        >
                            Ver en vivo
                        </a>
                    )}
                </motion.div>

                {config.mensaje_destacado && (
                    <motion.p variants={heroItem} className="mx-auto mt-8 max-w-lg text-sm text-muted">
                        ✦ {config.mensaje_destacado}
                    </motion.p>
                )}
            </motion.div>
        </section>
    );
}

/* ── Stream ── */
function StreamSection({ config }) {
    const { estado_stream, url_stream_live, url_stream_grabado } = config;
    if (!estado_stream) return null;
    const isLive = estado_stream === 'en_vivo';
    const url = isLive ? url_stream_live : url_stream_grabado;
    if (!isLive && !url) return null;

    return (
        <section className="px-4 py-16 md:py-24">
            <div className="mx-auto max-w-3xl">
                <div className="mb-5 flex items-center gap-3">
                    {isLive && (
                        <span className="animate-pulse bg-danger px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                            ● EN VIVO
                        </span>
                    )}
                    <h2 className="font-display text-2xl tracking-widest text-cream">
                        {isLive ? 'TRANSMISIÓN EN VIVO' : 'ÚLTIMA TRANSMISIÓN'}
                    </h2>
                </div>

                <div
                    className="relative aspect-video w-full overflow-hidden border border-gold/30 bg-surface2"
                    style={{ boxShadow: '0 0 48px rgba(212,175,55,0.07), 0 0 0 1px rgba(212,175,55,0.04)' }}
                >
                    {url ? (
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted transition-colors hover:text-gold"
                        >
                            <svg className="size-16 text-gold" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <span className="text-xs uppercase tracking-widest">
                                {isLive ? 'Ver transmisión en vivo →' : 'Ver última transmisión →'}
                            </span>
                        </a>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <svg className="size-14 text-gold/20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <p className="text-xs uppercase tracking-widest text-muted">Sin transmisión activa</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ── Sorteos activos ── */
function SorteosSection({ sorteos }) {
    return (
        <section className="px-4 py-16 md:py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-10 border-l-4 border-gold pl-5 font-display text-5xl text-cream">
                    SORTEOS ACTIVOS
                </h2>
                <motion.div
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    variants={cardContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {sorteos.map((s) => (
                        <motion.div
                            key={s.id}
                            variants={cardItem}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <SorteoCard sorteo={s} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function SorteoCard({ sorteo }) {
    return (
        <div className="flex h-full flex-col border border-gold/20 bg-surface transition-colors hover:border-gold/60">
            <div className="flex items-center justify-between gap-2 border-b border-gold/10 bg-surface2 px-4 py-3">
                <span className="font-display text-xl tracking-widest text-gold">
                    {TIPO_LABEL[sorteo.tipo] ?? sorteo.tipo.toUpperCase()}
                </span>
                <span className="bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-bg">
                    S/ {Number(sorteo.precio_participacion).toFixed(2)}
                </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-1 text-sm font-semibold text-cream">{sorteo.nombre}</h3>
                <p className="mb-4 text-xs text-muted">
                    {new Date(sorteo.fecha_sorteo).toLocaleString('es-PE', {
                        dateStyle: 'long', timeStyle: 'short',
                    })}
                </p>
                {sorteo.premios?.length > 0 && (
                    <ul className="mb-5 flex-1 space-y-2">
                        {sorteo.premios.slice(0, 4).map((p) => (
                            <li key={p.id} className="flex items-baseline gap-2 text-xs">
                                <span className="shrink-0 text-gold">●</span>
                                <span className="text-content">{p.nombre}</span>
                                {p.monto != null && (
                                    <span className="ml-auto font-bold text-gold">
                                        S/ {Number(p.monto).toFixed(2)}
                                    </span>
                                )}
                            </li>
                        ))}
                        {sorteo.premios.length > 4 && (
                            <li className="text-[11px] text-muted">+{sorteo.premios.length - 4} premios más</li>
                        )}
                    </ul>
                )}
                <button
                    type="button"
                    onClick={() => router.visit(`/sorteos/${sorteo.id}`)}
                    className="mt-auto w-full bg-danger py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-danger-dark"
                >
                    Participar
                </button>
            </div>
        </div>
    );
}

/* ── Ganadores recientes ── */
function GanadoresSection({ ganadores }) {
    return (
        <section className="px-4 py-16 md:py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-8 border-l-4 border-gold pl-5 font-display text-5xl text-cream">
                    GANADORES RECIENTES
                </h2>
                <motion.div
                    className="flex flex-wrap gap-3"
                    variants={chipContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {ganadores.map((g) => (
                        <motion.div
                            key={g.id}
                            variants={chipItem}
                            className="border border-gold/30 bg-surface px-4 py-3"
                        >
                            <p className="text-sm font-semibold text-cream">
                                {g.participante?.nombres} {g.participante?.apellidos}
                            </p>
                            <p className="text-xs font-bold text-gold">{g.premio?.nombre}</p>
                            <p className="text-[11px] text-muted">{g.sorteo?.nombre}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

/* ── Banner de seguridad ── */
function SeguridadBanner({ config }) {
    const { alerta_seguridad_texto: alerta, titular_pago: titular } = config;
    if (!alerta && !titular) return null;

    return (
        <section className="px-4 py-16 md:py-24">
            <div className="mx-auto max-w-3xl border-l-4 border-danger bg-danger/10 p-6">
                <div className="flex items-start gap-4">
                    <span className="shrink-0 text-xl text-danger">⚠</span>
                    <div>
                        <p className="font-display text-2xl tracking-widest text-danger">AVISO DE SEGURIDAD</p>
                        {alerta && <p className="mt-2 text-sm text-cream">{alerta}</p>}
                        {titular && (
                            <p className="mt-3 text-xs text-muted">
                                Titular verificado:{' '}
                                <span className="font-semibold text-cream">{titular}</span>
                            </p>
                        )}
                    </div>
                </div>
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
