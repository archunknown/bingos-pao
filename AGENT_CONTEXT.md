# AGENT_CONTEXT — Bingos Pao

## Proyecto
Plataforma web para sorteos y bingos virtuales en vivo (Facebook Live). Sin e-commerce. El participante paga por Yape/Plin externamente y registra su comprobante en la web. La web promueve sorteos, recibe registros con comprobante, y permite a la administradora gestionar todo.

## Stack
- Laravel 13 + Inertia.js + React 18
- Tailwind CSS v4
- MariaDB (local) / MySQL (producción Railway)
- Node 24 / npm 11 / Composer 2.10
- PHP 8.5

## Repositorio
https://github.com/archunknown/bingos-pao  
Rama principal: `main`

## Estructura de carpetas relevante
```
bingos-pao/
├── app/
│   ├── Http/Controllers/        # Controladores Laravel
│   │   ├── Admin/               # Controladores del panel admin
│   │   └── Public/              # Controladores de vistas públicas
│   └── Models/                  # Modelos Eloquent
├── database/
│   └── migrations/              # Migraciones
├── resources/
│   └── js/
│       ├── Pages/
│       │   ├── Admin/           # Vistas React del panel admin
│       │   └── Public/          # Vistas React públicas
│       ├── Components/          # Componentes reutilizables
│       └── Layouts/             # Layouts base
├── routes/
│   ├── web.php                  # Rutas públicas
│   └── admin.php                # Rutas admin (protegidas)
└── .env                         # DB_CONNECTION=mysql
```

## Modelo de datos

### sorteos
| Campo | Tipo |
|---|---|
| id | BIGINT PK |
| nombre | VARCHAR(200) |
| tipo | ENUM(bingo, pozito, especial, aniversario) |
| fecha_sorteo | DATETIME |
| precio_participacion | DECIMAL(8,2) |
| descripcion | TEXT nullable |
| estado | ENUM(borrador, activo, cerrado) |
| timestamps | — |

### premios
| Campo | Tipo |
|---|---|
| id | BIGINT PK |
| sorteo_id | FK → sorteos |
| nombre | VARCHAR(100) |
| cantidad | INT default 1 |
| monto | DECIMAL(10,2) nullable |
| descripcion_premio | VARCHAR(200) nullable |
| visible | BOOLEAN default true |
| orden | INT default 0 |
| timestamps | — |

### participantes
| Campo | Tipo |
|---|---|
| id | BIGINT PK |
| sorteo_id | FK → sorteos |
| nombres | VARCHAR(100) |
| apellidos | VARCHAR(100) |
| whatsapp | VARCHAR(20) |
| numero_registro | VARCHAR(10) nullable |
| comprobante_path | VARCHAR(500) |
| estado | ENUM(pendiente, confirmado, rechazado) default pendiente |
| nota_interna | TEXT nullable |
| timestamps | — |

### ganadores
| Campo | Tipo |
|---|---|
| id | BIGINT PK |
| sorteo_id | FK → sorteos |
| participante_id | FK → participantes |
| premio_id | FK → premios |
| publicado | BOOLEAN default false |
| created_at | TIMESTAMP |

### configuracion
| Campo | Tipo |
|---|---|
| clave | VARCHAR(100) PK |
| valor | TEXT |
| updated_at | TIMESTAMP |

**Claves de configuracion:** nombre_negocio, titular_pago, whatsapp_contacto, logo_path, qr_yape_path, qr_plin_path, alerta_seguridad_texto, url_facebook, url_instagram, url_tiktok, url_stream_live, url_stream_grabado, estado_stream, mensaje_destacado, terminos_condiciones

## Convenciones
- Controladores en español para nombres de dominio (Sorteo, Participante, Premio, Ganador)
- Métodos de controlador en inglés (index, store, update, destroy)
- Rutas admin bajo prefijo `/admin` con middleware `auth`
- Rutas públicas sin autenticación
- Validación en Form Requests, no en controladores
- Respuestas Inertia con `Inertia::render('Carpeta/Componente', $data)`
- Un componente React por vista, props tipadas
- Tailwind para todos los estilos, sin CSS externo salvo fuentes
- Sin lógica de negocio en controladores: usar métodos de modelo o servicios simples

## Fuentes (Google Fonts)
```html
Bebas Neue — display/títulos
Outfit — cuerpo/UI
```
Importar en el layout base de Blade.

## Autenticación
Laravel Breeze ya instalado. Un solo usuario admin. Ruta protegida: `/admin/*`.

## Estado actual
- [x] Laravel 13 + Inertia + React + Tailwind instalado
- [x] MariaDB configurado en .env
- [x] Repositorio GitHub inicializado
- [ ] Migraciones
- [ ] Modelos
- [ ] Rutas
- [ ] Controladores admin
- [ ] Vistas admin
- [ ] Controladores públicos
- [ ] Vistas públicas
- [ ] Storage para comprobantes
- [ ] Configuración general desde admin
- [ ] Deploy Railway
