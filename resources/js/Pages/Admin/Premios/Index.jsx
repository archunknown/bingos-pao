import AdminLayout from '@/Layouts/AdminLayout';
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function PremiosIndex({ sorteo, premios: premiosIniciales }) {
    const { flash } = usePage().props;
    const [toast, setToast]     = useState(null);
    const [modalOpen, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [premios, setPremios] = useState(premiosIniciales);

    useEffect(() => { setPremios(premiosIniciales); }, [premiosIniciales]);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    function openCreate() { setEditing(null); setModal(true); }
    function openEdit(p)  { setEditing(p);    setModal(true); }
    function closeModal() { setModal(false);   setEditing(null); }

    function toggleVisible(premio) {
        router.patch(`/admin/premios/${premio.id}`, { ...premio, visible: !premio.visible }, { preserveScroll: true });
    }

    function destroy(premio) {
        if (!confirm(`¿Eliminar el premio "${premio.nombre}"?`)) return;
        router.delete(`/admin/premios/${premio.id}`, { preserveScroll: true });
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = premios.findIndex((p) => p.id === active.id);
        const newIndex = premios.findIndex((p) => p.id === over.id);
        const nuevaLista = arrayMove(premios, oldIndex, newIndex);
        setPremios(nuevaLista);

        router.post(
            `/admin/sorteos/${sorteo.id}/premios/reordenar`,
            { orden: nuevaLista.map((p) => p.id) },
            { preserveScroll: true },
        );
    }

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
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <button
                            type="button"
                            onClick={() => router.visit('/admin/sorteos')}
                            className="mb-1 text-sm text-muted transition-colors hover:text-cream"
                        >
                            ← Sorteos
                        </button>
                        <h1 className="font-display text-4xl text-cream">PREMIOS</h1>
                        <p className="mt-0.5 text-sm text-muted">{sorteo.nombre}</p>
                    </div>
                    <button
                        type="button"
                        onClick={openCreate}
                        className="bg-gold px-4 py-2 text-sm font-bold uppercase tracking-wider text-bg transition-colors hover:bg-gold-light"
                    >
                        + Agregar premio
                    </button>
                </div>

                {premios.length === 0 ? (
                    <div className="border border-gold/10 bg-surface px-6 py-12 text-center text-muted">
                        No hay premios aún. Agrega el primero.
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-muted">Arrastra para reordenar</p>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={premios.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-2">
                                    {premios.map((p, i) => (
                                        <SortablePremioCard
                                            key={p.id}
                                            premio={p}
                                            posicion={i + 1}
                                            onEdit={() => openEdit(p)}
                                            onDelete={() => destroy(p)}
                                            onToggleVisible={() => toggleVisible(p)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </>
                )}
            </div>

            {modalOpen && (
                <PremioModal sorteoId={sorteo.id} premio={editing} onClose={closeModal} />
            )}
        </AdminLayout>
    );
}

function SortablePremioCard({ premio, posicion, onEdit, onDelete, onToggleVisible }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: premio.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex:  isDragging ? 10 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-4 border border-gold/20 bg-surface px-4 py-3 transition-colors hover:border-gold/40">
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="shrink-0 cursor-grab touch-none text-gold/40 hover:text-gold active:cursor-grabbing"
                title="Arrastrar para reordenar"
            >
                <IconGrip />
            </button>
            <span className="w-6 shrink-0 text-center text-xs text-muted">{posicion}</span>
            <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-cream">{premio.nombre}</p>
                <p className="text-xs text-muted">
                    Cantidad: {premio.cantidad}
                    {premio.monto != null
                        ? ` · S/ ${Number(premio.monto).toFixed(2)}`
                        : premio.descripcion_premio
                        ? ` · ${premio.descripcion_premio}`
                        : ''}
                </p>
            </div>
            <button
                type="button"
                onClick={onToggleVisible}
                title={premio.visible ? 'Ocultar' : 'Mostrar'}
                className={`shrink-0 border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                    premio.visible
                        ? 'border-success/30 bg-success/10 text-success hover:bg-success/20'
                        : 'border-muted/20 bg-surface2 text-muted hover:text-cream'
                }`}
            >
                {premio.visible ? 'Visible' : 'Oculto'}
            </button>
            <div className="flex shrink-0 gap-2">
                <button
                    type="button"
                    onClick={onEdit}
                    className="border border-gold/30 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-gold hover:text-cream"
                >
                    Editar
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    className="border border-danger/30 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger hover:text-white"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}

function PremioModal({ sorteoId, premio, onClose }) {
    const isEditing = !!premio;
    const overlayRef = useRef(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre:             premio?.nombre             ?? '',
        cantidad:           premio?.cantidad           ?? 1,
        monto:              premio?.monto              ?? '',
        descripcion_premio: premio?.descripcion_premio ?? '',
        visible:            premio?.visible            ?? true,
        orden:              premio?.orden              ?? 0,
    });

    function submit(e) {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/premios/${premio.id}`, { onSuccess: () => { reset(); onClose(); } });
        } else {
            post(`/admin/sorteos/${sorteoId}/premios`, { onSuccess: () => { reset(); onClose(); } });
        }
    }

    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onClose(); }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-40 flex items-center justify-center bg-bg/80 p-4"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div className="w-full max-w-md border border-gold/20 bg-surface p-6 shadow-2xl">
                <h2 className="mb-5 font-display text-2xl text-cream">
                    {isEditing ? 'EDITAR PREMIO' : 'NUEVO PREMIO'}
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

                    <Field label="Cantidad" error={errors.cantidad}>
                        <input
                            type="number"
                            min="1"
                            value={data.cantidad}
                            onChange={(e) => setData('cantidad', Number(e.target.value))}
                            className={inputCls(errors.cantidad)}
                        />
                    </Field>

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
                            className="size-4 accent-gold"
                        />
                        <span className="text-sm text-muted">Visible en la página pública</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-gold/30 px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-gold hover:text-cream"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-gold px-5 py-2 text-sm font-bold uppercase tracking-wider text-bg transition-colors hover:bg-gold-light disabled:opacity-50"
                        >
                            {processing ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function IconGrip() {
    return (
        <svg className="size-4" fill="currentColor" viewBox="0 0 16 16">
            <circle cx="5" cy="4" r="1.2" /><circle cx="11" cy="4" r="1.2" />
            <circle cx="5" cy="8" r="1.2" /><circle cx="11" cy="8" r="1.2" />
            <circle cx="5" cy="12" r="1.2" /><circle cx="11" cy="12" r="1.2" />
        </svg>
    );
}

function inputCls(error) {
    return [
        'w-full border bg-surface2 px-3 py-2.5 text-sm text-cream placeholder-muted outline-none transition-colors',
        error ? 'border-danger' : 'border-gold/20 focus:border-gold',
    ].join(' ');
}

function Field({ label, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-muted">
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-danger">{error}</p>}
        </div>
    );
}
