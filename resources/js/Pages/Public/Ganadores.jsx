import PublicLayout from '@/Layouts/PublicLayout';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';

const AVATAR_PALETTES = [
    { bg: '#D4AF37', text: '#0D0D0D' },
    { bg: '#C0392B', text: '#ffffff' },
    { bg: '#27AE60', text: '#ffffff' },
    { bg: '#B8960C', text: '#0D0D0D' },
    { bg: '#F5F0E8', text: '#0D0D0D' },
    { bg: '#888888', text: '#0D0D0D' },
];

function avatarPalette(id) {
    return AVATAR_PALETTES[id % AVATAR_PALETTES.length];
}

const gridContainer = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.09 } },
};
const gridItem = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function GanadoresPublico({ ganadores, sorteos, filtro_sorteo_id }) {
    function filtrar(sorteoId) {
        router.get('/ganadores', sorteoId ? { sorteo_id: sorteoId } : {}, {
            preserveState: true, replace: true,
        });
    }

    return (
        <PublicLayout>
            <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="mb-10 flex flex-wrap items-end justify-between gap-6"
                >
                    <div>
                        <h1 className="border-l-4 border-gold pl-4 font-display text-5xl text-cream">
                            GANADORES
                        </h1>
                        <p className="mt-2 pl-5 text-sm text-muted">
                            Resultados oficiales de nuestros sorteos
                        </p>
                    </div>

                    {sorteos.length > 0 && (
                        <div className="flex items-center gap-3">
                            <select
                                value={filtro_sorteo_id ?? ''}
                                onChange={(e) => filtrar(e.target.value)}
                                className="border border-gold/20 bg-surface2 px-4 py-2.5 text-sm text-cream outline-none transition-colors focus:border-gold"
                            >
                                <option value="">Todos los sorteos</option>
                                {sorteos.map((s) => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                            {filtro_sorteo_id && (
                                <button
                                    type="button"
                                    onClick={() => filtrar(null)}
                                    className="border border-gold/30 px-3 py-2.5 text-sm text-muted transition-colors hover:text-gold"
                                >
                                    Limpiar filtro
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Grid de ganadores */}
                {ganadores.length === 0 ? (
                    <EmptyState filtrado={!!filtro_sorteo_id} onLimpiar={() => filtrar(null)} />
                ) : (
                    <motion.div
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        variants={gridContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {ganadores.map((g) => (
                            <motion.div key={g.id} variants={gridItem}>
                                <GanadorCard ganador={g} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </PublicLayout>
    );
}

/* ── Tarjeta de ganador ── */
function GanadorCard({ ganador }) {
    const palette = avatarPalette(ganador.id);

    return (
        <div className="flex flex-col border border-gold/20 bg-surface p-5 transition-colors hover:border-gold/50">
            {/* Avatar + nombre */}
            <div className="flex items-center gap-3">
                <motion.div
                    className="flex size-11 shrink-0 items-center justify-center border border-gold/30 text-base font-bold"
                    style={{ backgroundColor: palette.bg, color: palette.text }}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                    {ganador.inicial}
                </motion.div>
                <div className="min-w-0">
                    <p className="truncate font-semibold text-cream">{ganador.nombre}</p>
                    {ganador.sorteo && (
                        <p className="truncate text-xs text-muted">{ganador.sorteo}</p>
                    )}
                </div>
            </div>

            {/* Separador */}
            <div className="my-4 h-px bg-gold/10" />

            {/* Premio */}
            <div className="flex-1 space-y-2">
                {ganador.monto != null && (
                    <p className="font-display text-2xl text-gold">
                        S/ {Number(ganador.monto).toFixed(2)}
                    </p>
                )}
                <p className="text-sm text-cream">{ganador.premio}</p>
                {!ganador.monto && ganador.descripcion && (
                    <p className="text-xs text-muted">{ganador.descripcion}</p>
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between gap-2">
                {ganador.tipo_sorteo && (
                    <span className="border border-gold/20 bg-gold/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                        {ganador.tipo_sorteo}
                    </span>
                )}
                {ganador.fecha_sorteo && (
                    <span className="text-xs text-muted">
                        {new Date(ganador.fecha_sorteo).toLocaleDateString('es-PE', { dateStyle: 'medium' })}
                    </span>
                )}
            </div>
        </div>
    );
}

/* ── Estado vacío ── */
function EmptyState({ filtrado, onLimpiar }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="border border-gold/10 bg-surface px-6 py-16 text-center"
        >
            <p className="font-display text-7xl text-gold/20">🏆</p>
            <p className="mt-4 font-display text-2xl text-muted">
                {filtrado ? 'Sin ganadores en este sorteo' : 'Aún no hay ganadores publicados'}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                {filtrado
                    ? 'Prueba seleccionando otro sorteo o limpia el filtro.'
                    : 'Los resultados se publicarán después de cada sorteo en vivo.'}
            </p>
            {filtrado ? (
                <button type="button" onClick={onLimpiar}
                    className="mt-6 border border-gold/50 px-6 py-3 text-sm font-bold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10">
                    Ver todos los ganadores
                </button>
            ) : (
                <button type="button" onClick={() => router.visit('/')}
                    className="mt-6 border border-gold/50 px-6 py-3 text-sm font-bold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10">
                    Ver sorteos activos
                </button>
            )}
        </motion.div>
    );
}
