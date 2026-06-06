import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const TIPOS = [
    { value: 'bingo',       label: 'Bingo' },
    { value: 'pozito',      label: 'Pozito' },
    { value: 'especial',    label: 'Especial' },
    { value: 'aniversario', label: 'Aniversario' },
];

export default function SorteoForm({ sorteo }) {
    const { flash } = usePage().props;
    const editing = !!sorteo;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    const { data, setData, post, put, processing, errors } = useForm({
        nombre:               sorteo?.nombre               ?? '',
        tipo:                 sorteo?.tipo                 ?? 'bingo',
        fecha_sorteo:         sorteo?.fecha_sorteo         ? toLocalInput(sorteo.fecha_sorteo) : '',
        precio_participacion: sorteo?.precio_participacion ?? '',
        descripcion:          sorteo?.descripcion          ?? '',
    });

    function submit(e) {
        e.preventDefault();
        if (editing) {
            put(`/admin/sorteos/${sorteo.id}`);
        } else {
            post('/admin/sorteos');
        }
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

            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/sorteos')}
                        className="text-muted transition-colors hover:text-cream"
                        aria-label="Volver"
                    >
                        ←
                    </button>
                    <h1 className="font-display text-4xl text-cream">
                        {editing ? 'EDITAR SORTEO' : 'NUEVO SORTEO'}
                    </h1>
                </div>

                <form onSubmit={submit} className="space-y-5 border border-gold/20 bg-surface p-6">
                    <Field label="Nombre" error={errors.nombre}>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            maxLength={200}
                            placeholder="Ej. Gran Bingo de Navidad"
                            className={inputCls(errors.nombre)}
                        />
                    </Field>

                    <Field label="Tipo" error={errors.tipo}>
                        <select
                            value={data.tipo}
                            onChange={(e) => setData('tipo', e.target.value)}
                            className={inputCls(errors.tipo)}
                        >
                            {TIPOS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Fecha y hora del sorteo" error={errors.fecha_sorteo}>
                        <input
                            type="datetime-local"
                            value={data.fecha_sorteo}
                            onChange={(e) => setData('fecha_sorteo', e.target.value)}
                            className={inputCls(errors.fecha_sorteo)}
                        />
                    </Field>

                    <Field label="Precio de participación (S/)" error={errors.precio_participacion}>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.precio_participacion}
                            onChange={(e) => setData('precio_participacion', e.target.value)}
                            placeholder="0.00"
                            className={inputCls(errors.precio_participacion)}
                        />
                    </Field>

                    <Field label="Descripción (opcional)" error={errors.descripcion}>
                        <textarea
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            rows={4}
                            placeholder="Detalles del sorteo, premios, instrucciones…"
                            className={inputCls(errors.descripcion) + ' resize-none'}
                        />
                    </Field>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.visit('/admin/sorteos')}
                            className="border border-gold/30 px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-gold hover:text-cream"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-gold px-5 py-2 text-sm font-bold uppercase tracking-wider text-bg transition-colors hover:bg-gold-light disabled:opacity-50"
                        >
                            {processing ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear sorteo'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

function toLocalInput(iso) {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
