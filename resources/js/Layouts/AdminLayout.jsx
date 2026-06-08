import { router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const NAV_MAIN = [
    { label: 'Dashboard',     href: '/admin',               icon: IconGrid },
    { label: 'Sorteos',       href: '/admin/sorteos',        icon: IconTicket },
    { label: 'Nuevo Sorteo',  href: '/admin/sorteos/create', icon: IconPlus },
    { label: 'Participantes', href: '/admin/participantes',  icon: IconUsers },
    { label: 'Ganadores',     href: '/admin/ganadores',      icon: IconTrophy },
];

const NAV_CONFIG = [
    { label: 'Transmisión',   href: '/admin/transmision',   icon: IconVideo },
    { label: 'Configuración', href: '/admin/configuracion', icon: IconSettings },
];

export default function AdminLayout({ children }) {
    const { auth, pendientes_count, config_publica, flash } = usePage().props;
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const negocio = config_publica?.nombre_negocio || 'Bingos Pao';
    const logoUrl  = config_publica?.logo_url;

    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (!msg) return;
        setToast({ msg, type: flash.success ? 'success' : 'error' });
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    function logout() { router.post('/logout'); }

    function isActive(href) {
        if (href === '/admin') return url === '/admin' || url === '/admin/';
        return url.startsWith(href);
    }

    const NavItem = ({ label, href, icon: Icon }) => {
        const active = isActive(href);
        const badge  = label === 'Participantes' && pendientes_count > 0 ? pendientes_count : null;
        return (
            <a
                key={href}
                href={href}
                onClick={(e) => { e.preventDefault(); setSidebarOpen(false); router.visit(href); }}
                className={[
                    'flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                    active
                        ? 'border-l-gold bg-gold/10 text-gold'
                        : 'border-l-transparent text-muted hover:bg-surface2 hover:text-cream',
                ].join(' ')}
            >
                <Icon className="size-5 shrink-0" />
                <span className="flex-1">{label}</span>
                {badge && (
                    <span className={[
                        'rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-bold leading-none text-white',
                        pendientes_count > 0 ? 'animate-pulse' : '',
                    ].join(' ')}>
                        {badge}
                    </span>
                )}
            </a>
        );
    };

    const sidebarContent = (
        <nav className="flex flex-col gap-0.5 p-3">
            {NAV_MAIN.map((item) => <NavItem key={item.href} {...item} />)}

            <div className="my-2 border-t border-gold/10" />

            {NAV_CONFIG.map((item) => <NavItem key={item.href} {...item} />)}
        </nav>
    );

    return (
        <div className="flex h-screen bg-bg font-sans">
            {/* Overlay móvil */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/70 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={[
                'fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-surface transition-transform duration-300 lg:static lg:translate-x-0',
                'border-r border-gold/20',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}>

                {/* Logo / Nombre */}
                <div className="flex shrink-0 flex-col items-center justify-center gap-3 border-b border-gold/20 py-6">
                    {logoUrl ? (
                        <>
                            <div className="flex size-16 items-center justify-center rounded-full border-2 border-gold/60 bg-surface2 p-1 ring-4 ring-gold/20 shadow-glow-gold">
                                <img src={logoUrl} alt={negocio} className="size-full rounded-full object-cover" />
                            </div>
                            <span className="font-display text-xl tracking-widest text-gold">{negocio}</span>
                        </>
                    ) : (
                        <>
                            <div className="flex size-14 items-center justify-center rounded-lg bg-gold text-2xl font-bold text-bg shadow-glow-gold">
                                {negocio.charAt(0)}
                            </div>
                            <span className="font-display text-xl tracking-widest text-gold">{negocio}</span>
                        </>
                    )}
                    <span className="text-[10px] uppercase tracking-widest text-muted/60">Panel de administración</span>
                </div>

                <div className="flex-1 overflow-y-auto py-2">{sidebarContent}</div>
            </aside>

            {/* Área principal */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-gold/20 bg-surface px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="rounded-md p-2 text-muted hover:text-cream lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <IconMenu className="size-6" />
                        </button>
                        <span className="hidden font-display text-lg tracking-widest text-gold lg:block">
                            {negocio}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted">
                            {auth?.user?.name ?? 'Admin'}
                        </span>
                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center gap-1.5 rounded-md border border-gold/30 px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-150 hover:border-gold/60 hover:text-cream"
                        >
                            <IconLogout className="size-3.5" />
                            Salir
                        </button>
                    </div>
                </header>

                {/* Contenido */}
                <main className="flex-1 overflow-y-auto bg-bg p-4 text-content lg:p-6">
                    {children}
                </main>
            </div>

            {/* Toast unificado */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        key={toast.msg}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 80 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={[
                            'fixed bottom-5 right-5 z-50 max-w-xs overflow-hidden rounded-lg shadow-2xl',
                            toast.type === 'success'
                                ? 'bg-surface border border-success/30'
                                : 'bg-surface border border-danger/30',
                        ].join(' ')}
                    >
                        <div className="flex items-start gap-3 px-4 py-3">
                            <span className={toast.type === 'success' ? 'text-success' : 'text-danger'}>
                                {toast.type === 'success' ? <IconCheckCircle /> : <IconXCircle />}
                            </span>
                            <p className="text-sm text-content">{toast.msg}</p>
                        </div>
                        {/* Barra de progreso */}
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: 4, ease: 'linear' }}
                            style={{ originX: 0 }}
                            className={[
                                'h-[3px]',
                                toast.type === 'success' ? 'bg-success/60' : 'bg-danger/60',
                            ].join(' ')}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ── Iconos SVG inline ── */
function IconGrid({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}
function IconTicket({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2zm-6 6h6m-6 3h4" />
        </svg>
    );
}
function IconPlus({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    );
}
function IconUsers({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m22 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );
}
function IconVideo({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
    );
}
function IconTrophy({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m-5-8H5a2 2 0 01-2-2V7h18v4a2 2 0 01-2 2h-2m-8 0h8m-8 0a5 5 0 0010 0" />
        </svg>
    );
}
function IconSettings({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}
function IconMenu({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}
function IconLogout({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );
}
function IconCheckCircle() {
    return (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}
function IconXCircle() {
    return (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}
