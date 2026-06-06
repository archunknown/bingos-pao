import AdminLayout from '@/Layouts/AdminLayout';

const ESTADO_BADGE = {
    pendiente:  'bg-gold/10 text-gold border-gold/30',
    confirmado: 'bg-success/10 text-success border-success/30',
    rechazado:  'bg-danger/10 text-danger border-danger/30',
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
                <h1 className="font-display text-4xl text-cream">DASHBOARD</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Sorteos activos"         value={sorteos_activos}    icon={<IconTicket />} accent="gold" />
                    <StatCard label="Participantes hoy"       value={participantes_hoy}  icon={<IconUsers />}  accent="success" />
                    <StatCard label="Comprobantes pendientes" value={comprobantes_pendientes} icon={<IconClock />} accent="gold" />
                    <StatCard
                        label="Pozo acumulado"
                        value={pozo_acumulado != null ? `S/ ${pozo_acumulado}` : '—'}
                        icon={<IconMoney />}
                        accent="gold"
                    />
                </div>

                {/* Actividad reciente */}
                <section>
                    <h2 className="mb-4 border-l-4 border-gold pl-3 font-display text-2xl text-gold">
                        ACTIVIDAD RECIENTE
                    </h2>
                    <div className="overflow-hidden border border-gold/20 bg-surface">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-surface2 text-left">
                                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">Participante</th>
                                        <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted sm:table-cell">Sorteo</th>
                                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">Estado</th>
                                        <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted lg:table-cell">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actividad_reciente.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-10 text-center text-muted">
                                                Sin actividad aún
                                            </td>
                                        </tr>
                                    ) : (
                                        actividad_reciente.map((p) => (
                                            <tr key={p.id} className="border-b border-gold/10 transition-colors hover:bg-surface2/50">
                                                <td className="px-4 py-3 font-medium text-cream">
                                                    {p.nombres} {p.apellidos}
                                                </td>
                                                <td className="hidden px-4 py-3 text-content sm:table-cell">
                                                    {p.sorteo?.nombre ?? '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${ESTADO_BADGE[p.estado] ?? 'text-muted'}`}>
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

function StatCard({ label, value, icon, accent }) {
    const accentCls = accent === 'success' ? 'border-l-success text-success' : 'border-l-gold text-gold';
    return (
        <div className={`flex items-center gap-4 border border-gold/20 border-l-4 bg-surface p-5 ${accentCls}`}>
            <div className="size-10 shrink-0">{icon}</div>
            <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted">{label}</p>
                <p className="mt-0.5 font-display text-3xl text-cream">{value}</p>
            </div>
        </div>
    );
}

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
