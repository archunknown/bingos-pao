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
                        <DateTimePicker
                            value={data.fecha_sorteo}
                            onChange={(v) => setData('fecha_sorteo', v)}
                            error={errors.fecha_sorteo}
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

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const HORAS_DISPLAY = Array.from({ length: 24 }, (_, i) => {
    const h = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    return { value: i, label: `${String(h).padStart(2, '0')}:00 ${ampm}` };
});
const MINUTOS_DISPLAY = [0, 15, 30, 45].map((m) => ({
    value: m, label: String(m).padStart(2, '0'),
}));

function DateTimePicker({ value, onChange, error }) {
    const pad = (n) => String(n).padStart(2, '0');

    function parseParts(v) {
        if (!v) return { year: '', month: '', day: '', hour: 10, minute: 0 };
        const [datePart, timePart] = v.split('T');
        const [y, mo, d] = (datePart || '').split('-');
        const [h, mi] = (timePart || '10:00').split(':');
        return { year: y || '', month: mo || '', day: d || '', hour: parseInt(h) || 10, minute: parseInt(mi) || 0 };
    }

    const init = parseParts(value);
    // Local state — intermediate selections survive re-renders without onChange being called
    const [year,   setYear]   = useState(init.year);
    const [month,  setMonth]  = useState(init.month);
    const [day,    setDay]    = useState(init.day);
    const [hour,   setHour]   = useState(init.hour);
    const [minute, setMinute] = useState(init.minute);

    function emit(y, mo, d, h, mi) {
        if (y && mo && d) {
            onChange(`${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}`);
        }
    }

    // Mañana como fecha mínima
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const minYear  = tomorrow.getFullYear();
    const minMonth = tomorrow.getMonth() + 1;
    const minDay   = tomorrow.getDate();

    const selYear  = parseInt(year)  || 0;
    const selMonth = parseInt(month) || 0;

    const daysInMonth = selYear && selMonth
        ? new Date(selYear, selMonth, 0).getDate()
        : 31;

    const selectCls = error
        ? 'w-full border border-danger bg-surface2 px-3 py-2.5 text-sm text-cream outline-none transition-colors'
        : 'w-full border border-gold/20 bg-surface2 px-3 py-2.5 text-sm text-cream outline-none transition-colors focus:border-gold';

    return (
        <div className="space-y-3">
            {/* Año / Mes / Día */}
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <p className="mb-1 text-[9px] uppercase tracking-widest text-muted">Año</p>
                    <select
                        value={year}
                        onChange={(e) => {
                            setYear(e.target.value);
                            setMonth('');
                            setDay('');
                        }}
                        className={selectCls}
                    >
                        <option value="">—</option>
                        {[minYear, minYear + 1, minYear + 2].map((y) => (
                            <option key={y} value={String(y)}>{y}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <p className="mb-1 text-[9px] uppercase tracking-widest text-muted">Mes</p>
                    <select
                        value={month}
                        disabled={!year}
                        onChange={(e) => {
                            setMonth(e.target.value);
                            setDay('');
                        }}
                        className={selectCls + ' disabled:opacity-40'}
                    >
                        <option value="">—</option>
                        {MESES.map((nombre, i) => {
                            const mNum = i + 1;
                            const disabled = selYear === minYear && mNum < minMonth;
                            return (
                                <option key={mNum} value={pad(mNum)} disabled={disabled}>
                                    {nombre}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div>
                    <p className="mb-1 text-[9px] uppercase tracking-widest text-muted">Día</p>
                    <select
                        value={day}
                        disabled={!year || !month}
                        onChange={(e) => {
                            setDay(e.target.value);
                            emit(year, month, e.target.value, hour, minute);
                        }}
                        className={selectCls + ' disabled:opacity-40'}
                    >
                        <option value="">—</option>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                            const beforeMin = selYear === minYear && selMonth === minMonth && d < minDay;
                            return (
                                <option key={d} value={pad(d)} disabled={beforeMin}>
                                    {d}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Hora / Minutos */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <p className="mb-1 text-[9px] uppercase tracking-widest text-muted">Hora</p>
                    <select
                        value={hour}
                        onChange={(e) => {
                            const h = parseInt(e.target.value);
                            setHour(h);
                            emit(year, month, day, h, minute);
                        }}
                        className={selectCls}
                    >
                        {HORAS_DISPLAY.map(({ value: v, label: l }) => (
                            <option key={v} value={v}>{l}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <p className="mb-1 text-[9px] uppercase tracking-widest text-muted">Minutos</p>
                    <select
                        value={minute}
                        onChange={(e) => {
                            const mi = parseInt(e.target.value);
                            setMinute(mi);
                            emit(year, month, day, hour, mi);
                        }}
                        className={selectCls}
                    >
                        {MINUTOS_DISPLAY.map(({ value: v, label: l }) => (
                            <option key={v} value={v}>{l}</option>
                        ))}
                    </select>
                </div>
            </div>

            {year && month && day && (
                <p className="text-xs text-muted">
                    Seleccionado:{' '}
                    <span className="font-medium text-gold">
                        {parseInt(day)} de {MESES[parseInt(month) - 1]} de {year},{' '}
                        {HORAS_DISPLAY.find((h) => h.value === hour)?.label}
                    </span>
                </p>
            )}
        </div>
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
