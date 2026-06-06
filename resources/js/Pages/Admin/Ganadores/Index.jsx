import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function GanadoresIndex({ sorteos, ganadores }) {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    function togglePublicado(ganador) {
        router.patch(`/admin/ganadores/${ganador.id}/toggle-publicado`, {}, { preserveScroll: true });
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

            <div className="space-y-8">
                <h1 className="font-display text-4xl text-cream">GANADORES</h1>

                <RegistrarGanadorForm sorteos={sorteos} />

                <section>
                    <h2 className="mb-4 border-l-4 border-gold pl-3 font-display text-2xl text-gold">
                        GANADORES REGISTRADOS
                    </h2>
                    <div className="overflow-hidden border border-gold/20 bg-surface">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-surface2 text-left">
                                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">Participante</th>
                                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">Premio</th>
                                        <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted md:table-cell">Sorteo</th>
                                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted">Publicado</th>
                                        <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted lg:table-cell">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ganadores.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-10 text-center text-muted">
                                                No hay ganadores registrados aún.
                                            </td>
                                        </tr>
                                    ) : (
                                        ganadores.map((g) => (
                                            <tr key={g.id} className="border-b border-gold/10 transition-colors hover:bg-surface2/50">
                                                <td className="px-4 py-3 font-medium text-cream">
                                                    {g.participante?.nombres} {g.participante?.apellidos}
                                                </td>
                                                <td className="px-4 py-3 text-content">{g.premio?.nombre}</td>
                                                <td className="hidden px-4 py-3 text-content md:table-cell">{g.sorteo?.nombre}</td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePublicado(g)}
                                                        className={`border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                                                            g.publicado
                                                                ? 'bg-success/10 text-success border-success/30 hover:bg-success/20'
                                                                : 'bg-surface2 text-muted border-muted/20 hover:text-cream'
                                                        }`}
                                                    >
                                                        {g.publicado ? 'Publicado' : 'Oculto'}
                                                    </button>
                                                </td>
                                                <td className="hidden px-4 py-3 text-xs text-muted lg:table-cell">
                                                    {new Date(g.created_at).toLocaleString('es-PE', {
                                                        dateStyle: 'short', timeStyle: 'short',
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

function RegistrarGanadorForm({ sorteos }) {
    const [participantes, setParticipantes] = useState([]);
    const [premios, setPremios]             = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        sorteo_id: '', participante_id: '', premio_id: '',
    });

    function onSorteoChange(sorteoId) {
        setData({ sorteo_id: sorteoId, participante_id: '', premio_id: '' });
        setParticipantes([]);
        setPremios([]);
        if (!sorteoId) return;
        router.reload({ only: [], onBefore: () => {} });
        fetch(`/admin/ganadores/opciones?sorteo_id=${sorteoId}`, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then((r) => r.json())
            .then(({ participantes: p, premios: pr }) => { setParticipantes(p); setPremios(pr); })
            .catch(() => {});
    }

    function submit(e) {
        e.preventDefault();
        post('/admin/ganadores', {
            onSuccess: () => { reset(); setParticipantes([]); setPremios([]); },
        });
    }

    return (
        <section className="border border-gold/20 bg-surface p-5">
            <h2 className="mb-5 border-l-4 border-gold pl-3 font-display text-2xl text-gold">
                REGISTRAR GANADOR
            </h2>

            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
                <Field label="Sorteo" error={errors.sorteo_id}>
                    <select
                        value={data.sorteo_id}
                        onChange={(e) => onSorteoChange(e.target.value)}
                        className={selectCls(errors.sorteo_id)}
                    >
                        <option value="">Seleccionar sorteo</option>
                        {sorteos.map((s) => (
                            <option key={s.id} value={s.id}>{s.nombre}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Participante confirmado" error={errors.participante_id}>
                    <select
                        value={data.participante_id}
                        onChange={(e) => setData('participante_id', e.target.value)}
                        disabled={participantes.length === 0}
                        className={selectCls(errors.participante_id)}
                    >
                        <option value="">
                            {data.sorteo_id
                                ? participantes.length === 0 ? 'Sin confirmados' : 'Seleccionar participante'
                                : 'Primero elige un sorteo'}
                        </option>
                        {participantes.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.numero_registro} — {p.nombres} {p.apellidos}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Premio" error={errors.premio_id}>
                    <select
                        value={data.premio_id}
                        onChange={(e) => setData('premio_id', e.target.value)}
                        disabled={premios.length === 0}
                        className={selectCls(errors.premio_id)}
                    >
                        <option value="">
                            {data.sorteo_id
                                ? premios.length === 0 ? 'Sin premios' : 'Seleccionar premio'
                                : 'Primero elige un sorteo'}
                        </option>
                        {premios.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </Field>

                <div className="flex items-end sm:col-span-3">
                    <button
                        type="submit"
                        disabled={processing || !data.sorteo_id || !data.participante_id || !data.premio_id}
                        className="bg-gold px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-bg transition-colors hover:bg-gold-light disabled:opacity-40"
                    >
                        {processing ? 'Registrando…' : 'Registrar ganador'}
                    </button>
                </div>
            </form>
        </section>
    );
}

function selectCls(error) {
    return [
        'w-full border bg-surface2 px-3 py-2.5 text-sm text-cream outline-none transition-colors disabled:opacity-40',
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
