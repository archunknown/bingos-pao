import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

const ESTADOS = [
    { value: '',           label: 'Todos' },
    { value: 'pendiente',  label: 'Pendientes' },
    { value: 'confirmado', label: 'Confirmados' },
    { value: 'rechazado',  label: 'Rechazados' },
];

const ESTADO_BADGE = {
    pendiente:  { cls: 'bg-gold/10 text-gold border border-gold/30',       dot: 'bg-gold' },
    confirmado: { cls: 'bg-success/10 text-success border border-success/30', dot: 'bg-success' },
    rechazado:  { cls: 'bg-danger/10 text-danger border border-danger/30',  dot: 'bg-danger' },
};

export default function ParticipantesIndex({ sorteos, participantes, filtros }) {
    function filtrar(campo, valor) {
        router.get('/admin/participantes', { ...filtros, [campo]: valor || undefined }, {
            preserveState: true, preserveScroll: true, replace: true,
        });
    }

    const counts = {
        '':           participantes.length,
        pendiente:    participantes.filter((p) => p.estado === 'pendiente').length,
        confirmado:   participantes.filter((p) => p.estado === 'confirmado').length,
        rechazado:    participantes.filter((p) => p.estado === 'rechazado').length,
    };

    const pendientesCount = counts.pendiente;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="font-display text-4xl text-cream">PARTICIPANTES</h1>
                        {pendientesCount > 0 && (
                            <span className="animate-pulse rounded-full bg-danger px-2.5 py-0.5 text-xs font-bold text-white">
                                {pendientesCount} pendiente{pendientesCount !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {/* Filtro de sorteo estilizado */}
                    <div className="relative">
                        <select
                            value={filtros.sorteo_id ?? ''}
                            onChange={(e) => filtrar('sorteo_id', e.target.value)}
                            className="appearance-none border border-gold/20 bg-surface2 pl-3 pr-8 py-2 text-sm text-cream outline-none transition-colors focus:border-gold cursor-pointer"
                        >
                            <option value="">Todos los sorteos</option>
                            {sorteos.map((s) => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </select>
                        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Tabs con counters */}
                <div className="flex border border-gold/20 bg-surface2 p-1 gap-1">
                    {ESTADOS.map(({ value, label }) => {
                        const active = (filtros.estado ?? '') === value;
                        const count  = counts[value];
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => filtrar('estado', value)}
                                className={[
                                    'flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors',
                                    active ? 'bg-gold text-bg font-bold' : 'text-muted hover:text-cream',
                                ].join(' ')}
                            >
                                {label}
                                <span className={[
                                    'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                                    active ? 'bg-bg/20 text-bg' : 'bg-surface text-muted',
                                ].join(' ')}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Tabla */}
                <div className="overflow-hidden border border-gold/20 bg-surface">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface2 text-left">
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">N°</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">Nombre</th>
                                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted sm:table-cell">WhatsApp</th>
                                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted md:table-cell">Sorteo</th>
                                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted lg:table-cell">Registro</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">Estado</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-widest text-muted">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participantes.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-muted">
                                                <svg className="size-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m22 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <p className="text-sm font-medium">No hay participantes con este filtro</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    participantes.map((p) => {
                                        const badge = ESTADO_BADGE[p.estado];
                                        const isPendiente = p.estado === 'pendiente';
                                        return (
                                            <tr
                                                key={p.id}
                                                className={[
                                                    'border-b border-gold/10 transition-colors duration-150 hover:bg-surface2',
                                                    isPendiente ? 'bg-gold/5' : '',
                                                ].join(' ')}
                                            >
                                                <td className="px-4 py-3 font-mono text-xs text-muted">
                                                    {p.numero_registro ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-cream">
                                                    {p.nombres} {p.apellidos}
                                                </td>
                                                <td className="hidden px-4 py-3 text-content sm:table-cell">{p.whatsapp}</td>
                                                <td className="hidden px-4 py-3 text-content md:table-cell">
                                                    {p.sorteo?.nombre ?? '—'}
                                                </td>
                                                <td className="hidden px-4 py-3 text-xs text-muted lg:table-cell">
                                                    {new Date(p.created_at).toLocaleString('es-PE', {
                                                        dateStyle: 'short', timeStyle: 'short',
                                                    })}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${badge?.cls ?? 'text-muted'}`}>
                                                        {badge && <span className={`size-1.5 rounded-full ${badge.dot}`} />}
                                                        {p.estado}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => router.visit(`/admin/participantes/${p.id}`)}
                                                        className="border border-gold/30 px-2.5 py-1 text-xs font-medium text-muted transition-colors duration-150 hover:border-gold hover:text-cream"
                                                    >
                                                        Ver
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
