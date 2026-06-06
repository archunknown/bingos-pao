import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const ESTADOS_STREAM = [
    { value: 'sin_transmision', label: 'Sin transmisión' },
    { value: 'en_vivo',         label: 'En vivo ahora' },
    { value: 'proximamente',    label: 'Próximamente' },
];

const ESTADO_BADGE = {
    en_vivo:         'bg-danger/10 text-danger border-danger/30',
    sin_transmision: 'bg-surface2 text-muted border-muted/20',
    proximamente:    'bg-gold/10 text-gold border-gold/30',
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
                <div className={`fixed right-4 top-4 z-50 border border-gold/30 bg-surface px-4 py-3 text-sm text-cream shadow-xl ${
                    toast.type === 'success' ? 'border-l-4 border-l-success' : 'border-l-4 border-l-danger'
                }`}>
                    {toast.msg}
                </div>
            )}

            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-4xl text-cream">TRANSMISIÓN</h1>
                    {estadoActual && (
                        <span className={`border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${ESTADO_BADGE[data.estado_stream] ?? ''}`}>
                            {estadoActual.label}
                        </span>
                    )}
                </div>

                <form onSubmit={submit} className="space-y-5 border border-gold/20 bg-surface p-6">

                    {/* Estado del stream */}
                    <Field label="Estado de transmisión" error={errors.estado_stream}>
                        <div className="grid grid-cols-3 gap-2">
                            {ESTADOS_STREAM.map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setData('estado_stream', value)}
                                    className={[
                                        'border py-2.5 text-sm font-medium transition-colors',
                                        data.estado_stream === value
                                            ? 'border-gold bg-gold text-bg font-bold'
                                            : 'border-gold/30 text-muted hover:border-gold hover:text-cream',
                                    ].join(' ')}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </Field>

                    <Field label="URL transmisión en vivo" error={errors.url_stream_live}>
                        <input
                            type="url"
                            value={data.url_stream_live}
                            onChange={(e) => setData('url_stream_live', e.target.value)}
                            placeholder="https://www.facebook.com/live/..."
                            className={inputCls(errors.url_stream_live)}
                        />
                    </Field>

                    <Field label="URL última transmisión grabada" error={errors.url_stream_grabado}>
                        <input
                            type="url"
                            value={data.url_stream_grabado}
                            onChange={(e) => setData('url_stream_grabado', e.target.value)}
                            placeholder="https://www.facebook.com/watch/..."
                            className={inputCls(errors.url_stream_grabado)}
                        />
                    </Field>

                    <Field label="Mensaje destacado" error={errors.mensaje_destacado}>
                        <textarea
                            value={data.mensaje_destacado}
                            onChange={(e) => setData('mensaje_destacado', e.target.value)}
                            rows={3}
                            maxLength={500}
                            placeholder="Ej. ¡El próximo sorteo es el sábado a las 8pm! Inscríbete ahora."
                            className={inputCls(errors.mensaje_destacado) + ' resize-none'}
                        />
                        <p className="text-right text-xs text-muted">
                            {data.mensaje_destacado.length}/500
                        </p>
                    </Field>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-gold px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-bg transition-colors hover:bg-gold-light disabled:opacity-50"
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
