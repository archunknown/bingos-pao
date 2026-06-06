import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const NAV_ITEMS = [
    { label: 'Dashboard',     href: '/admin',               icon: IconGrid },
    { label: 'Sorteos',       href: '/admin/sorteos',        icon: IconTicket },
    { label: 'Nuevo Sorteo',  href: '/admin/sorteos/create', icon: IconPlus },
    { label: 'Premios',       href: '/admin/premios',        icon: IconGift },
    { label: 'Participantes', href: '/admin/participantes',  icon: IconUsers },
    { label: 'Transmisión',   href: '/admin/transmision',    icon: IconVideo },
    { label: 'Ganadores',     href: '/admin/ganadores',      icon: IconTrophy },
    { label: 'Configuración', href: '/admin/configuracion',  icon: IconSettings },
];

export default function AdminLayout({ children }) {
    const { url, auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function logout() {
        router.post('/logout');
    }

    function isActive(href) {
        const { url = '' } = usePage();
        if (href === '/admin') return url === '/admin' || url === '/admin/';
        return url.startsWith(href);
    }

    const sidebarContent = (
        <nav className="flex flex-col gap-1 p-4">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
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
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            active
                                ? 'bg-pink-600 text-white'
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                        ].join(' ')}
                    >
                        <Icon className="size-5 shrink-0" />
                        {label}
                    </a>
                );
            })}
        </nav>
    );

    return (
        <div className="flex h-screen bg-slate-900 font-[Outfit,sans-serif]">
            {/* Overlay móvil */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={[
                    'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-800 transition-transform duration-300 lg:static lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                ].join(' ')}
            >
                {/* Logo */}
                <div className="flex h-16 shrink-0 items-center px-6">
                    <span className="font-[BebasNeue,sans-serif] text-2xl tracking-wider text-pink-400">
                        Bingos Pao
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
            </aside>

            {/* Área principal */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-800 px-4 lg:px-6">
                    {/* Botón hamburguesa (móvil) */}
                    <button
                        type="button"
                        className="rounded-md p-2 text-slate-400 hover:text-white lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Abrir menú"
                    >
                        <IconMenu className="size-6" />
                    </button>

                    <div className="hidden text-sm text-slate-400 lg:block">
                        Panel de administración
                    </div>

                    {/* Usuario + logout */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-300">
                            {auth?.user?.name ?? 'Admin'}
                        </span>
                        <button
                            type="button"
                            onClick={logout}
                            className="rounded-md bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-pink-600 hover:text-white"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </header>

                {/* Contenido */}
                <main className="flex-1 overflow-y-auto p-4 text-white lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

/* ── Iconos SVG inline (sin dependencia externa) ── */

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
function IconGift({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12m16-4H4a2 2 0 010-4h16a2 2 0 010 4zM12 8v14M8 8a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2M16 8a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2" />
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
