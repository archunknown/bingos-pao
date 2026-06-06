import PublicLayout from '@/Layouts/PublicLayout';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const TIPO_LABEL = {
    bingo: 'Bingo', pozito: 'Pozito', especial: 'Especial', aniversario: 'Aniversario',
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
            <div className="mx-auto max-w-5xl px-4 py-8">

                {/* Header del sorteo */}
                <div className="mb-8">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-pink-500/20 px-3 py-0.5 text-xs font-semibold text-pink-300">
                            {TIPO_LABEL[sorteo.tipo] ?? sorteo.tipo}
                        </span>
                        <span className="rounded-full bg-green-500/20 px-3 py-0.5 text-xs font-semibold text-green-300">
                            Activo
                        </span>
                    </div>
                    <h1 className="font-[BebasNeue,sans-serif] text-4xl tracking-wide text-white sm:text-5xl">
                        {sorteo.nombre}
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        {new Date(sorteo.fecha_sorteo).toLocaleString('es-PE', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>

                    {/* Countdown */}
                    {countdown && !countdown.expired && (
                        <div className="mt-4 inline-flex flex-wrap gap-2">
                            {[
                                { v: countdown.days,    l: 'días' },
                                { v: countdown.hours,   l: 'horas' },
                                { v: countdown.minutes, l: 'min' },
                                { v: countdown.seconds, l: 'seg' },
                            ].map(({ v, l }) => (
                                <div key={l} className="flex w-14 flex-col items-center rounded-lg border border-slate-700 bg-slate-800 py-2">
                                    <span className="font-[BebasNeue,sans-serif] text-2xl leading-none text-pink-400">
                                        {String(v).padStart(2, '0')}
                                    </span>
                                    <span className="mt-0.5 text-[9px] uppercase tracking-widest text-slate-500">{l}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {countdown?.expired && (
                        <p className="mt-3 font-semibold text-yellow-400">¡El sorteo está en curso!</p>
                    )}
                </div>

                {/* Dos columnas */}
                <div className="grid gap-8 lg:grid-cols-2">

                    {/* Columna izquierda — premios + instrucciones */}
                    <div className="space-y-6">
                        {/* Premios */}
                        {sorteo.premios?.length > 0 && (
                            <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
                                <h2 className="mb-4 font-semibold text-white">Premios</h2>
                                <ul className="space-y-2">
                                    {sorteo.premios.map((p) => (
                                        <li key={p.id} className="flex items-start gap-3 text-sm">
                                            <span className="mt-1 size-2 shrink-0 rounded-full bg-pink-500" />
                                            <span>
                                                <span className="font-medium text-white">{p.nombre}</span>
                                                {p.monto != null && (
                                                    <span className="ml-2 text-pink-400">S/ {Number(p.monto).toFixed(2)}</span>
                                                )}
                                                {p.descripcion_premio && (
                                                    <span className="ml-2 text-slate-400">— {p.descripcion_premio}</span>
                                                )}
                                                {p.cantidad > 1 && (
                                                    <span className="ml-1 text-slate-500">× {p.cantidad}</span>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Instrucciones */}
                        <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
                            <h2 className="mb-4 font-semibold text-white">¿Cómo participar?</h2>
                            <ol className="space-y-3">
                                {PASOS.map(({ n, texto }) => (
                                    <li key={n} className="flex gap-3 text-sm">
                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
                                            {n}
                                        </span>
                                        <span className="text-slate-300">{texto}</span>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </div>

                    {/* Columna derecha — precio, QRs, formulario */}
                    <div className="space-y-5">

                        {/* Precio */}
                        <div className="rounded-xl border border-pink-500/30 bg-pink-500/10 p-5 text-center">
                            <p className="text-xs font-medium uppercase tracking-widest text-pink-400">Precio por participación</p>
                            <p className="mt-1 font-[BebasNeue,sans-serif] text-5xl text-white">
                                S/ {Number(sorteo.precio_participacion).toFixed(2)}
                            </p>
                        </div>

                        {/* QR Yape + Plin */}
                        <div className="grid grid-cols-2 gap-3">
                            <QrCard label="Yape" imgUrl={config.qr_yape_path} titular={config.titular_pago} />
                            <QrCard label="Plin" imgUrl={config.qr_plin_path} titular={config.titular_pago} />
                        </div>

                        {/* Nota captura */}
                        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-center text-xs font-medium text-yellow-300">
                            📸 Toma captura de pantalla del pago antes de continuar
                        </div>

                        {/* Formulario o confirmación */}
                        {enviado ? (
                            <SuccessState whatsapp={config.whatsapp_contacto} />
                        ) : (
                            <RegistroForm
                                sorteoId={sorteo.id}
                                terminos={config.terminos_condiciones}
                                onSuccess={() => setEnviado(true)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

/* ── QR Card ── */
function QrCard({ label, imgUrl, titular }) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
            {imgUrl ? (
                <img src={imgUrl} alt={`QR ${label}`} className="h-28 w-28 rounded-lg object-contain" />
            ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-lg border border-dashed border-slate-600 text-xs text-slate-600">
                    Sin QR
                </div>
            )}
            {titular && <p className="text-[11px] text-slate-400">{titular}</p>}
        </div>
    );
}

/* ── Estado de éxito ── */
function SuccessState({ whatsapp }) {
    return (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
            <p className="text-2xl">✅</p>
            <p className="mt-2 font-semibold text-green-300">¡Registro recibido!</p>
            <p className="mt-1 text-sm text-slate-400">
                Tu participación está <strong className="text-white">pendiente de confirmación</strong>.
                Te notificaremos por WhatsApp una vez revisado el comprobante.
            </p>
            {whatsapp && (
                <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                    Contactar por WhatsApp
                </a>
            )}
        </div>
    );
}

/* ── Formulario de registro ── */
function RegistroForm({ sorteoId, terminos, onSuccess }) {
    const [comprobantePreview, setPreview] = useState(null);
    const fileRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        nombres:     '',
        apellidos:   '',
        whatsapp:    '',
        comprobante: null,
        terminos:    false,
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
        <form onSubmit={submit} noValidate className="space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="font-semibold text-white">Completa tu registro</h2>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Nombres" error={errors.nombres}>
                    <input
                        type="text"
                        value={data.nombres}
                        onChange={(e) => setData('nombres', e.target.value)}
                        maxLength={100}
                        className={inputCls(errors.nombres)}
                        placeholder="Juan"
                    />
                </Field>
                <Field label="Apellidos" error={errors.apellidos}>
                    <input
                        type="text"
                        value={data.apellidos}
                        onChange={(e) => setData('apellidos', e.target.value)}
                        maxLength={100}
                        className={inputCls(errors.apellidos)}
                        placeholder="Pérez"
                    />
                </Field>
            </div>

            <Field label="WhatsApp" error={errors.whatsapp}>
                <input
                    type="tel"
                    value={data.whatsapp}
                    onChange={(e) => setData('whatsapp', e.target.value)}
                    maxLength={20}
                    className={inputCls(errors.whatsapp)}
                    placeholder="+51 999 999 999"
                />
            </Field>

            {/* Upload comprobante */}
            <Field label="Foto del comprobante" error={errors.comprobante}>
                <div
                    className={`cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-colors ${
                        errors.comprobante ? 'border-red-500' : 'border-slate-600 hover:border-pink-500'
                    }`}
                    onClick={() => fileRef.current?.click()}
                >
                    {comprobantePreview ? (
                        <img src={comprobantePreview} alt="Comprobante" className="max-h-48 w-full object-contain p-2" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 py-6 text-slate-500">
                            <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="text-xs">Clic para subir la captura</span>
                        </div>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            </Field>

            {/* Términos */}
            <div className="space-y-1">
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={data.terminos}
                        onChange={(e) => setData('terminos', e.target.checked)}
                        className="mt-0.5 size-4 accent-pink-500"
                    />
                    <span className="text-slate-300">
                        Acepto los{' '}
                        {terminos ? (
                            <button
                                type="button"
                                onClick={() => alert(terminos)}
                                className="underline text-pink-400 hover:text-pink-300"
                            >
                                términos y condiciones
                            </button>
                        ) : (
                            <span className="text-pink-400">términos y condiciones</span>
                        )}{' '}
                        del sorteo.
                    </span>
                </label>
                {errors.terminos && <p className="text-xs text-red-400">{errors.terminos}</p>}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full rounded-xl bg-pink-600 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-pink-900/30 transition-colors hover:bg-pink-700 disabled:opacity-50"
            >
                {processing ? 'Enviando…' : 'ENVIAR REGISTRO'}
            </button>
        </form>
    );
}

/* ── Helpers ── */
function inputCls(error) {
    return [
        'w-full rounded-lg border bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:ring-2 focus:ring-pink-500',
        error ? 'border-red-500' : 'border-slate-600',
    ].join(' ');
}

function Field({ label, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">{label}</label>
            {children}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
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
