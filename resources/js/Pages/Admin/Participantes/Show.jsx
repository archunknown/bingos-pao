import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const ESTADO_STYLE = {
    pendiente:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    confirmado: 'bg-green-500/20  text-green-300  border-green-500/30',
    rechazado:  'bg-red-500/20    text-red-300    border-red-500/30',
};

export default function ParticipanteShow({ participante, comprobante_url }) {
    const { flash } = usePage().props;
    const [toast, setToast]           = useState(null);
    const [rechazarOpen, setRechazar] = useState(false);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    function confirmar() {
        if (!confirm('¿Confirmar a este participante?')) return;
        router.patch(`/admin/participantes/${participante.id}/confirmar`);
    }

    const esPendiente = participante.estado === 'pendiente';

    return (
        <AdminLayout>
            {toast && (
                <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
                    toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
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
                        className="text-slate-400 hover:text-white"
                        aria-label="Volver"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="font-[BebasNeue,sans-serif] text-3xl tracking-wide text-white">
                            {participante.nombres} {participante.apellidos}
                        </h1>
                        <p className="text-sm text-slate-400">{participante.sorteo?.nombre}</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Datos del participante */}
                    <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-5">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Datos
                        </h2>

                        <dl className="space-y-3 text-sm">
                            <DataRow label="N° registro" value={participante.numero_registro ?? '—'} mono />
                            <DataRow label="Estado">
                                <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-medium capitalize ${ESTADO_STYLE[participante.estado] ?? ''}`}>
                                    {participante.estado}
                                </span>
                            </DataRow>
                            <DataRow label="Nombres" value={`${participante.nombres} ${participante.apellidos}`} />
                            <DataRow label="WhatsApp" value={participante.whatsapp} />
                            <DataRow label="Sorteo" value={participante.sorteo?.nombre ?? '—'} />
                            <DataRow
                                label="Registrado"
                                value={new Date(participante.created_at).toLocaleString('es-PE', {
                                    dateStyle: 'long',
                                    timeStyle: 'short',
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
                                    onClick={confirmar}
                                    className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                                >
                                    CONFIRMAR
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRechazar(true)}
                                    className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                                >
                                    RECHAZAR
                                </button>
                            </div>
                        )}

                        {/* Formulario de rechazo inline */}
                        {rechazarOpen && (
                            <RechazarForm
                                participanteId={participante.id}
                                onCancel={() => setRechazar(false)}
                            />
                        )}
                    </div>

                    {/* Comprobante */}
                    <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-800 p-5">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Comprobante de pago
                        </h2>

                        {comprobante_url ? (
                            <a href={comprobante_url} target="_blank" rel="noreferrer">
                                <img
                                    src={comprobante_url}
                                    alt="Comprobante de pago"
                                    className="w-full rounded-lg border border-slate-600 object-contain transition-opacity hover:opacity-90"
                                    style={{ maxHeight: '480px' }}
                                />
                                <p className="mt-2 text-center text-xs text-slate-500">
                                    Clic para abrir en pantalla completa
                                </p>
                            </a>
                        ) : (
                            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-600 text-slate-500">
                                Sin comprobante
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

/* ── Formulario de rechazo inline ── */
function RechazarForm({ participanteId, onCancel }) {
    const { data, setData, patch, processing, errors } = useForm({
        nota_interna: '',
    });

    function submit(e) {
        e.preventDefault();
        patch(`/admin/participantes/${participanteId}/rechazar`);
    }

    return (
        <form onSubmit={submit} className="space-y-3 rounded-lg border border-red-700/40 bg-red-950/30 p-4">
            <p className="text-xs font-medium text-red-300">Motivo del rechazo</p>
            <textarea
                value={data.nota_interna}
                onChange={(e) => setData('nota_interna', e.target.value)}
                rows={3}
                placeholder="Describe el motivo del rechazo…"
                className={[
                    'w-full resize-none rounded-lg border bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-red-500',
                    errors.nota_interna ? 'border-red-500' : 'border-slate-600',
                ].join(' ')}
                autoFocus
            />
            {errors.nota_interna && (
                <p className="text-xs text-red-400">{errors.nota_interna}</p>
            )}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-slate-600 hover:bg-slate-700 hover:text-white"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                    {processing ? 'Guardando…' : 'Confirmar rechazo'}
                </button>
            </div>
        </form>
    );
}

/* ── Helper de fila de datos ── */
function DataRow({ label, value, mono, children }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-slate-400">{label}</dt>
            <dd className={`text-right text-white ${mono ? 'font-mono' : ''}`}>
                {children ?? value}
            </dd>
        </div>
    );
}
