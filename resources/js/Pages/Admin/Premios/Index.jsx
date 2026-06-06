import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function PremiosIndex({ sorteo, premios }) {
    const { flash } = usePage().props;

    const [toast, setToast]       = useState(null);
    const [modalOpen, setModal]   = useState(false);
    const [editing, setEditing]   = useState(null); // premio object | null

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    function openCreate() {
        setEditing(null);
        setModal(true);
    }

    function openEdit(premio) {
        setEditing(premio);
        setModal(true);
    }

    function closeModal() {
        setModal(false);
        setEditing(null);
    }

    function toggleVisible(premio) {
        router.patch(
            `/admin/premios/${premio.id}`,
            { ...premio, visible: !premio.visible },
            { preserveScroll: true },
        );
    }

    function destroy(premio) {
        if (!confirm(`¿Eliminar el premio "${premio.nombre}"?`)) return;
        router.delete(`/admin/premios/${premio.id}`, { preserveScroll: true });
    }

    return (
        <AdminLayout>
            {/* Toast */}
            {toast && (
                <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
                    toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {toast.msg}
                </div>
            )}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <button
                            type="button"
                            onClick={() => router.visit('/admin/sorteos')}
                            className="mb-1 text-sm text-slate-400 hover:text-white"
                        >
                            ← Sorteos
                        </button>
                        <h1 className="font-[BebasNeue,sans-serif] text-3xl tracking-wide text-white">
                            Premios
                        </h1>
                        <p className="mt-0.5 text-sm text-slate-400">{sorteo.nombre}</p>
                    </div>
                    <button
                        type="button"
                        onClick={openCreate}
                        className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-700"
                    >
                        + Agregar premio
                    </button>
                </div>

                {/* Lista de premios */}
                {premios.length === 0 ? (
                    <div className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-12 text-center text-slate-500">
                        No hay premios aún. Agrega el primero.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {premios.map((p) => (
                            <PremioCard
                                key={p.id}
                                premio={p}
                                onEdit={() => openEdit(p)}
                                onDelete={() => destroy(p)}
                                onToggleVisible={() => toggleVisible(p)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal crear/editar */}
            {modalOpen && (
                <PremioModal
                    sorteoId={sorteo.id}
                    premio={editing}
                    onClose={closeModal}
                />
            )}
        </AdminLayout>
    );
}

/* ── Tarjeta de premio ── */
function PremioCard({ premio, onEdit, onDelete, onToggleVisible }) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
            {/* Orden */}
            <span className="w-8 shrink-0 text-center text-xs font-bold text-slate-500">
                #{premio.orden}
            </span>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-white">{premio.nombre}</p>
                <p className="text-xs text-slate-400">
                    Cantidad: {premio.cantidad}
                    {premio.monto != null
                        ? ` · S/ ${Number(premio.monto).toFixed(2)}`
                        : premio.descripcion_premio
                        ? ` · ${premio.descripcion_premio}`
                        : ''}
                </p>
            </div>

            {/* Toggle visible */}
            <button
                type="button"
                onClick={onToggleVisible}
                title={premio.visible ? 'Ocultar' : 'Mostrar'}
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                    premio.visible
                        ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                        : 'bg-slate-600/40 text-slate-400 hover:bg-slate-600'
                }`}
            >
                {premio.visible ? 'Visible' : 'Oculto'}
            </button>

            {/* Acciones */}
            <div className="flex shrink-0 gap-2">
                <button
                    type="button"
                    onClick={onEdit}
                    className="rounded px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-600 transition-colors hover:bg-slate-700 hover:text-white"
                >
                    Editar
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    className="rounded px-2.5 py-1 text-xs font-medium text-red-400 ring-1 ring-red-700 transition-colors hover:bg-red-700 hover:text-white"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}

/* ── Modal de formulario ── */
function PremioModal({ sorteoId, premio, onClose }) {
    const isEditing = !!premio;
    const overlayRef = useRef(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre:            premio?.nombre            ?? '',
        cantidad:          premio?.cantidad          ?? 1,
        monto:             premio?.monto             ?? '',
        descripcion_premio: premio?.descripcion_premio ?? '',
        visible:           premio?.visible           ?? true,
        orden:             premio?.orden             ?? 0,
    });

    function submit(e) {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/premios/${premio.id}`, {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post(`/admin/sorteos/${sorteoId}/premios`, {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    }

    // Cerrar con Escape
    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onClose(); }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
                <h2 className="mb-5 font-[BebasNeue,sans-serif] text-2xl tracking-wide text-white">
                    {isEditing ? 'Editar premio' : 'Nuevo premio'}
                </h2>

                <form onSubmit={submit} className="space-y-4">
                    <Field label="Nombre" error={errors.nombre}>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            maxLength={100}
                            className={inputCls(errors.nombre)}
                            autoFocus
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Cantidad" error={errors.cantidad}>
                            <input
                                type="number"
                                min="1"
                                value={data.cantidad}
                                onChange={(e) => setData('cantidad', Number(e.target.value))}
                                className={inputCls(errors.cantidad)}
                            />
                        </Field>
                        <Field label="Orden" error={errors.orden}>
                            <input
                                type="number"
                                min="0"
                                value={data.orden}
                                onChange={(e) => setData('orden', Number(e.target.value))}
                                className={inputCls(errors.orden)}
                            />
                        </Field>
                    </div>

                    <Field label="Monto S/ (opcional)" error={errors.monto}>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.monto}
                            onChange={(e) => setData('monto', e.target.value)}
                            placeholder="0.00"
                            className={inputCls(errors.monto)}
                        />
                    </Field>

                    <Field label="Descripción (si no hay monto)" error={errors.descripcion_premio}>
                        <input
                            type="text"
                            value={data.descripcion_premio}
                            onChange={(e) => setData('descripcion_premio', e.target.value)}
                            maxLength={200}
                            placeholder="Ej. Canasta navideña"
                            className={inputCls(errors.descripcion_premio)}
                        />
                    </Field>

                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.visible}
                            onChange={(e) => setData('visible', e.target.checked)}
                            className="size-4 rounded accent-pink-500"
                        />
                        <span className="text-sm text-slate-300">Visible en la página pública</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 ring-1 ring-slate-600 transition-colors hover:bg-slate-700 hover:text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-pink-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-700 disabled:opacity-50"
                        >
                            {processing ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function inputCls(error) {
    return [
        'w-full rounded-lg border bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:ring-2 focus:ring-pink-500',
        error ? 'border-red-500' : 'border-slate-600',
    ].join(' ');
}

function Field({ label, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}
