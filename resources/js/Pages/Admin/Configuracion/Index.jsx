import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function ConfiguracionIndex({ config }) {
    const [saving, setSaving] = useState(false);
    const formRef  = useRef(null);
    const [errors, setErrors] = useState({});
    const [whatsapp, setWhatsapp] = useState(config.whatsapp_contacto ?? '');

    function submit(e) {
        e.preventDefault();
        setErrors({});
        const formData = new FormData(formRef.current);
        router.post('/admin/configuracion', formData, {
            forceFormData: true,
            onBefore:  () => setSaving(true),
            onError:   (err) => setErrors(err),
            onFinish:  () => setSaving(false),
        });
    }

    return (
        <AdminLayout>
            <div className="mx-auto max-w-2xl space-y-6">
                <h1 className="font-display text-4xl text-cream">CONFIGURACIÓN</h1>

                <form ref={formRef} onSubmit={submit} noValidate className="space-y-4">

                    <Section title="DATOS DEL NEGOCIO">
                        <Field label="Nombre del negocio">
                            <input type="text" name="nombre_negocio" defaultValue={config.nombre_negocio}
                                maxLength={200} className={inputCls} />
                        </Field>
                        <Field label="Titular de pago (Yape / Plin)">
                            <input type="text" name="titular_pago" defaultValue={config.titular_pago}
                                maxLength={200} className={inputCls} />
                        </Field>
                        <Field label="WhatsApp de contacto">
                            <input
                                type="text"
                                inputMode="numeric"
                                name="whatsapp_contacto"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                maxLength={9}
                                placeholder="999999999"
                                className={inputCls}
                            />
                        </Field>
                    </Section>

                    <Section title="IMÁGENES">
                        <div className="grid gap-5 sm:grid-cols-3">
                            <FileField label="Logo"    name="logo"    currentUrl={config.logo_path}    error={errors.logo} />
                            <FileField label="QR Yape" name="qr_yape" currentUrl={config.qr_yape_path} error={errors.qr_yape} />
                            <FileField label="QR Plin" name="qr_plin" currentUrl={config.qr_plin_path} error={errors.qr_plin} />
                        </div>
                    </Section>

                    <Section title="REDES SOCIALES">
                        <Field label="Facebook">
                            <input type="url" name="url_facebook" defaultValue={config.url_facebook}
                                maxLength={500} placeholder="https://facebook.com/..." className={inputCls} />
                        </Field>
                        <Field label="Instagram">
                            <input type="url" name="url_instagram" defaultValue={config.url_instagram}
                                maxLength={500} placeholder="https://instagram.com/..." className={inputCls} />
                        </Field>
                        <Field label="TikTok">
                            <input type="url" name="url_tiktok" defaultValue={config.url_tiktok}
                                maxLength={500} placeholder="https://tiktok.com/..." className={inputCls} />
                        </Field>
                    </Section>

                    <Section title="TÉRMINOS Y CONDICIONES" defaultOpen={false}>
                        <textarea
                            name="terminos_condiciones"
                            defaultValue={config.terminos_condiciones}
                            rows={10}
                            placeholder="Escribe aquí los términos y condiciones del sorteo…"
                            className={`${inputCls} resize-y`}
                        />
                    </Section>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-gold px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-bg transition-colors hover:bg-gold-light disabled:opacity-50"
                        >
                            {saving ? 'Guardando…' : 'Guardar configuración'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

function FileField({ label, name, currentUrl, error }) {
    const [preview, setPreview]   = useState(currentUrl ?? null);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        setPreview(URL.createObjectURL(file));
        // Actualizar el input file con el archivo arrastrado
        const dt = new DataTransfer();
        dt.items.add(file);
        if (inputRef.current) inputRef.current.files = dt.files;
    }

    function onChange(e) {
        const file = e.target.files[0];
        if (file) handleFile(file);
    }

    function onDragOver(e) {
        e.preventDefault();
        setDragOver(true);
    }

    function onDragLeave(e) {
        e.preventDefault();
        setDragOver(false);
    }

    function onDrop(e) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }

    return (
        <div className="space-y-2">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted">{label}</p>
            <div
                className={[
                    'flex h-32 cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed bg-surface2 transition-all duration-150',
                    dragOver
                        ? 'border-gold bg-gold/10 shadow-glow-gold scale-[1.02]'
                        : 'border-gold/30 hover:border-gold/60',
                ].join(' ')}
                onClick={() => inputRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {preview ? (
                    <img src={preview} alt={label} className="h-full w-full object-contain p-2" />
                ) : (
                    <div className="flex flex-col items-center gap-1.5 text-muted">
                        <svg className="size-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">{dragOver ? 'Suelta aquí' : 'Clic o arrastra'}</span>
                    </div>
                )}
            </div>
            <input ref={inputRef} type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
            {preview && (
                <button
                    type="button"
                    onClick={() => { setPreview(null); if (inputRef.current) inputRef.current.value = ''; }}
                    className="text-xs text-muted transition-colors hover:text-danger"
                >
                    Quitar imagen
                </button>
            )}
            {error && <p className="text-xs text-danger">{error}</p>}
        </div>
    );
}

function Section({ title, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="border border-gold/20 bg-surface">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-surface2/50"
            >
                <h2 className="border-l-4 border-gold pl-3 font-display text-2xl text-gold">{title}</h2>
                <svg
                    className={`size-4 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="space-y-4 border-t border-gold/10 px-5 pb-5 pt-4">
                    {children}
                </div>
            )}
        </div>
    );
}

const inputCls = 'w-full border border-gold/20 bg-surface2 px-3 py-2.5 text-sm text-cream placeholder-muted outline-none transition-colors focus:border-gold';

function Field({ label, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-medium uppercase tracking-widest text-muted">
                {label}
            </label>
            {children}
        </div>
    );
}
