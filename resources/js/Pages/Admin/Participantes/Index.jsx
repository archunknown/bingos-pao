import AdminLayout from '@/Layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const ESTADOS = [
    { value: '',           label: 'Todos' },
    { value: 'pendiente',  label: 'Pendientes' },
    { value: 'confirmado', label: 'Confirmados' },
    { value: 'rechazado',  label: 'Rechazados' },
];

const ESTADO_BADGE = {
    pendiente:  'bg-gold/10 text-gold border-gold/30',
    confirmado: 'bg-success/10 text-success border-success/30',
    rechazado:  'bg-danger/10 text-danger border-danger/30',
};

export default function ParticipantesIndex({ sorteos, participantes, filtros }) {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    function filtrar(campo, valor) {
        router.get('/admin/participantes', { ...filtros, [campo]: valor || undefined }, {
            preserveState: true, preserveScroll: true, replace: true,
        });
    }

    const pendientesCount = participantes.filter((p) => p.estado === 'pendiente').length;

    return (
        <AdminLayout>
            {toast && (
                <div className={`fixed right-4 top-4 z-50 border border-gold/30 bg-surface px-4 py-3 text-sm text-cream shadow-xl ${
                    toast.type === 'success' ? 'border-l-4 border-l-success' : 'border-l-4 border-l-danger'
                }`}>
                    {toast.msg}
                </div>
            )}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="font-display text-4xl text-cream">PARTICIPANTES</h1>
                        {pendientesCount > 0 && (
                            <span className="bg-danger px-2 py-0.5 text-xs font-bold text-white">
                                {pendientesCount} pendiente{pendientesCount !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <select
                        value={filtros.sorteo_id ?? ''}
                        onChange={(e) => filtrar('sorteo_id', e.target.value)}
                        className="border border-gold/20 bg-surface2 px-3 py-2 text-sm text-cream outline-none transition-colors focus:border-gold"
                    >
                        <option value="">Todos los sorteos</option>
                        {sorteos.map((s) => (
                            <option key={s.id} value={s.id}>{s.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Tabs de estado */}
                <div className="flex border border-gold/20 bg-surface2 p-1 gap-1">
                    {ESTADOS.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => filtrar('estado', value)}
                            className={[
                                'flex-1 px-3 py-1.5 text-sm font-medium transition-colors',
                                (filtros.estado ?? '') === value
                                    ? 'bg-gold text-bg font-bold'
                                    : 'text-muted hover:text-cream',
                            ].join(' ')}
                        >
                            {label}
                        </button>
                    ))}
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
                                        <td colSpan={7} className="px-4 py-10 text-center text-muted">
                                            No hay participantes con este filtro.
                                        </td>
                                    </tr>
                                ) : (
                                    participantes.map((p) => (
                                        <tr key={p.id} className="border-b border-gold/10 transition-colors hover:bg-surface2/50">
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
                                                <span className={`inline-block border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${ESTADO_BADGE[p.estado] ?? ''}`}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => router.visit(`/admin/participantes/${p.id}`)}
                                                    className="border border-gold/30 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-gold hover:text-cream"
                                                >
                                                    Ver
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
