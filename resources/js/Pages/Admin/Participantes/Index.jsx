import AdminLayout from '@/Layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const ESTADOS = [
    { value: '',           label: 'Todos' },
    { value: 'pendiente',  label: 'Pendientes' },
    { value: 'confirmado', label: 'Confirmados' },
    { value: 'rechazado',  label: 'Rechazados' },
];

const ESTADO_STYLE = {
    pendiente:  'bg-yellow-500/20 text-yellow-300',
    confirmado: 'bg-green-500/20  text-green-300',
    rechazado:  'bg-red-500/20    text-red-300',
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
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    const pendientesCount = participantes.filter((p) => p.estado === 'pendiente').length;

    return (
        <AdminLayout>
            {toast && (
                <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
                    toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {toast.msg}
                </div>
            )}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="font-[BebasNeue,sans-serif] text-3xl tracking-wide text-white">
                            Participantes
                        </h1>
                        {pendientesCount > 0 && (
                            <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-black">
                                {pendientesCount} pendiente{pendientesCount !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {/* Selector de sorteo */}
                    <select
                        value={filtros.sorteo_id ?? ''}
                        onChange={(e) => filtrar('sorteo_id', e.target.value)}
                        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                        <option value="">Todos los sorteos</option>
                        {sorteos.map((s) => (
                            <option key={s.id} value={s.id}>{s.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Tabs de estado */}
                <div className="flex gap-1 rounded-lg border border-slate-700 bg-slate-800/50 p-1">
                    {ESTADOS.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => filtrar('estado', value)}
                            className={[
                                'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                (filtros.estado ?? '') === value
                                    ? 'bg-pink-600 text-white'
                                    : 'text-slate-400 hover:text-white',
                            ].join(' ')}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tabla */}
                <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 text-left text-slate-400">
                                    <th className="px-4 py-3 font-medium">N°</th>
                                    <th className="px-4 py-3 font-medium">Nombre</th>
                                    <th className="hidden px-4 py-3 font-medium sm:table-cell">WhatsApp</th>
                                    <th className="hidden px-4 py-3 font-medium md:table-cell">Sorteo</th>
                                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Registro</th>
                                    <th className="px-4 py-3 font-medium">Estado</th>
                                    <th className="px-4 py-3 font-medium text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {participantes.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                                            No hay participantes con este filtro.
                                        </td>
                                    </tr>
                                ) : (
                                    participantes.map((p) => (
                                        <tr key={p.id} className="text-slate-300 transition-colors hover:bg-slate-700/40">
                                            <td className="px-4 py-3 font-mono text-xs text-slate-400">
                                                {p.numero_registro ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-white">
                                                {p.nombres} {p.apellidos}
                                            </td>
                                            <td className="hidden px-4 py-3 sm:table-cell">{p.whatsapp}</td>
                                            <td className="hidden px-4 py-3 md:table-cell">
                                                {p.sorteo?.nombre ?? '—'}
                                            </td>
                                            <td className="hidden px-4 py-3 text-xs text-slate-400 lg:table-cell">
                                                {new Date(p.created_at).toLocaleString('es-PE', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ESTADO_STYLE[p.estado] ?? ''}`}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => router.visit(`/admin/participantes/${p.id}`)}
                                                    className="rounded px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-600 transition-colors hover:bg-slate-700 hover:text-white"
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
