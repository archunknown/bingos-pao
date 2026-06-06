import AdminLayout from '@/Layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const TIPO_LABEL = {
    bingo:       'Bingo',
    pozito:      'Pozito',
    especial:    'Especial',
    aniversario: 'Aniversario',
};

const ESTADO_STYLE = {
    borrador: 'bg-slate-500/20 text-slate-300',
    activo:   'bg-green-500/20  text-green-300',
    cerrado:  'bg-red-500/20    text-red-300',
};

const TOGGLE_LABEL = { borrador: 'Activar', activo: 'Cerrar' };

export default function SorteosIndex({ sorteos }) {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    function toggleEstado(sorteo) {
        router.patch(
            `/admin/sorteos/${sorteo.id}/toggle-estado`,
            {},
            { preserveScroll: true },
        );
    }

    function destroy(sorteo) {
        if (!confirm(`¿Eliminar el sorteo "${sorteo.nombre}"?`)) return;
        router.delete(`/admin/sorteos/${sorteo.id}`, { preserveScroll: true });
    }

    return (
        <AdminLayout>
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${
                        toast.type === 'success'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                    }`}
                >
                    {toast.msg}
                </div>
            )}

            <div className="space-y-6">
                {/* Encabezado */}
                <div className="flex items-center justify-between">
                    <h1 className="font-[BebasNeue,sans-serif] text-3xl tracking-wide text-white">
                        Sorteos
                    </h1>
                    <a
                        href="/admin/sorteos/create"
                        onClick={(e) => { e.preventDefault(); router.visit('/admin/sorteos/create'); }}
                        className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-700"
                    >
                        + Nuevo sorteo
                    </a>
                </div>

                {/* Tabla */}
                <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 text-left text-slate-400">
                                    <th className="px-4 py-3 font-medium">Nombre</th>
                                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Tipo</th>
                                    <th className="hidden px-4 py-3 font-medium md:table-cell">Fecha</th>
                                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Precio</th>
                                    <th className="hidden px-4 py-3 font-medium xl:table-cell">Participantes</th>
                                    <th className="px-4 py-3 font-medium">Estado</th>
                                    <th className="px-4 py-3 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {sorteos.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                                            No hay sorteos creados aún.
                                        </td>
                                    </tr>
                                ) : (
                                    sorteos.map((s) => (
                                        <tr key={s.id} className="text-slate-300 transition-colors hover:bg-slate-700/40">
                                            <td className="px-4 py-3 font-medium text-white">{s.nombre}</td>
                                            <td className="hidden px-4 py-3 sm:table-cell">
                                                {TIPO_LABEL[s.tipo] ?? s.tipo}
                                            </td>
                                            <td className="hidden px-4 py-3 md:table-cell">
                                                {new Date(s.fecha_sorteo).toLocaleString('es-PE', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="hidden px-4 py-3 lg:table-cell">
                                                S/ {Number(s.precio_participacion).toFixed(2)}
                                            </td>
                                            <td className="hidden px-4 py-3 xl:table-cell">
                                                {s.participantes_count}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ESTADO_STYLE[s.estado] ?? ''}`}>
                                                    {s.estado}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Editar */}
                                                    <button
                                                        type="button"
                                                        onClick={() => router.visit(`/admin/sorteos/${s.id}/edit`)}
                                                        className="rounded px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-600 transition-colors hover:bg-slate-700 hover:text-white"
                                                    >
                                                        Editar
                                                    </button>

                                                    {/* Toggle estado */}
                                                    {TOGGLE_LABEL[s.estado] && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleEstado(s)}
                                                            className="rounded px-2.5 py-1 text-xs font-medium text-violet-300 ring-1 ring-violet-600 transition-colors hover:bg-violet-700 hover:text-white"
                                                        >
                                                            {TOGGLE_LABEL[s.estado]}
                                                        </button>
                                                    )}

                                                    {/* Eliminar */}
                                                    {(s.estado === 'borrador' || s.participantes_count === 0) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => destroy(s)}
                                                            className="rounded px-2.5 py-1 text-xs font-medium text-red-400 ring-1 ring-red-700 transition-colors hover:bg-red-700 hover:text-white"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
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
