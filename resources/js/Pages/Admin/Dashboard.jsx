import AdminLayout from '@/Layouts/AdminLayout';

const ESTADO_BADGE = {
    pendiente:  'bg-yellow-500/20 text-yellow-300',
    confirmado: 'bg-green-500/20  text-green-300',
    rechazado:  'bg-red-500/20    text-red-300',
};

export default function Dashboard({
    sorteos_activos,
    participantes_hoy,
    comprobantes_pendientes,
    pozo_acumulado,
    actividad_reciente,
}) {
    return (
        <AdminLayout>
            <div className="space-y-8">
                <h1 className="font-[BebasNeue,sans-serif] text-3xl tracking-wide text-white">
                    Dashboard
                </h1>

                {/* ── Tarjetas de stats ── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Sorteos activos"
                        value={sorteos_activos}
                        color="pink"
                        icon={<IconTicket />}
                    />
                    <StatCard
                        label="Participantes hoy"
                        value={participantes_hoy}
                        color="violet"
                        icon={<IconUsers />}
                    />
                    <StatCard
                        label="Comprobantes pendientes"
                        value={comprobantes_pendientes}
                        color="yellow"
                        icon={<IconClock />}
                    />
                    <StatCard
                        label="Pozo acumulado"
                        value={pozo_acumulado != null ? `S/ ${pozo_acumulado}` : '—'}
                        color="emerald"
                        icon={<IconMoney />}
                    />
                </div>

                {/* ── Actividad reciente ── */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold text-slate-200">
                        Actividad reciente
                    </h2>

                    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 text-left text-slate-400">
                                    <th className="px-4 py-3 font-medium">Participante</th>
                                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Sorteo</th>
                                    <th className="px-4 py-3 font-medium">Estado</th>
                                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {actividad_reciente.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                            Sin actividad aún
                                        </td>
                                    </tr>
                                ) : (
                                    actividad_reciente.map((p) => (
                                        <tr key={p.id} className="text-slate-300 transition-colors hover:bg-slate-700/50">
                                            <td className="px-4 py-3 font-medium text-white">
                                                {p.nombres} {p.apellidos}
                                            </td>
                                            <td className="hidden px-4 py-3 sm:table-cell">
                                                {p.sorteo?.nombre ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ESTADO_BADGE[p.estado] ?? ''}`}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td className="hidden px-4 py-3 text-slate-400 lg:table-cell">
                                                {new Date(p.created_at).toLocaleString('es-PE', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, color, icon }) {
    const colors = {
        pink:    'border-pink-500/30    bg-pink-500/10    text-pink-400',
        violet:  'border-violet-500/30  bg-violet-500/10  text-violet-400',
        yellow:  'border-yellow-500/30  bg-yellow-500/10  text-yellow-400',
        emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    };

    return (
        <div className={`flex items-center gap-4 rounded-xl border p-5 ${colors[color]}`}>
            <div className="size-10 shrink-0">{icon}</div>
            <div>
                <p className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</p>
                <p className="mt-0.5 text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
}

/* ── Iconos inline ── */
function IconTicket() {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2zm-6 5h6m-6 3h4" />
        </svg>
    );
}
function IconUsers() {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m22 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );
}
function IconClock() {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
        </svg>
    );
}
function IconMoney() {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1M7 12H5m14 0h-2" />
            <circle cx="12" cy="12" r="9" />
        </svg>
    );
}
