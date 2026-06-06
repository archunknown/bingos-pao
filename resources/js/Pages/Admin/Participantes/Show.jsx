import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const ESTADO_BADGE = {
    pendiente:  'bg-gold/10 text-gold border-gold/30',
    confirmado: 'bg-success/10 text-success border-success/30',
    rechazado:  'bg-danger/10 text-danger border-danger/30',
};

export default function ParticipanteShow({ participante, comprobante_url }) {
    const { flash } = usePage().props;
    const [toast, setToast]             = useState(null);
    const [rechazarOpen, setRechazar]   = useState(false);
    const [confirmarOpen, setConfirmar] = useState(false);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    function confirmar() {
        router.patch(`/admin/participantes/${participante.id}/confirmar`);
    }

    const esPendiente = participante.estado === 'pendiente';

    return (
        <AdminLayout>
            {toast && (
                <div className={`fixed right-4 top-4 z-50 border border-gold/30 bg-surface px-4 py-3 text-sm text-cream shadow-xl ${
                    toast.type === 'success' ? 'border-l-4 border-l-success' : 'border-l-4 border-l-danger'
                }`}>
                    {toast.msg}
                </div>
            )}

            <div className="mx-auto max-w-3xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.visit('/admin/participantes')}
                        className="text-muted transition-colors hover:text-cream"
                        aria-label="Volver"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="font-display text-4xl text-cream">
                            {participante.nombres} {participante.apellidos}
                        </h1>
                        <p className="text-sm text-muted">{participante.sorteo?.nombre}</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Datos */}
                    <div className="space-y-4 border border-gold/20 bg-surface p-5">
                        <h2 className="border-l-4 border-gold pl-3 font-display text-2xl text-gold">
                            DATOS
                        </h2>

                        <dl className="space-y-3 text-sm">
                            <DataRow label="N° registro" value={participante.numero_registro ?? '—'} mono />
                            <DataRow label="Estado">
                                <span className={`inline-block border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${ESTADO_BADGE[participante.estado] ?? ''}`}>
                                    {participante.estado}
                                </span>
                            </DataRow>
                            <DataRow label="Nombres" value={`${participante.nombres} ${participante.apellidos}`} />
                            <DataRow label="WhatsApp" value={participante.whatsapp} />
                            <DataRow label="Sorteo" value={participante.sorteo?.nombre ?? '—'} />
                            <DataRow
                                label="Registrado"
                                value={new Date(participante.created_at).toLocaleString('es-PE', {
                                    dateStyle: 'long', timeStyle: 'short',
                                })}
                            />
                            {participante.nota_interna && (
                                <DataRow label="Nota interna" value={participante.nota_interna} />
                            )}
                        </dl>

                        {/* Acciones */}
                        {esPendiente && (
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setConfirmar(true)}
                                    className="flex-1 bg-success py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:opacity-90"
                                >
                                    CONFIRMAR
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRechazar(true)}
                                    className="flex-1 border border-danger/30 bg-danger/10 py-2.5 text-sm font-bold uppercase tracking-wider text-danger transition-colors hover:bg-danger hover:text-white"
                                >
                                    RECHAZAR
                                </button>
                            </div>
                        )}

                        {rechazarOpen && (
                            <RechazarForm
                                participanteId={participante.id}
                                onCancel={() => setRechazar(false)}
                            />
                        )}
                    </div>

                    {/* Comprobante */}
                    <div className="space-y-3 border border-gold/20 bg-surface p-5">
                        <h2 className="border-l-4 border-gold pl-3 font-display text-2xl text-gold">
                            COMPROBANTE
                        </h2>

                        {comprobante_url ? (
                            <a href={comprobante_url} target="_blank" rel="noreferrer">
                                <img
                                    src={comprobante_url}
                                    alt="Comprobante de pago"
                                    className="w-full border border-gold/20 object-contain transition-opacity hover:opacity-90"
                                    style={{ maxHeight: '480px' }}
                                />
                                <p className="mt-2 text-center text-xs text-muted">
                                    Clic para abrir en pantalla completa
                                </p>
                            </a>
                        ) : (
                            <div className="flex h-40 items-center justify-center border-2 border-dashed border-gold/20 text-muted">
                                Sin comprobante
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {confirmarOpen && (
                <ConfirmarModal
                    participante={participante}
                    onConfirm={confirmar}
                    onCancel={() => setConfirmar(false)}
                />
            )}
        </AdminLayout>
    );
}

function ConfirmarModal({ participante, onConfirm, onCancel }) {
    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onCancel(); }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onCancel]);

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/80 p-4">
            <div className="w-full max-w-sm border border-gold/20 bg-surface p-6 shadow-2xl">
                <div className="mb-5 flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-success/10 text-xl text-success">✓</span>
                    <h2 className="font-display text-2xl text-cream">CONFIRMAR PAGO</h2>
                </div>

                <p className="mb-1 text-sm text-muted">
                    Estás por confirmar la participación de:
                </p>
                <p className="mb-1 font-semibold text-cream">
                    {participante.nombres} {participante.apellidos}
                </p>
                <p className="mb-5 text-sm text-muted">
                    Sorteo: <span className="text-content">{participante.sorteo?.nombre}</span>
                </p>
                <p className="mb-6 text-xs text-muted">
                    Se le asignará un número de registro y quedará habilitado para participar.
                </p>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 border border-gold/30 py-2.5 text-sm font-medium text-muted transition-colors hover:border-gold hover:text-cream"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 bg-success py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:opacity-90"
                    >
                        Sí, confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

function RechazarForm({ participanteId, onCancel }) {
    const { data, setData, patch, processing, errors } = useForm({ nota_interna: '' });

    function submit(e) {
        e.preventDefault();
        patch(`/admin/participantes/${participanteId}/rechazar`);
    }

    return (
        <form onSubmit={submit} className="space-y-3 border border-danger/30 bg-danger/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-danger">Motivo del rechazo</p>
            <textarea
                value={data.nota_interna}
                onChange={(e) => setData('nota_interna', e.target.value)}
                rows={3}
                placeholder="Describe el motivo del rechazo…"
                className={[
                    'w-full resize-none border bg-surface2 px-3 py-2 text-sm text-cream placeholder-muted outline-none transition-colors',
                    errors.nota_interna ? 'border-danger' : 'border-gold/20 focus:border-gold',
                ].join(' ')}
                autoFocus
            />
            {errors.nota_interna && (
                <p className="text-xs text-danger">{errors.nota_interna}</p>
            )}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="border border-gold/30 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-gold hover:text-cream"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-danger px-4 py-1.5 text-xs font-bold uppercase text-white transition-colors hover:bg-danger-dark disabled:opacity-50"
                >
                    {processing ? 'Guardando…' : 'Confirmar rechazo'}
                </button>
            </div>
        </form>
    );
}

function DataRow({ label, value, mono, children }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-muted">{label}</dt>
            <dd className={`text-right text-cream ${mono ? 'font-mono' : ''}`}>
                {children ?? value}
            </dd>
        </div>
    );
}
