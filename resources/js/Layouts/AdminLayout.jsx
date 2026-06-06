import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const NAV_ITEMS = [
    { label: 'Dashboard',     href: '/admin',               icon: IconGrid },
    { label: 'Sorteos',       href: '/admin/sorteos',        icon: IconTicket },
    { label: 'Nuevo Sorteo',  href: '/admin/sorteos/create', icon: IconPlus },
    { label: 'Participantes', href: '/admin/participantes',  icon: IconUsers },
    { label: 'Transmisión',   href: '/admin/transmision',    icon: IconVideo },
    { label: 'Ganadores',     href: '/admin/ganadores',      icon: IconTrophy },
    { label: 'Configuración', href: '/admin/configuracion',  icon: IconSettings },
];

export default function AdminLayout({ children }) {
    const { auth, pendientes_count, config_publica } = usePage().props;
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const negocio = config_publica?.nombre_negocio || 'Bingos Pao';

    function logout() {
        router.post('/logout');
    }

    function isActive(href) {
        if (href === '/admin') return url === '/admin' || url === '/admin/';
        return url.startsWith(href);
    }

    const sidebarContent = (
        <nav className="flex flex-col gap-0.5 p-3">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                const badge  = label === 'Participantes' && pendientes_count > 0
                    ? pendientes_count : null;

                return (
                    <a
                        key={href}
                        href={href}
                        onClick={(e) => {
                            e.preventDefault();
                            setSidebarOpen(false);
                            router.visit(href);
                        }}
                        className={[
                            'flex items-center gap-3 rounded-r-lg border-l-[3px] px-3 py-2.5 text-sm font-medium transition-colors',
                            active
                                ? 'border-l-gold bg-surface2 text-gold'
                                : 'border-l-transparent text-muted hover:bg-surface2 hover:text-cream',
                        ].join(' ')}
                    >
                        <Icon className="size-5 shrink-0" />
                        <span className="flex-1">{label}</span>
                        {badge && (
                            <span className="rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                                {badge}
                            </span>
                        )}
                    </a>
                );
            })}
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
            <aside
                className={[
                    'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-surface transition-transform duration-300 lg:static lg:translate-x-0',
                    'border-r border-gold/20',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                ].join(' ')}
            >
                {/* Logo / Nombre del negocio */}
                <div className="flex shrink-0 flex-col items-center justify-center gap-2 border-b border-gold/20 py-5">
                    {config_publica?.logo_url ? (
                        <>
                            <div className="flex size-16 items-center justify-center rounded-full border-2 border-gold/50 bg-surface2 p-1 ring-4 ring-gold/10">
                                <img
                                    src={config_publica.logo_url}
                                    alt={negocio}
                                    className="size-full rounded-full object-cover"
                                />
                            </div>
                            <span className="text-center text-xs font-medium tracking-widest text-muted">
                                {negocio}
                            </span>
                        </>
                    ) : (
                        <span className="font-display text-2xl tracking-widest text-gold">
                            {negocio}
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto py-2">{sidebarContent}</div>
            </aside>

            {/* Área principal */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-gold/20 bg-surface px-4 lg:px-6">
                    {/* Hamburguesa (móvil) + Nombre en desktop */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="rounded-md p-2 text-muted hover:text-cream lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <IconMenu className="size-6" />
                        </button>
                        <span className="hidden font-display text-xl tracking-widest text-gold lg:block">
                            {negocio}
                        </span>
                    </div>

                    {/* Usuario + logout */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gold">
                            {auth?.user?.name ?? 'Admin'}
                        </span>
                        <button
                            type="button"
                            onClick={logout}
                            className="rounded-md border border-gold/30 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-gold/60 hover:text-cream"
                        >
                            Salir
                        </button>
                    </div>
                </header>

                {/* Contenido */}
                <main className="flex-1 overflow-y-auto bg-bg p-4 text-content lg:p-6">
                    {children}
                </main>
            </div>
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
