export type HistoryEntry = {
    id: string;
    date: string;
    description: string;
    unread: boolean;
    kind: 'blocked' | 'linked' | 'unlinked' | 'uninstall-attempt' | 'allowed';
};

export const HISTORY_ENTRIES: HistoryEntry[] = [
    {
        id: 'h-1',
        date: '11-09-26',
        description: 'El dispositivo Celular de Cami intentó ingresar a www.aposta.com',
        unread: true,
        kind: 'blocked',
    },
    {
        id: 'h-2',
        date: '27-10-26',
        description: 'El dispositivo Celular de Cami fue vinculado.',
        unread: false,
        kind: 'linked',
    },
    {
        id: 'h-3',
        date: '13-10-26',
        description: 'El dispositivo Notebook de mamá ha sido desvinculado.',
        unread: false,
        kind: 'unlinked',
    },
    {
        id: 'h-4',
        date: '22-09-26',
        description:
            'El dispositivo Tablet de Nico intentó desinstalar la aplicación BA Protege+.',
        unread: false,
        kind: 'uninstall-attempt',
    },
];

// Historial reducido que usa el screen nuevo (HistoryScreen.tsx)
export type RecentHistoryEntry = {
    id: string;
    time: string;
    site: string;
    detail: string;
    blocked: boolean;
};

export const RECENT_HISTORY: RecentHistoryEntry[] = [
    { id: 'r-1', time: '10:42', site: 'deportes.com', detail: 'Sitio bloqueado', blocked: true },
    { id: 'r-2', time: '10:18', site: 'noticias.com', detail: 'Navegación permitida', blocked: false },
    {
        id: 'r-3',
        time: 'Ayer · 19:36',
        site: 'apuestas-online.com',
        detail: 'Sitio bloqueado',
        blocked: true,
    },
];