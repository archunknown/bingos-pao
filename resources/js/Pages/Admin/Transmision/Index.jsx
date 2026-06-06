import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const ESTADOS_STREAM = [
    { value: 'sin_transmision', label: 'Sin transmisión' },
    { value: 'en_vivo',         label: 'En vivo ahora' },
    { value: 'proximamente',    label: 'Próximamente' },
];

const ESTADO_BADGE = {
    en_vivo:         'bg-red-500/20    text-red-300    border-red-500/30',
    sin_transmision: 'bg-slate-500/20  text-slate-400  border-slate-500/30',
    proximamente:    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

export default function TransmisionIndex({ config }) {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    const { data, setData, post, processing, errors } = useForm({
        url_stream_live:    config.url_stream_live    ?? '',
        url_stream_grabado: config.url_stream_grabado ?? '',
        estado_stream:      config.estado_stream      || 'sin_transmision',
        mensaje_destacado:  config.mensaje_destacado  ?? '',
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/transmision');
    }

    const estadoActual = ESTADOS_STREAM.find((e) => e.value === data.estado_stream);

    return (
        <AdminLayout>
            {toast && (
                <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
                    toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {toast.msg}
                </div>
            )}

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <h1 className="font-[BebasNeue,sans-serif] text-3xl tracking-wide text-white">
                        Transmisión
                    </h1>
                    {estadoActual && (
                        <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${ESTADO_BADGE[data.estado_stream] ?? ''}`}>
                            {estadoActual.label}
                        </span>
                    )}
                </div>

                <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-700 bg-slate-800 p-6">

                    {/* Estado del stream */}
                    <Field label="Estado de transmisión" error={errors.estado_stream}>
                        <div className="grid grid-cols-3 gap-2">
                            {ESTADOS_STREAM.map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setData('estado_stream', value)}
                                    className={[
                                        'rounded-lg border py-2.5 text-sm font-medium transition-colors',
                                        data.estado_stream === value
                                            ? 'border-pink-500 bg-pink-600 text-white'
                                            : 'border-slate-600 text-slate-400 hover:border-slate-400 hover:text-white',
                                    ].join(' ')}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </Field>

                    {/* URL en vivo */}
                    <Field label="URL transmisión en vivo" error={errors.url_stream_live}>
                        <input
                            type="url"
                            value={data.url_stream_live}
                            onChange={(e) => setData('url_stream_live', e.target.value)}
                            placeholder="https://www.facebook.com/live/..."
                            className={inputCls(errors.url_stream_live)}
                        />
                    </Field>

                    {/* URL grabada */}
                    <Field label="URL última transmisión grabada" error={errors.url_stream_grabado}>
                        <input
                            type="url"
                            value={data.url_stream_grabado}
                            onChange={(e) => setData('url_stream_grabado', e.target.value)}
                            placeholder="https://www.facebook.com/watch/..."
                            className={inputCls(errors.url_stream_grabado)}
                        />
                    </Field>

                    {/* Mensaje destacado */}
                    <Field label="Mensaje destacado" error={errors.mensaje_destacado}>
                        <textarea
                            value={data.mensaje_destacado}
                            onChange={(e) => setData('mensaje_destacado', e.target.value)}
                            rows={3}
                            maxLength={500}
                            placeholder="Ej. ¡El próximo sorteo es el sábado a las 8pm! Inscríbete ahora."
                            className={inputCls(errors.mensaje_destacado) + ' resize-none'}
                        />
                        <p className="text-right text-xs text-slate-500">
                            {data.mensaje_destacado.length}/500
                        </p>
                    </Field>

                    {/* Guardar */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-pink-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-pink-700 disabled:opacity-50"
                        >
                            {processing ? 'Guardando…' : 'Guardar configuración'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
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
