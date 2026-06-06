import { router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const NAV = [
    { label: 'Inicio',           href: '/' },
    { label: 'Sorteo Activo',    href: '/sorteos' },
    { label: 'Ganadores',        href: '/ganadores' },
    { label: 'Mi Participación', href: '/mi-participacion' },
];

const navUnderline = {
    rest:  { scaleX: 0 },
    hover: { scaleX: 1, transition: { duration: 0.2, ease: 'easeOut' } },
};

export default function PublicLayout({ children }) {
    const { config_publica, flash, auth } = usePage().props;
    const { url } = usePage();

    const [menuOpen, setMenu] = useState(false);
    const [toast, setToast]   = useState(null);

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(t);
    }, [flash]);

    useEffect(() => { setMenu(false); }, [url]);

    const nombre  = config_publica?.nombre_negocio || 'Bingos Pao';
    const logoUrl = config_publica?.logo_url;
    const alerta  = config_publica?.alerta_seguridad_texto;
    const titular = config_publica?.titular_pago;

    function isActive(href) {
        if (href === '/') return url === '/' || url === '';
        return url.startsWith(href);
    }

    return (
        <div className="flex min-h-screen flex-col bg-bg font-sans text-content">
            {/* Toast */}
            {toast && (
                <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-xl ${
                    toast.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'
                }`}>
                    {toast.msg}
                </div>
            )}

            {/* Banner alerta */}
            {alerta && (
                <div className="border-b border-danger/40 bg-danger/10 px-4 py-2 text-center text-xs font-medium text-cream">
                    ⚠ {alerta}
                </div>
            )}

            {/* Navbar — slide down al montar */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="sticky top-0 z-30 border-b border-gold/20 bg-bg/95 backdrop-blur"
            >
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">

                    {/* Logo */}
                    <button type="button" onClick={() => router.visit('/')} className="flex shrink-0 items-center gap-3">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={nombre}
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-gold/50"
                            />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-bold text-bg">
                                {nombre.charAt(0)}
                            </div>
                        )}
                        <span className="font-display text-xl tracking-widest text-gold">{nombre}</span>
                    </button>

                    {/* Nav desktop con underline animado */}
                    <nav className="hidden items-center gap-1 md:flex">
                        {NAV.map(({ label, href }) => {
                            const active = isActive(href);
                            if (active) {
                                return (
                                    <button
                                        key={href}
                                        type="button"
                                        onClick={() => router.visit(href)}
                                        className="relative px-3 py-1.5 text-sm text-gold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-full after:bg-gold after:content-['']"
                                    >
                                        {label}
                                    </button>
                                );
                            }
                            return (
                                <motion.button
                                    key={href}
                                    type="button"
                                    initial="rest"
                                    whileHover="hover"
                                    animate="rest"
                                    onClick={() => router.visit(href)}
                                    className="relative px-3 py-1.5 text-sm text-muted transition-colors hover:text-cream"
                                >
                                    {label}
                                    <motion.span
                                        variants={navUnderline}
                                        className="absolute bottom-0 left-3 right-3 h-[2px] origin-left bg-gold/60"
                                    />
                                </motion.button>
                            );
                        })}
                    </nav>

                    {/* Acciones desktop */}
                    <div className="hidden items-center gap-2 md:flex">
                        {auth?.user && (
                            <button
                                type="button"
                                onClick={() => router.visit('/admin')}
                                className="rounded-lg border border-gold/30 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-gold/60 hover:text-cream"
                            >
                                Admin
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => router.visit('/sorteos')}
                            className="rounded-lg bg-gold px-5 py-1.5 text-sm font-bold text-bg transition-colors hover:bg-gold-light"
                        >
                            Participar
                        </button>
                    </div>

                    {/* Hamburguesa */}
                    <button
                        type="button"
                        onClick={() => setMenu((o) => !o)}
                        className="rounded-md p-2 text-muted hover:text-cream md:hidden"
                        aria-label="Menú"
                    >
                        {menuOpen ? <IconX /> : <IconMenu />}
                    </button>
                </div>

                {/* Menú móvil */}
                {menuOpen && (
                    <div className="border-t border-gold/20 bg-surface px-4 pb-4 md:hidden">
                        <nav className="flex flex-col gap-1 pt-2">
                            {NAV.map(({ label, href }) => (
                                <button
                                    key={href}
                                    type="button"
                                    onClick={() => router.visit(href)}
                                    className={[
                                        'rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                                        isActive(href)
                                            ? 'bg-surface2 text-gold'
                                            : 'text-muted hover:bg-surface2 hover:text-cream',
                                    ].join(' ')}
                                >
                                    {label}
                                </button>
                            ))}
                        </nav>
                        <button
                            type="button"
                            onClick={() => router.visit('/sorteos')}
                            className="mt-3 w-full rounded-lg bg-gold py-2.5 text-sm font-bold text-bg hover:bg-gold-light"
                        >
                            Participar ahora
                        </button>
                    </div>
                )}
            </motion.header>

            {/* Contenido */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t border-gold/20 bg-surface">
                <div className="mx-auto max-w-5xl px-4 py-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <span className="font-display text-lg tracking-widest text-gold">{nombre}</span>
                        <p className="text-xs text-muted">
                            Pagos únicamente por Yape / Plin
                            {titular && (
                                <> · Titular: <span className="text-content">{titular}</span></>
                            )}
                        </p>
                        <nav className="flex flex-wrap justify-center gap-4 text-xs text-muted">
                            {NAV.map(({ label, href }) => (
                                <button key={href} type="button" onClick={() => router.visit(href)}
                                    className="transition-colors hover:text-gold">
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
