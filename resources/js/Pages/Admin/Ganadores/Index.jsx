import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function GanadoresIndex({ sorteos, ganadores }) {
    function togglePublicado(ganador) {
        router.patch(`/admin/ganadores/${ganador.id}/toggle-publicado`, {}, { preserveScroll: true });
    }

    return (
        <AdminLayout>
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
                                            <td colSpan={5} className="px-4 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 text-muted">
                                                    <svg className="size-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m-5-8H5a2 2 0 01-2-2V7h18v4a2 2 0 01-2 2h-2m-8 0h8m-8 0a5 5 0 0010 0" />
                                                    </svg>
                                                    <p className="text-sm font-medium">No hay ganadores registrados aún</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        ganadores.map((g) => (
                                            <tr key={g.id} className="border-b border-gold/10 transition-colors duration-150 hover:bg-surface2">
                                                <td className="px-4 py-3 font-medium text-cream">
                                                    <span className="flex items-center gap-2">
                                                        {g.publicado && (
                                                            <span className="text-gold" title="Publicado">★</span>
                                                        )}
                                                        {g.participante?.nombres} {g.participante?.apellidos}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-content">{g.premio?.nombre}</td>
                                                <td className="hidden px-4 py-3 text-content md:table-cell">{g.sorteo?.nombre}</td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => togglePublicado(g)}
                                                        className={[
                                                            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-150',
                                                            g.publicado
                                                                ? 'border-success/30 bg-success/10 text-success hover:bg-success/20'
                                                                : 'border-muted/20 bg-surface2 text-muted hover:text-cream',
                                                        ].join(' ')}
                                                    >
                                                        <span className={`size-1.5 rounded-full ${g.publicado ? 'bg-success' : 'bg-muted/40'}`} />
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

const WIZARD_STEPS = [
    { key: 'sorteo_id',       label: 'Sorteo',        num: 1 },
    { key: 'participante_id', label: 'Participante',  num: 2 },
    { key: 'premio_id',       label: 'Premio',        num: 3 },
];

function RegistrarGanadorForm({ sorteos }) {
    const [participantes, setParticipantes] = useState([]);
    const [premios, setPremios]             = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        sorteo_id: '', participante_id: '', premio_id: '',
    });

    const activeStep =
        !data.sorteo_id       ? 1 :
        !data.participante_id ? 2 : 3;

    function onSorteoChange(sorteoId) {
        setData({ sorteo_id: sorteoId, participante_id: '', premio_id: '' });
        setParticipantes([]);
        setPremios([]);
        if (!sorteoId) return;
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
            <h2 className="mb-6 border-l-4 border-gold pl-3 font-display text-2xl text-gold">
                REGISTRAR GANADOR
            </h2>

            {/* Wizard steps */}
            <div className="mb-6 flex items-center gap-0">
                {WIZARD_STEPS.map((step, i) => {
                    const done    = data[step.key] !== '';
                    const current = activeStep === step.num;
                    return (
                        <div key={step.key} className="flex flex-1 items-center">
                            <div className="flex flex-col items-center gap-1">
                                <div className={[
                                    'flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors duration-200',
                                    done    ? 'border-gold bg-gold text-bg'           :
                                    current ? 'border-gold/70 bg-gold/10 text-gold'   :
                                              'border-muted/30 bg-surface2 text-muted/50',
                                ].join(' ')}>
                                    {done ? '✓' : step.num}
                                </div>
                                <span className={`text-[10px] uppercase tracking-wider ${
                                    done || current ? 'text-gold' : 'text-muted/50'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                            {i < WIZARD_STEPS.length - 1 && (
                                <div className={[
                                    'mb-4 flex-1 border-t-2 transition-colors duration-200',
                                    data[step.key] ? 'border-gold/40' : 'border-muted/20',
                                ].join(' ')} />
                            )}
                        </div>
                    );
                })}
            </div>

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
                            <option key={p.id} value={p.id}>
                                {p.nombre}
                                {p.monto != null
                                    ? ` (S/ ${Number(p.monto).toFixed(2)})`
                                    : p.descripcion_premio ? ` (${p.descripcion_premio})` : ''}
                            </option>
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
            <label className="block text-[10px] font-medium uppercase tracking-widest text-muted">{label}</label>
            {children}
            {error && <p className="text-xs text-danger">{error}</p>}
        </div>
    );
}
