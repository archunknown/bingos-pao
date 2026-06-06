import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function PublicLayout({ children }) {
    const { config_publica, flash, auth } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(t);
    }, [flash]);

    const nombre = config_publica?.nombre_negocio || 'Bingos Pao';
    const logoUrl = config_publica?.logo_url;
    const alerta = config_publica?.alerta_seguridad_texto;

    return (
        <div className="flex min-h-screen flex-col bg-slate-900 font-[Outfit,sans-serif] text-white">
            {/* Toast */}
            {toast && (
                <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${
                    toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {toast.msg}
                </div>
            )}

            {/* Alerta de seguridad */}
            {alerta && (
                <div className="bg-yellow-500/10 px-4 py-2 text-center text-xs font-medium text-yellow-300">
                    ⚠ {alerta}
                </div>
            )}

            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-slate-700/60 bg-slate-900/95 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
                    {/* Logo + nombre */}
                    <button
                        type="button"
                        onClick={() => router.visit('/')}
                        className="flex items-center gap-3"
                    >
                        {logoUrl ? (
                            <img src={logoUrl} alt={nombre} className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 text-sm font-bold">
                                {nombre.charAt(0)}
                            </div>
                        )}
                        <span className="font-[BebasNeue,sans-serif] text-xl tracking-wider text-pink-400">
                            {nombre}
                        </span>
                    </button>

                    {/* Nav */}
                    <nav className="flex items-center gap-4 text-sm">
                        <NavLink href="/sorteos" label="Sorteos" />
                        <NavLink href="/como-participar" label="¿Cómo participar?" />
                        {auth?.user && (
                            <button
                                type="button"
                                onClick={() => router.visit('/admin')}
                                className="rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-pink-700"
                            >
                                Admin
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            {/* Contenido */}
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-700/60 py-6 text-center text-xs text-slate-500">
                {nombre} · Pagos solo por Yape / Plin
                {config_publica?.titular_pago && (
                    <> · Titular: <span className="text-slate-400">{config_publica.titular_pago}</span></>
                )}
            </footer>
        </div>
    );
}

function NavLink({ href, label }) {
    const { url } = usePage();
    const active = url === href || url.startsWith(href + '/');

    return (
        <button
            type="button"
            onClick={() => router.visit(href)}
            className={`transition-colors hover:text-white ${active ? 'text-pink-400' : 'text-slate-400'}`}
        >
            {label}
        </button>
    );
}
