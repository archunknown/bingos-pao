import AdminLayout from '@/Layouts/AdminLayout';

const ESTADO_BADGE = {
    pendiente:  'bg-gold/10 text-gold border border-gold/30',
    confirmado: 'bg-success/10 text-success border border-success/30',
    rechazado:  'bg-danger/10 text-danger border border-danger/30',
};

export default function Dashboard({
    sorteos_activos,
    participantes_hoy,
    comprobantes_pendientes,
    pozo_acumulado,
    actividad_reciente,
}) {
    const hasPendientes = comprobantes_pendientes > 0;

    return (
        <AdminLayout>
            <div className="space-y-8">
                <h1 className="font-display text-4xl text-cream">DASHBOARD</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Sorteos activos"
                        value={sorteos_activos}
                        icon={<IconTicket />}
                        accent="gold"
                    />
                    <StatCard
                        label="Participantes hoy"
                        value={participantes_hoy}
                        icon={<IconUsers />}
                        accent="success"
                    />
                    <StatCard
                        label="Comprobantes pendientes"
                        value={comprobantes_pendientes}
                        icon={<IconClock />}
                        accent={hasPendientes ? 'danger' : 'gold'}
                        glow={hasPendientes ? 'danger' : null}
                    />
                    <StatCard
                        label="Pozo acumulado"
                        value={`S/ ${Number(pozo_acumulado ?? 0).toFixed(2)}`}
                        icon={<IconMoney />}
                        accent="gold"
                        glow="gold"
                    />
                </div>

                {/* Actividad reciente */}
                <section>
                    <h2 className="mb-4 border-l-4 border-gold pl-3 font-display text-2xl text-gold">
                        ACTIVIDAD RECIENTE
                    </h2>
                    <div className="overflow-hidden border border-gold/20 bg-surface">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm" style={{ counterReset: 'row-num' }}>
                                <thead>
                                    <tr className="bg-surface2 text-left">
                                        <th className="w-8 px-4 py-3" />
                                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">Participante</th>
                                        <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted sm:table-cell">Sorteo</th>
                                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">Estado</th>
                                        <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted lg:table-cell">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actividad_reciente.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-16 text-center">
                                                <EmptyState />
                                            </td>
                                        </tr>
                                    ) : (
                                        actividad_reciente.map((p, i) => (
                                            <tr
                                                key={p.id}
                                                className="border-b border-gold/10 transition-colors duration-150 hover:bg-surface2"
                                            >
                                                <td className="px-4 py-3 text-xs text-muted/30 select-none">
                                                    {i + 1}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-cream">
                                                    {p.nombres} {p.apellidos}
                                                </td>
                                                <td className="hidden px-4 py-3 text-content sm:table-cell">
                                                    {p.sorteo?.nombre ?? '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${ESTADO_BADGE[p.estado] ?? 'text-muted'}`}>
                                                        <span className={`size-1.5 rounded-full ${
                                                            p.estado === 'confirmado' ? 'bg-success' :
                                                            p.estado === 'rechazado'  ? 'bg-danger'  : 'bg-gold'
                                                        }`} />
                                                        {p.estado}
                                                    </span>
                                                </td>
                                                <td className="hidden px-4 py-3 text-xs text-muted lg:table-cell">
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
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, icon, accent, glow }) {
    const accentBorder =
        accent === 'success' ? 'border-l-success' :
        accent === 'danger'  ? 'border-l-danger'  : 'border-l-gold';

    const accentText =
        accent === 'success' ? 'text-success' :
        accent === 'danger'  ? 'text-danger'  : 'text-gold';

    const glowShadow =
        glow === 'gold'   ? 'shadow-glow-gold' :
        glow === 'danger' ? 'shadow-glow-danger' : '';

    return (
        <div className={[
            'relative overflow-hidden border border-gold/20 border-l-4 bg-surface p-5 transition-shadow duration-300 hover:shadow-lg',
            accentBorder,
            glowShadow,
        ].join(' ')}>
            {/* Ícono marca de agua */}
            <div className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-12 opacity-10 ${accentText}`}>
                {icon}
            </div>

            <p className="text-[10px] font-medium uppercase tracking-widest text-muted">{label}</p>
            <p className="mt-1 font-display text-4xl text-cream">{value}</p>

            {/* Línea de tendencia decorativa */}
            <svg className="mt-3 h-6 w-full opacity-20" viewBox="0 0 120 24" preserveAspectRatio="none">
                <polyline
                    points="0,20 20,16 40,18 60,10 80,14 100,8 120,12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={accentText}
                />
            </svg>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center gap-3 text-muted">
            <svg className="size-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">Sin actividad aún</p>
            <p className="text-xs text-muted/60">Las participaciones aparecerán aquí</p>
        </div>
    );
}

function IconTicket() {
    return (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2zm-6 5h6m-6 3h4" />
        </svg>
    );
}
function IconUsers() {
    return (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m22 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );
}
function IconClock() {
    return (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
        </svg>
    );
}
function IconMoney() {
    return (
        <svg className="size-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1M7 12H5m14 0h-2" />
            <circle cx="12" cy="12" r="9" />
        </svg>
    );
}
