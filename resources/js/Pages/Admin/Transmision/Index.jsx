import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const ESTADOS = [
    {
        value:       'sin_transmision',
        label:       'Sin transmisión',
        descripcion: 'La sección de transmisión no aparece en la web.',
        color:       'muted',
        icon:        IconOff,
    },
    {
        value:       'proximamente',
        label:       'Próximamente',
        descripcion: 'Se oculta el card de stream. Usa el mensaje del hero para anunciar la fecha.',
        color:       'gold',
        icon:        IconClock,
    },
    {
        value:       'en_vivo',
        label:       'En vivo',
        descripcion: 'Se muestra el card de transmisión con el enlace al live de Facebook.',
        color:       'danger',
        icon:        IconLive,
    },
];

const ESTADO_STYLES = {
    sin_transmision: {
        active:   'border-muted/60 bg-surface2 text-cream',
        inactive: 'border-gold/10 text-muted hover:border-gold/30 hover:text-content',
        dot:      'bg-muted',
        accent:   'border-l-muted',
    },
    proximamente: {
        active:   'border-gold bg-gold/10 text-gold',
        inactive: 'border-gold/10 text-muted hover:border-gold/30 hover:text-content',
        dot:      'bg-gold',
        accent:   'border-l-gold',
    },
    en_vivo: {
        active:   'border-danger bg-danger/10 text-danger',
        inactive: 'border-gold/10 text-muted hover:border-gold/30 hover:text-content',
        dot:      'bg-danger animate-pulse',
        accent:   'border-l-danger',
    },
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

    const estadoActivo  = ESTADOS.find((e) => e.value === data.estado_stream);
    const styles        = ESTADO_STYLES[data.estado_stream];
    const isLive        = data.estado_stream === 'en_vivo';
    const isProximamente = data.estado_stream === 'proximamente';

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
                <h1 className="font-display text-4xl text-cream">TRANSMISIÓN</h1>

                <form onSubmit={submit} className="space-y-6">

                    {/* ── Selector de estado ── */}
                    <section className="border border-gold/20 bg-surface p-5">
                        <p className="mb-4 text-[10px] font-medium uppercase tracking-widest text-muted">
                            Estado actual
                        </p>
                        <div className="flex flex-col gap-2">
                            {ESTADOS.map(({ value, label, descripcion, icon: Icon }) => {
                                const active = data.estado_stream === value;
                                const s = ESTADO_STYLES[value];
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setData('estado_stream', value)}
                                        className={[
                                            'flex items-center gap-4 border p-4 text-left transition-colors',
                                            active ? s.active : s.inactive,
                                        ].join(' ')}
                                    >
                                        <span className={[
                                            'flex size-9 shrink-0 items-center justify-center border',
                                            active ? 'border-current bg-current/10' : 'border-gold/20 bg-surface2',
                                        ].join(' ')}>
                                            <Icon className={`size-4 ${active ? 'text-current' : 'text-muted'}`} />
                                        </span>
                                        <span className="flex-1">
                                            <span className="flex items-center gap-2">
                                                <span className="text-sm font-semibold">{label}</span>
                                                {active && (
                                                    <span className={`size-1.5 rounded-full ${s.dot}`} />
                                                )}
                                            </span>
                                            <span className="mt-0.5 block text-xs opacity-60">{descripcion}</span>
                                        </span>
                                        <span className={[
                                            'size-4 shrink-0 rounded-full border-2 transition-colors',
                                            active ? 'border-current bg-current' : 'border-gold/30',
                                        ].join(' ')} />
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* ── URL contextual ── */}
                    {!isProximamente && (
                        <section className={`border-l-4 bg-surface p-5 ${styles.accent} border border-gold/20`}>
                            {isLive ? (
                                <>
                                    <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-muted">
                                        Enlace al live de Facebook
                                    </p>
                                    <p className="mb-3 text-xs text-muted">
                                        Pega la URL del video que está transmitiendo ahora. El card en la web redirigirá aquí.
                                    </p>
                                    <input
                                        type="url"
                                        value={data.url_stream_live}
                                        onChange={(e) => setData('url_stream_live', e.target.value)}
                                        placeholder="https://www.facebook.com/username/videos/..."
                                        className={inputCls(errors.url_stream_live)}
                                    />
                                    {errors.url_stream_live && (
                                        <p className="mt-1 text-xs text-danger">{errors.url_stream_live}</p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-muted">
                                        Enlace a la última grabación{' '}
                                        <span className="normal-case tracking-normal opacity-60">(opcional)</span>
                                    </p>
                                    <p className="mb-3 text-xs text-muted">
                                        Si hay URL, se mostrará el card de "Última transmisión" en la web. Sin URL, la sección no aparece.
                                    </p>
                                    <input
                                        type="url"
                                        value={data.url_stream_grabado}
                                        onChange={(e) => setData('url_stream_grabado', e.target.value)}
                                        placeholder="https://www.facebook.com/username/videos/..."
                                        className={inputCls(errors.url_stream_grabado)}
                                    />
                                    {errors.url_stream_grabado && (
                                        <p className="mt-1 text-xs text-danger">{errors.url_stream_grabado}</p>
                                    )}
                                </>
                            )}
                        </section>
                    )}

                    {/* ── Mensaje del hero ── */}
                    <section className="border border-gold/20 bg-surface p-5">
                        <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-muted">
                            Mensaje del hero{' '}
                            <span className="normal-case tracking-normal opacity-60">(opcional)</span>
                        </p>
                        <p className="mb-3 text-xs text-muted">
                            Aparece debajo del título principal en la página de inicio. Útil para anunciar fechas o novedades.
                        </p>
                        <textarea
                            value={data.mensaje_destacado}
                            onChange={(e) => setData('mensaje_destacado', e.target.value)}
                            rows={3}
                            maxLength={500}
                            placeholder="Ej. ¡Próximo sorteo el sábado a las 8pm! Inscríbete ahora."
                            className={inputCls(errors.mensaje_destacado) + ' resize-none'}
                        />
                        <p className="mt-1 text-right text-xs text-muted">
                            {data.mensaje_destacado.length}/500
                        </p>
                        {errors.mensaje_destacado && (
                            <p className="mt-1 text-xs text-danger">{errors.mensaje_destacado}</p>
                        )}
                    </section>

                    {/* ── Resumen de lo que verá el público ── */}
                    <div className={`flex items-start gap-3 border-l-4 bg-surface2 px-4 py-3 text-xs text-muted ${styles.accent}`}>
                        <IconInfo className="mt-0.5 size-4 shrink-0 text-gold/60" />
                        <span>
                            <strong className="font-semibold text-cream">Lo que verá el público: </strong>
                            {publicPreviewText(data)}
                        </span>
                    </div>

                    <div className="flex justify-end">
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

function publicPreviewText(data) {
    const { estado_stream, url_stream_live, url_stream_grabado, mensaje_destacado } = data;
    const partes = [];

    if (estado_stream === 'en_vivo' && url_stream_live) {
        partes.push('card de transmisión EN VIVO con enlace al live');
    } else if (estado_stream === 'en_vivo' && !url_stream_live) {
        partes.push('estado "En vivo" sin URL — el card no mostrará el enlace');
    } else if (estado_stream === 'sin_transmision' && url_stream_grabado) {
        partes.push('card de "Última transmisión" con la grabación');
    } else {
        partes.push('sin card de transmisión');
    }

    if (mensaje_destacado) partes.push('mensaje destacado en el hero');

    return partes.join(' · ') + '.';
}

function inputCls(error) {
    return [
        'w-full border bg-surface2 px-3 py-2.5 text-sm text-cream placeholder-muted outline-none transition-colors',
        error ? 'border-danger' : 'border-gold/20 focus:border-gold',
    ].join(' ');
}

/* ── Iconos ── */
function IconOff({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M6.343 6.343L4.929 4.929M19.07 4.929l-1.414 1.414M4.929 19.07l1.414-1.414M6.343 17.657a5 5 0 010-7.072M3 12H1m22 0h-2" />
        </svg>
    );
}

function IconClock({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function IconLive({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
            <path strokeLinecap="round" d="M6.343 6.343a8 8 0 000 11.314M17.657 6.343a8 8 0 010 11.314" />
            <path strokeLinecap="round" d="M3.515 3.515a13 13 0 000 16.97M20.485 3.515a13 13 0 010 16.97" opacity="0.4" />
        </svg>
    );
}

function IconInfo({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}
