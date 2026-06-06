import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const NAV = [
    { label: 'Inicio',           href: '/' },
    { label: 'Sorteo Activo',    href: '/sorteos' },
    { label: 'Ganadores',        href: '/ganadores' },
    { label: 'Mi Participación', href: '/mi-participacion' },
];

export default function PublicLayout({ children }) {
    const { config_publica, flash, auth } = usePage().props;
    const { url } = usePage();

    const [menuOpen, setMenu]   = useState(false);
    const [toast, setToast]     = useState(null);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(t);
    }, [flash]);

    // Cierra menú al navegar
    useEffect(() => { setMenu(false); }, [url]);

    const nombre  = config_publica?.nombre_negocio || 'Bingos Pao';
    const logoUrl = config_publica?.logo_url;
    const alerta  = config_publica?.alerta_seguridad_texto;
    const titular = config_publica?.titular_pago;

    function nav(href) {
        router.visit(href);
    }

    function isActive(href) {
        if (href === '/') return url === '/' || url === '';
        return url.startsWith(href);
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-900 font-[Outfit,sans-serif] text-white">
            {/* Toast */}
            {toast && (
                <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
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

            {/* Navbar sticky */}
            <header className="sticky top-0 z-30 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">

                    {/* Logo */}
                    <button type="button" onClick={() => nav('/')} className="flex shrink-0 items-center gap-2.5">
                        {logoUrl ? (
                            <img src={logoUrl} alt={nombre} className="h-9 w-9 rounded-full object-cover ring-2 ring-pink-500/40" />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 text-sm font-bold">
                                {nombre.charAt(0)}
                            </div>
                        )}
                        <span className="font-[BebasNeue,sans-serif] text-xl tracking-wider text-pink-400">
                            {nombre}
                        </span>
                    </button>

                    {/* Nav desktop */}
                    <nav className="hidden items-center gap-1 md:flex">
                        {NAV.map(({ label, href }) => (
                            <button
                                key={href}
                                type="button"
                                onClick={() => nav(href)}
                                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                    isActive(href)
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </nav>

                    {/* Acciones desktop */}
                    <div className="hidden items-center gap-2 md:flex">
                        {auth?.user && (
                            <button
                                type="button"
                                onClick={() => nav('/admin')}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-slate-600 hover:text-white"
                            >
                                Admin
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => nav('/sorteos')}
                            className="rounded-lg bg-pink-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-pink-900/40 transition-colors hover:bg-pink-700"
                        >
                            Participar
                        </button>
                    </div>

                    {/* Hamburguesa móvil */}
                    <button
                        type="button"
                        onClick={() => setMenu((o) => !o)}
                        className="rounded-md p-2 text-slate-400 hover:text-white md:hidden"
                        aria-label="Menú"
                    >
                        {menuOpen ? <IconX /> : <IconMenu />}
                    </button>
                </div>

                {/* Menú móvil desplegable */}
                {menuOpen && (
                    <div className="border-t border-slate-700/50 bg-slate-900 px-4 pb-4 md:hidden">
                        <nav className="flex flex-col gap-1 pt-2">
                            {NAV.map(({ label, href }) => (
                                <button
                                    key={href}
                                    type="button"
                                    onClick={() => nav(href)}
                                    className={`rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                                        isActive(href)
                                            ? 'bg-slate-800 text-white'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </nav>
                        <button
                            type="button"
                            onClick={() => nav('/sorteos')}
                            className="mt-3 w-full rounded-lg bg-pink-600 py-2.5 text-sm font-semibold text-white hover:bg-pink-700"
                        >
                            Participar ahora
                        </button>
                    </div>
                )}
            </header>

            {/* Contenido */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-700/50 bg-slate-800/50">
                <div className="mx-auto max-w-5xl px-4 py-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <span className="font-[BebasNeue,sans-serif] text-lg tracking-wider text-pink-400">
                            {nombre}
                        </span>
                        <p className="text-xs text-slate-500">
                            Pagos únicamente por Yape / Plin
                            {titular && <> · Titular: <span className="text-slate-400">{titular}</span></>}
                        </p>
                        <nav className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
                            {NAV.map(({ label, href }) => (
                                <button key={href} type="button" onClick={() => nav(href)}
                                    className="hover:text-slate-300">
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function IconMenu() {
    return (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function IconX() {
    return (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}
