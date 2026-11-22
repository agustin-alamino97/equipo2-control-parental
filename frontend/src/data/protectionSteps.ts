export type ProtectionStep = {
    subtitle: string;
    description?: string;
    warning?: string;
    instructions: string[];
    help: boolean;
    requiresCode?: boolean;
};

export const PROTECTION_STEPS: ProtectionStep[] = [
    {
        subtitle: 'Activá la accesibilidad',
        instructions: [
            'Abrí la sección Aplicaciones descargadas.',
            'Seleccioná BA Protege+.',
            'Habilitá la aplicación marcando la casilla.',
            'Aceptar.',
        ],
        help: true,
    },
    {
        subtitle: 'Fijá BA Protege+ en el dispositivo del menor.',
        description: 'De esta manera el menor no podrá apagar la aplicación.',
        instructions: [
            'Ve al menú Aceleración.',
            'Seleccioná la sección Aplicaciones Fijadas.',
            'Habilitá la opción BA Protege+.',
            'Aceptar.',
        ],
        help: true,
    },
    {
        subtitle: 'Activá el inicio automático',
        description: 'Para bloquear los sitios de apuestas ilegales en cualquier momento.',
        instructions: ['Encuentra y activa BA Protege+ en el dispositivo.'],
        help: true,
    },
    {
        subtitle: 'Activá la protección contra eliminación.',
        description: 'Para evitar que el menor borre accidentalmente la app.',
        instructions: [
            'Pulsá el botón Activar la app de administrador.',
            'Marcá la casilla y pulsá aceptar.',
        ],
        help: true,
    },
    {
        subtitle: 'Permitir notificaciones',
        description:
            'Para mantener informado sobre todos los cambios y actividades de los dispositivos vinculados.',
        instructions: [],
        help: false,
    },
    {
        subtitle: 'Permitir trabajar en segundo plano',
        description: 'Para reducir el gasto de batería',
        instructions: ['Seleccioná y activá la opción Sin restricciones.'],
        help: true,
    },
    {
        subtitle: 'Establecé un nuevo código de acceso de cinco dígitos',
        description:
            'Para que puedas desbloquear fácilmente el dispositivo del menor si es necesario.',
        warning:
            'No uses combinaciones simples como "1234" o una fecha de nacimiento, dado que podría descifrarse fácilmente.',
        instructions: [],
        help: false,
        requiresCode: true,
    },
    {
        subtitle: 'Repetí el código de acceso',
        description:
            'Para que puedas desbloquear fácilmente el dispositivo del menor si es necesario.',
        warning:
            'No uses combinaciones simples como "1234" o una fecha de nacimiento, dado que podría descifrarse fácilmente.',
        instructions: [],
        help: false,
        requiresCode: true,
    },
];