import AdminLayout from '@/Layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const TIPO_LABEL = {
    bingo: 'Bingo', pozito: 'Pozito', especial: 'Especial', aniversario: 'Aniversario',
};

const ESTADO_BADGE = {
    borrador: 'bg-gold/10 text-gold border-gold/30',
    activo:   'bg-success/10 text-success border-success/30',
    cerrado:  'bg-surface2 text-muted border-muted/20',
};

const TOGGLE_LABEL = { borrador: 'Activar', activo: 'Cerrar' };

function ConfirmDeleteModal({ sorteo, onConfirm, onCancel }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={onCancel}
        >
            <div
                className="w-full max-w-sm border border-danger/30 bg-surface p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-1 flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center border border-danger/40 bg-danger/10 text-danger">
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </span>
                    <h3 className="font-display text-xl text-cream">ELIMINAR SORTEO</h3>
                </div>
                <p className="mb-1 mt-3 text-sm text-content">
                    ¿Estás seguro de que quieres eliminar{' '}
                    <span className="font-semibold text-cream">"{sorteo.nombre}"</span>?
                </p>
                <p className="text-xs text-muted">Esta acción no se puede deshacer.</p>
                <div className="mt-5 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="border border-gold/30 px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-gold hover:text-cream"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="bg-danger px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-danger-dark"
                    >
                        Sí, eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SorteosIndex({ sorteos }) {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    function toggleEstado(sorteo) {
        router.patch(`/admin/sorteos/${sorteo.id}/toggle-estado`, {}, { preserveScroll: true });
    }

    function destroy(sorteo) {
        setDeleteTarget(sorteo);
    }

    function confirmDelete() {
        router.delete(`/admin/sorteos/${deleteTarget.id}`, { preserveScroll: true });
        setDeleteTarget(null);
    }

    return (
        <AdminLayout>
            {deleteTarget && (
                <ConfirmDeleteModal
                    sorteo={deleteTarget}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {toast && (
                <div className={`fixed right-4 top-4 z-50 border border-gold/30 bg-surface px-4 py-3 text-sm text-cream shadow-xl ${
                    toast.type === 'success' ? 'border-l-4 border-l-success' : 'border-l-4 border-l-danger'
                }`}>
                    {toast.msg}
                </div>
            )}

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="font-display text-4xl text-cream">SORTEOS</h1>
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/sorteos/create')}
                        className="bg-gold px-4 py-2 text-sm font-bold uppercase tracking-wider text-bg transition-colors hover:bg-gold-light"
                    >
                        + Nuevo sorteo
                    </button>
                </div>

                <div className="overflow-hidden border border-gold/20 bg-surface">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface2 text-left">
                                    {['Nombre','Tipo','Fecha','Precio','Participantes','Estado','Acciones'].map((h, i) => (
                                        <th key={h} className={`px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted ${
                                            i === 1 ? 'hidden sm:table-cell' :
                                            i === 2 ? 'hidden md:table-cell' :
                                            i === 3 ? 'hidden lg:table-cell' :
                                            i === 4 ? 'hidden xl:table-cell' :
                                            i === 6 ? 'text-right' : ''
                                        }`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sorteos.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-muted">
                                            No hay sorteos creados aún.
                                        </td>
                                    </tr>
                                ) : (
                                    sorteos.map((s) => (
                                        <tr key={s.id} className="border-b border-gold/10 transition-colors hover:bg-surface2/50">
                                            <td className="px-4 py-3 font-medium text-cream">{s.nombre}</td>
                                            <td className="hidden px-4 py-3 text-content sm:table-cell">
                                                {TIPO_LABEL[s.tipo] ?? s.tipo}
                                            </td>
                                            <td className="hidden px-4 py-3 text-content md:table-cell">
                                                {new Date(s.fecha_sorteo).toLocaleString('es-PE', {
                                                    dateStyle: 'short', timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="hidden px-4 py-3 text-content lg:table-cell">
                                                S/ {Number(s.precio_participacion).toFixed(2)}
                                            </td>
                                            <td className="hidden px-4 py-3 text-content xl:table-cell">
                                                {s.participantes_count}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${ESTADO_BADGE[s.estado] ?? ''}`}>
                                                    {s.estado}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => router.visit(`/admin/sorteos/${s.id}/edit`)}
                                                        className="border border-gold/30 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-gold hover:text-cream"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => router.visit(`/admin/sorteos/${s.id}/premios`)}
                                                        className="border border-gold/30 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-gold hover:text-cream"
                                                    >
                                                        Premios
                                                    </button>
                                                    {TOGGLE_LABEL[s.estado] && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleEstado(s)}
                                                            className="bg-gold px-2.5 py-1 text-xs font-bold uppercase text-bg transition-colors hover:bg-gold-light"
                                                        >
                                                            {TOGGLE_LABEL[s.estado]}
                                                        </button>
                                                    )}
                                                    {(s.estado === 'borrador' || s.participantes_count === 0) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => destroy(s)}
                                                            className="border border-danger/30 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger hover:text-white"
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
