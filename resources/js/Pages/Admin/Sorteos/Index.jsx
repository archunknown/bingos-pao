import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const TIPO_LABEL = {
    bingo: 'Bingo', pozito: 'Pozito', especial: 'Especial', aniversario: 'Aniversario',
};

const BORDER_ESTADO = {
    activo:   'border-l-success',
    borrador: 'border-l-muted/30',
    cerrado:  'border-l-danger/40',
};

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

function EstadoBadge({ estado }) {
    if (estado === 'activo') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-success border border-success/20">
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                Activo
            </span>
        );
    }
    if (estado === 'borrador') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface2 px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted border border-muted/20">
                <span className="size-1.5 rounded-full bg-muted/60" />
                Borrador
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-danger/70 border border-danger/20 line-through decoration-danger/40">
            Cerrado
        </span>
    );
}

export default function SorteosIndex({ sorteos }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    function toggleEstado(sorteo) {
        router.patch(`/admin/sorteos/${sorteo.id}/toggle-estado`, {}, { preserveScroll: true });
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

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="font-display text-4xl text-cream">SORTEOS</h1>
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/sorteos/create')}
                        className="flex items-center gap-2 bg-gold px-4 py-2 text-sm font-bold uppercase tracking-wider text-bg transition-colors hover:bg-gold-light"
                    >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo sorteo
                    </button>
                </div>

                <div className="overflow-hidden border border-gold/20 bg-surface">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface2 text-left">
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">Nombre</th>
                                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted sm:table-cell">Tipo</th>
                                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted md:table-cell">Fecha</th>
                                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted lg:table-cell">Precio</th>
                                    <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted xl:table-cell">Participantes</th>
                                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">Estado</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-widest text-muted">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sorteos.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-muted">
                                                <svg className="size-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2zm-6 5h6m-6 3h4" />
                                                </svg>
                                                <p className="text-sm font-medium">No hay sorteos creados aún</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    sorteos.map((s) => (
                                        <tr
                                            key={s.id}
                                            className={[
                                                'border-b border-gold/10 border-l-2 transition-colors duration-150 hover:bg-surface2',
                                                BORDER_ESTADO[s.estado] ?? 'border-l-transparent',
                                            ].join(' ')}
                                        >
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
                                                <EstadoBadge estado={s.estado} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => router.visit(`/admin/sorteos/${s.id}/edit`)}
                                                        className="border border-gold/30 px-2.5 py-1 text-xs font-medium text-muted transition-colors duration-150 hover:border-gold hover:text-cream"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => router.visit(`/admin/sorteos/${s.id}/premios`)}
                                                        className="border border-gold/30 px-2.5 py-1 text-xs font-medium text-muted transition-colors duration-150 hover:border-gold hover:text-cream"
                                                    >
                                                        Premios
                                                    </button>
                                                    {s.estado === 'borrador' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleEstado(s)}
                                                            className="bg-success px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:opacity-90"
                                                        >
                                                            Activar
                                                        </button>
                                                    )}
                                                    {s.estado === 'activo' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleEstado(s)}
                                                            className="border border-danger/50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-danger transition-colors duration-150 hover:bg-danger hover:text-white"
                                                        >
                                                            Cerrar
                                                        </button>
                                                    )}
                                                    {(s.estado === 'borrador' || s.participantes_count === 0) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeleteTarget(s)}
                                                            className="border border-danger/30 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger transition-colors duration-150 hover:bg-danger hover:text-white"
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
