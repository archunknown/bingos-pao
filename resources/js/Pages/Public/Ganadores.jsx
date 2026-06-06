import PublicLayout from '@/Layouts/PublicLayout';
import { router } from '@inertiajs/react';

const TIPO_COLOR = {
    bingo:       'bg-violet-500/20 text-violet-300',
    pozito:      'bg-blue-500/20   text-blue-300',
    especial:    'bg-pink-500/20   text-pink-300',
    aniversario: 'bg-amber-500/20  text-amber-300',
};

const AVATAR_COLORS = [
    'bg-pink-600', 'bg-violet-600', 'bg-blue-600',
    'bg-emerald-600', 'bg-amber-600', 'bg-rose-600',
];

function avatarColor(id) {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function GanadoresPublico({ ganadores, sorteos, filtro_sorteo_id }) {
    function filtrar(sorteoId) {
        router.get('/ganadores', sorteoId ? { sorteo_id: sorteoId } : {}, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <PublicLayout>
            <div className="mx-auto max-w-5xl px-4 py-12">
                {/* Header */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="font-[BebasNeue,sans-serif] text-4xl tracking-wide text-white">
                            Ganadores
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Resultados oficiales de nuestros sorteos
                        </p>
                    </div>

                    {/* Filtro por sorteo */}
                    {sorteos.length > 0 && (
                        <select
                            value={filtro_sorteo_id ?? ''}
                            onChange={(e) => filtrar(e.target.value)}
                            className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="">Todos los sorteos</option>
                            {sorteos.map((s) => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Grid de ganadores */}
                {ganadores.length === 0 ? (
                    <EmptyState filtrado={!!filtro_sorteo_id} onLimpiar={() => filtrar(null)} />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {ganadores.map((g) => (
                            <GanadorCard key={g.id} ganador={g} />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

/* ── Tarjeta de ganador ── */
function GanadorCard({ ganador }) {
    return (
        <div className="flex flex-col rounded-xl border border-slate-700 bg-slate-800 p-5 transition-colors hover:border-slate-600">
            {/* Avatar + nombre */}
            <div className="flex items-center gap-3">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${avatarColor(ganador.id)}`}>
                    {ganador.inicial}
                </div>
                <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{ganador.nombre}</p>
                    {ganador.sorteo && (
                        <p className="truncate text-xs text-slate-400">{ganador.sorteo}</p>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-slate-700" />

            {/* Premio */}
            <div className="flex-1 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Premio</p>
                <p className="font-medium text-white">{ganador.premio}</p>
                {ganador.monto != null && (
                    <p className="text-lg font-bold text-amber-400">
                        S/ {Number(ganador.monto).toFixed(2)}
                    </p>
                )}
                {!ganador.monto && ganador.descripcion && (
                    <p className="text-sm text-slate-400">{ganador.descripcion}</p>
                )}
            </div>

            {/* Footer: tipo sorteo + fecha */}
            <div className="mt-4 flex items-center justify-between gap-2">
                {ganador.tipo_sorteo && (
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${TIPO_COLOR[ganador.tipo_sorteo] ?? 'bg-slate-600/40 text-slate-400'}`}>
                        {ganador.tipo_sorteo}
                    </span>
                )}
                {ganador.fecha_sorteo && (
                    <span className="text-xs text-slate-500">
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
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-16 text-center">
            <p className="text-4xl">🏆</p>
            <p className="mt-3 font-medium text-white">
                {filtrado ? 'Sin ganadores en este sorteo' : 'Aún no hay ganadores publicados'}
            </p>
            <p className="mt-1 text-sm text-slate-400">
                {filtrado
                    ? 'Prueba seleccionando otro sorteo.'
                    : 'Los resultados se publicarán después de cada sorteo.'}
            </p>
            {filtrado && (
                <button
                    type="button"
                    onClick={onLimpiar}
                    className="mt-4 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:border-slate-400 hover:text-white"
                >
                    Ver todos los ganadores
                </button>
            )}
        </div>
    );
}
