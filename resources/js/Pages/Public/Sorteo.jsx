import PublicLayout from '@/Layouts/PublicLayout';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const TIPO_LABEL = {
    bingo: 'BINGO', pozito: 'POZITO', especial: 'ESPECIAL', aniversario: 'ANIVERSARIO',
};

const PASOS = [
    { n: '1', texto: 'Elige el monto y realiza el pago por Yape o Plin al titular indicado.' },
    { n: '2', texto: 'Toma una captura de pantalla del comprobante de pago.' },
    { n: '3', texto: 'Completa el formulario con tus datos y sube la captura.' },
    { n: '4', texto: 'Espera la confirmación. Te avisaremos por WhatsApp y verás el resultado en el sorteo en vivo.' },
];

export default function SorteoPublico({ sorteo, config }) {
    const countdown = useCountdown(sorteo.fecha_sorteo);
    const [enviado, setEnviado] = useState(false);

    return (
        <PublicLayout>
            {/* Header — fade in */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="border-b border-gold/20 bg-surface2 px-4 py-10 md:py-14"
            >
                <div className="mx-auto max-w-5xl">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="bg-gold px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-bg">
                            {TIPO_LABEL[sorteo.tipo] ?? sorteo.tipo.toUpperCase()}
                        </span>
                    </div>

                    <h1 className="font-display text-5xl leading-none text-cream md:text-7xl">
                        {sorteo.nombre}
                    </h1>

                    <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                        <IconCalendar />
                        {new Date(sorteo.fecha_sorteo).toLocaleString('es-PE', {
                            dateStyle: 'full', timeStyle: 'short',
                        })}
                    </p>

                    {/* Countdown compacto — 3 unidades */}
                    {countdown && !countdown.expired && (
                        <div className="mt-6 inline-flex items-center gap-1.5">
                            {buildUnits(countdown).map(({ v, l }, i, arr) => (
                                <div key={l} className="flex items-center gap-1.5">
                                    <div className="flex flex-col items-center border border-gold/30 bg-bg px-3 py-2">
                                        <span className="font-display text-4xl leading-none text-gold">
                                            {String(v).padStart(2, '0')}
                                        </span>
                                        <span className="mt-1 text-[9px] uppercase tracking-widest text-muted">{l}</span>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <span className="font-display text-2xl text-gold/50">:</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {countdown?.expired && (
                        <p className="mt-4 font-display text-2xl tracking-widest text-gold">
                            ¡EL SORTEO ESTÁ EN CURSO!
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Contenido principal */}
            <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
                <div className="grid gap-8 lg:grid-cols-2">

                    {/* Columna izquierda — slide desde la izquierda */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
                        className="space-y-6"
                    >
                        {/* Premios */}
                        {sorteo.premios?.length > 0 && (
                            <section className="border border-gold/20 bg-surface">
                                <div className="border-b border-gold/10 px-5 py-4">
                                    <h2 className="border-l-4 border-gold pl-3 font-display text-3xl text-gold">
                                        PREMIOS
                                    </h2>
                                </div>
                                <ul className="divide-y divide-gold/10">
                                    {sorteo.premios.map((p) => (
                                        <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                                            {p.cantidad > 1 && (
                                                <span className="shrink-0 border border-gold/30 bg-gold/10 px-1.5 py-0.5 text-[10px] font-bold text-gold">
                                                    ×{p.cantidad}
                                                </span>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-cream">{p.nombre}</p>
                                                {p.descripcion_premio && (
                                                    <p className="text-xs text-muted">{p.descripcion_premio}</p>
                                                )}
                                            </div>
                                            {p.monto != null && (
                                                <span className="shrink-0 font-bold text-gold">
                                                    S/ {Number(p.monto).toFixed(2)}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Instrucciones */}
                        <section className="border border-gold/20 bg-surface px-5 py-5">
                            <h2 className="mb-5 border-l-4 border-gold pl-3 font-display text-2xl text-cream">
                                CÓMO PARTICIPAR
                            </h2>
                            <ol className="flex flex-col gap-4">
                                {PASOS.map(({ n, texto }) => (
                                    <li key={n} className="flex items-start gap-3">
                                        <span className="flex size-6 shrink-0 items-center justify-center bg-gold text-xs font-bold text-bg">
                                            {n}
                                        </span>
                                        <span className="text-sm text-muted">{texto}</span>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </motion.div>

                    {/* Columna derecha — slide desde la derecha */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
                        className="space-y-5"
                    >
                        {/* Precio */}
                        <div className="bg-gold p-6 text-center text-bg">
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                                Precio por participación
                            </p>
                            <p className="font-display text-5xl leading-tight">
                                S/ {Number(sorteo.precio_participacion).toFixed(2)}
                            </p>
                        </div>

                        {/* QRs */}
                        <div>
                            <h3 className="mb-3 font-display text-2xl text-cream">REALIZA TU PAGO</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <QrCard label="YAPE" imgUrl={config.qr_yape_path} titular={config.titular_pago} />
                                <QrCard label="PLIN" imgUrl={config.qr_plin_path} titular={config.titular_pago} />
                            </div>
                        </div>

                        {/* Nota captura */}
                        <div className="border-l-4 border-gold bg-gold/10 px-4 py-3">
                            <p className="text-sm text-cream">
                                <span className="mr-2">📸</span>
                                Toma captura de pantalla del pago antes de continuar
                            </p>
                        </div>

                        {enviado ? (
                            <SuccessState whatsapp={config.whatsapp_contacto} />
                        ) : (
                            <RegistroForm
                                sorteoId={sorteo.id}
                                terminos={config.terminos_condiciones}
                                onSuccess={() => setEnviado(true)}
                            />
                        )}
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}

/* ── QR Card ── */
function QrCard({ label, imgUrl, titular }) {
    return (
        <div className="flex flex-col items-center gap-3 border border-gold/30 bg-surface2 p-4 text-center">
            <p className="font-display text-xl tracking-widest text-gold">{label}</p>
            {imgUrl ? (
                <img src={imgUrl} alt={`QR ${label}`} className="h-28 w-28 border border-gold/20 object-contain" />
            ) : (
                <div className="flex h-28 w-28 items-center justify-center border-2 border-dashed border-gold/30 text-[10px] text-muted">
                    Sin QR configurado
                </div>
            )}
            {titular && <p className="text-xs font-bold text-gold">{titular}</p>}
        </div>
    );
}

/* ── Estado de éxito ── */
function SuccessState({ whatsapp }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="border border-gold/20 bg-surface p-8 text-center"
        >
            <div className="mx-auto mb-5 flex size-16 items-center justify-center border border-gold bg-gold/20 text-gold">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <p className="font-display text-4xl text-gold">¡REGISTRO RECIBIDO!</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-cream">
                Tu participación está{' '}
                <span className="font-semibold text-gold">pendiente de confirmación</span>.
                Te notificaremos por WhatsApp una vez revisado el comprobante.
            </p>
            {whatsapp && (
                <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-block bg-gold px-6 py-3 text-sm font-bold uppercase tracking-widest text-bg transition-colors hover:bg-gold-light"
                >
                    Contactar por WhatsApp
                </a>
            )}
        </motion.div>
    );
}

/* ── Formulario de registro ── */
function RegistroForm({ sorteoId, terminos, onSuccess }) {
    const [comprobantePreview, setPreview] = useState(null);
    const fileRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        nombres: '', apellidos: '', whatsapp: '', comprobante: null, terminos: false,
    });

    function submit(e) {
        e.preventDefault();
        post(`/sorteos/${sorteoId}/registrar`, {
            forceFormData: true,
            onSuccess: () => onSuccess(),
        });
    }

    function onFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setData('comprobante', file);
        setPreview(URL.createObjectURL(file));
    }

    return (
        <form onSubmit={submit} noValidate className="space-y-5 border border-gold/20 bg-surface p-5">
            <h2 className="font-display text-3xl text-cream">REGISTRAR PARTICIPACIÓN</h2>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Nombres" error={errors.nombres}>
                    <input type="text" value={data.nombres}
                        onChange={(e) => setData('nombres', e.target.value)}
                        maxLength={100} className={inputCls(errors.nombres)} placeholder="Juan" />
                </Field>
                <Field label="Apellidos" error={errors.apellidos}>
                    <input type="text" value={data.apellidos}
                        onChange={(e) => setData('apellidos', e.target.value)}
                        maxLength={100} className={inputCls(errors.apellidos)} placeholder="Pérez" />
                </Field>
            </div>

            <Field label="WhatsApp" error={errors.whatsapp}>
                <input type="tel" value={data.whatsapp}
                    onChange={(e) => setData('whatsapp', e.target.value)}
                    maxLength={20} className={inputCls(errors.whatsapp)} placeholder="+51 999 999 999" />
            </Field>

            <Field label="Foto del comprobante" error={errors.comprobante}>
                <div
                    className={[
                        'cursor-pointer overflow-hidden border-2 border-dashed bg-surface2 transition-colors',
                        errors.comprobante ? 'border-danger' : 'border-gold/30 hover:border-gold/60',
                    ].join(' ')}
                    onClick={() => fileRef.current?.click()}
                >
                    {comprobantePreview ? (
                        <img src={comprobantePreview} alt="Comprobante"
                            className="max-h-48 w-full border border-gold/30 object-contain p-2" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 py-8 text-muted">
                            <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="text-xs uppercase tracking-widest">Clic para subir la captura</span>
                        </div>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            </Field>

            <div className="space-y-1">
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input type="checkbox" checked={data.terminos}
                        onChange={(e) => setData('terminos', e.target.checked)}
                        className="mt-0.5 size-4 accent-gold" />
                    <span className="text-muted">
                        Acepto los{' '}
                        {terminos ? (
                            <button type="button" onClick={() => alert(terminos)}
                                className="text-gold underline hover:text-gold-light">
                                términos y condiciones
                            </button>
                        ) : (
                            <span className="text-gold">términos y condiciones</span>
                        )}{' '}
                        del sorteo.
                    </span>
                </label>
                {errors.terminos && <p className="text-xs text-danger">{errors.terminos}</p>}
            </div>

            {/* Botón con whileHover / whileTap */}
            <motion.button
                type="submit"
                disabled={processing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-full bg-danger py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-danger-dark disabled:opacity-50"
            >
                {processing ? 'Enviando…' : 'ENVIAR REGISTRO'}
            </motion.button>
        </form>
    );
}

/* ── Helpers ── */
function inputCls(error) {
    return [
        'w-full border bg-surface2 px-3 py-2.5 text-sm text-cream placeholder-muted outline-none transition-colors',
        error ? 'border-danger' : 'border-gold/20 focus:border-gold',
    ].join(' ');
}

function Field({ label, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-muted">{label}</label>
            {children}
            {error && <p className="text-xs text-danger">{error}</p>}
        </div>
    );
}

function buildUnits(cd) {
    if (cd.days > 0) return [{ v: cd.days, l: 'días' }, { v: cd.hours, l: 'horas' }, { v: cd.minutes, l: 'min' }];
    return [{ v: cd.hours, l: 'horas' }, { v: cd.minutes, l: 'min' }, { v: cd.seconds, l: 'seg' }];
}

/* ── Hook countdown ── */
function calcDiff(iso) {
    if (!iso) return null;
    const remaining = new Date(iso).getTime() - Date.now();
    if (remaining <= 0) return { expired: true };
    return {
        expired: false,
        days:    Math.floor(remaining / 86_400_000),
        hours:   Math.floor((remaining % 86_400_000) / 3_600_000),
        minutes: Math.floor((remaining % 3_600_000) / 60_000),
        seconds: Math.floor((remaining % 60_000) / 1000),
    };
}

function useCountdown(iso) {
    const [diff, setDiff] = useState(() => calcDiff(iso));
    const ref = useRef(iso);
    ref.current = iso;
    useEffect(() => {
        const id = setInterval(() => setDiff(calcDiff(ref.current)), 1000);
        return () => clearInterval(id);
    }, []);
    return diff;
}

function IconCalendar() {
    return (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}
