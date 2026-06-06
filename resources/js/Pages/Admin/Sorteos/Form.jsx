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

    // Inertia useForm para manejo de estado + errores + processing
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
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
                        toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}
                >
                    {toast.msg}
                </div>
            )}

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Encabezado */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/sorteos')}
                        className="text-slate-400 hover:text-white"
                        aria-label="Volver"
                    >
                        ←
                    </button>
                    <h1 className="font-[BebasNeue,sans-serif] text-3xl tracking-wide text-white">
                        {editing ? 'Editar sorteo' : 'Nuevo sorteo'}
                    </h1>
                </div>

                {/* Formulario */}
                <form
                    onSubmit={submit}
                    className="space-y-5 rounded-xl border border-slate-700 bg-slate-800 p-6"
                >
                    {/* Nombre */}
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

                    {/* Tipo */}
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

                    {/* Fecha y hora */}
                    <Field label="Fecha y hora del sorteo" error={errors.fecha_sorteo}>
                        <input
                            type="datetime-local"
                            value={data.fecha_sorteo}
                            onChange={(e) => setData('fecha_sorteo', e.target.value)}
                            className={inputCls(errors.fecha_sorteo)}
                        />
                    </Field>

                    {/* Precio */}
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

                    {/* Descripción */}
                    <Field label="Descripción (opcional)" error={errors.descripcion}>
                        <textarea
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            rows={4}
                            placeholder="Detalles del sorteo, premios, instrucciones…"
                            className={inputCls(errors.descripcion) + ' resize-none'}
                        />
                    </Field>

                    {/* Acciones */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.visit('/admin/sorteos')}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 ring-1 ring-slate-600 transition-colors hover:bg-slate-700 hover:text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-pink-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-700 disabled:opacity-50"
                        >
                            {processing ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear sorteo'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

/* Convierte ISO datetime a formato requerido por datetime-local input */
function toLocalInput(iso) {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
