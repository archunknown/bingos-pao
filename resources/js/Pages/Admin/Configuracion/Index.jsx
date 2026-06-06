import AdminLayout from '@/Layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function ConfiguracionIndex({ config }) {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    const formRef   = useRef(null);
    const [errors, setErrors] = useState({});

    function submit(e) {
        e.preventDefault();
        setErrors({});
        const formData = new FormData(formRef.current);
        router.post('/admin/configuracion', formData, {
            forceFormData: true,
            onBefore: () => setSaving(true),
            onError:  (err) => setErrors(err),
            onFinish: () => setSaving(false),
        });
    }

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
                <h1 className="font-[BebasNeue,sans-serif] text-3xl tracking-wide text-white">
                    Configuración general
                </h1>

                <form ref={formRef} onSubmit={submit} noValidate className="space-y-6">

                    {/* ── Negocio ── */}
                    <Section title="Datos del negocio">
                        <Field label="Nombre del negocio">
                            <input type="text" name="nombre_negocio" defaultValue={config.nombre_negocio}
                                maxLength={200} className={inputCls} />
                        </Field>
                        <Field label="Titular de pago (Yape / Plin)">
                            <input type="text" name="titular_pago" defaultValue={config.titular_pago}
                                maxLength={200} className={inputCls} />
                        </Field>
                        <Field label="WhatsApp de contacto">
                            <input type="text" name="whatsapp_contacto" defaultValue={config.whatsapp_contacto}
                                maxLength={20} placeholder="+51 999 999 999" className={inputCls} />
                        </Field>
                        <Field label="Texto de alerta de seguridad">
                            <input type="text" name="alerta_seguridad_texto" defaultValue={config.alerta_seguridad_texto}
                                maxLength={500} placeholder="Ej. Solo aceptamos pagos por Yape o Plin." className={inputCls} />
                        </Field>
                    </Section>

                    {/* ── Imágenes ── */}
                    <Section title="Imágenes">
                        <div className="grid gap-5 sm:grid-cols-3">
                            <FileField label="Logo" name="logo" currentUrl={config.logo_path} error={errors.logo} />
                            <FileField label="QR Yape" name="qr_yape" currentUrl={config.qr_yape_path} error={errors.qr_yape} />
                            <FileField label="QR Plin" name="qr_plin" currentUrl={config.qr_plin_path} error={errors.qr_plin} />
                        </div>
                    </Section>

                    {/* ── Redes sociales ── */}
                    <Section title="Redes sociales">
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

                    {/* ── Términos ── */}
                    <Section title="Términos y condiciones">
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
                            className="rounded-lg bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-700 disabled:opacity-50"
                        >
                            {saving ? 'Guardando…' : 'Guardar configuración'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

/* ── File upload con preview ── */
function FileField({ label, name, currentUrl, error }) {
    const [preview, setPreview] = useState(currentUrl ?? null);
    const inputRef = useRef(null);

    function onChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
    }

    return (
        <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>

            {/* Preview */}
            <div
                className="flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-600 bg-slate-900 transition-colors hover:border-pink-500"
                onClick={() => inputRef.current?.click()}
            >
                {preview ? (
                    <img src={preview} alt={label} className="h-full w-full object-contain p-2" />
                ) : (
                    <span className="text-xs text-slate-500">Clic para subir</span>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                name={name}
                accept="image/*"
                onChange={onChange}
                className="hidden"
            />

            {preview && (
                <button
                    type="button"
                    onClick={() => { setPreview(null); if (inputRef.current) inputRef.current.value = ''; }}
                    className="text-xs text-slate-500 hover:text-red-400"
                >
                    Quitar imagen
                </button>
            )}

            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}

/* ── Helpers ── */
const inputCls = 'w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:ring-2 focus:ring-pink-500';

function Section({ title, children }) {
    return (
        <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
            {children}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                {label}
            </label>
            {children}
        </div>
    );
}
