# AGENT_TASKS — Bingos Pao

Tareas ordenadas por fase. Cada una incluye el prompt listo para copiar al agente.
Marca con [x] al completar. Lee AGENT_CONTEXT.md antes de cada sesión.

---

## FASE 1 — Base de datos y modelos

### TAREA 1.1 — Migraciones
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea las migraciones de Laravel para las siguientes tablas en el orden exacto (respetar foreign keys):
1. sorteos
2. premios (FK → sorteos)
3. participantes (FK → sorteos)
4. ganadores (FK → sorteos, participantes, premios)
5. configuracion (clave como PK string, sin id autoincrement)

Usa los tipos exactos del modelo de datos en AGENT_CONTEXT.md.
Archivo de salida: database/migrations/
Un archivo por tabla. Nombra los archivos con timestamps consecutivos.
```

---

### TAREA 1.2 — Modelos Eloquent
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea los modelos Eloquent para: Sorteo, Premio, Participante, Ganador, Configuracion.
Incluir en cada modelo:
- $fillable completo
- Relaciones (hasMany, belongsTo, etc.)
- Casts necesarios (enums, booleans, decimals)
- En Sorteo: scope activos() que filtra estado = 'activo'
- En Participante: método generarNumeroRegistro() que asigna el siguiente número correlativo por sorteo formateado como #0001
- En Configuracion: método estático get(string $clave): ?string y set(string $clave, string $valor): void

Archivos de salida: app/Models/
```

---

## FASE 2 — Panel Admin

### TAREA 2.1 — Rutas y layout admin
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

1. Crea routes/admin.php con todas las rutas del panel admin bajo prefijo /admin y middleware auth. Recursos: sorteos, premios (anidado bajo sorteos), participantes (anidado bajo sorteos), ganadores, configuracion, transmision.
2. Registra routes/admin.php en bootstrap/app.php o RouteServiceProvider.
3. Crea resources/js/Layouts/AdminLayout.jsx: sidebar con los 8 items de navegación (Dashboard, Sorteos, Nuevo Sorteo, Premios, Participantes, Transmisión, Ganadores, Configuración), topbar con nombre del usuario y botón logout, área de contenido principal. Responsive: sidebar colapsado en móvil.
4. El sidebar debe resaltar el item activo usando la URL actual (Inertia usePage().url).
```

---

### TAREA 2.2 — Dashboard admin
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea AdminController con método dashboard() que pase a la vista:
- sorteos_activos: count de sorteos con estado activo
- participantes_hoy: count de participantes creados hoy
- comprobantes_pendientes: count de participantes con estado pendiente
- pozo_acumulado: valor de configuracion donde clave = 'pozo_acumulado' (puede no existir)
- actividad_reciente: últimos 8 participantes con nombre del sorteo, ordenados por created_at desc

Vista: resources/js/Pages/Admin/Dashboard.jsx
Mostrar stats en tarjetas y tabla de actividad reciente.
Usar AdminLayout.
```

---

### TAREA 2.3 — CRUD Sorteos
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea SorteoController (app/Http/Controllers/Admin/) con métodos: index, create, store, edit, update, destroy, toggleEstado.
Crea StoreSorteoRequest y UpdateSorteoRequest con validación completa.
toggleEstado cambia: borrador → activo → cerrado (no reversible a borrador).
destroy solo permitido si estado = borrador o sin participantes.

Vistas React:
- Admin/Sorteos/Index.jsx: tabla con nombre, tipo, fecha, precio, participantes count, estado (badge), acciones (editar, cambiar estado, eliminar)
- Admin/Sorteos/Form.jsx: formulario compartido para crear y editar (campos: nombre, tipo select, fecha_sorteo datetime, precio_participacion, descripcion textarea)

Usar AdminLayout. Flash messages de éxito/error con usePage().props.flash.
```

---

### TAREA 2.4 — CRUD Premios
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea PremioController (Admin/) anidado bajo sorteos (/admin/sorteos/{sorteo}/premios).
Métodos: index, store, update, destroy.
Los premios se gestionan desde la misma página del sorteo (no página separada).

Vista: Admin/Premios/Index.jsx
Mostrar nombre del sorteo en el header.
Lista de premios con: nombre, cantidad, monto (o descripcion si no tiene monto), visible (toggle), orden.
Formulario inline o modal para agregar/editar premio.
Botón eliminar con confirmación.
```

---

### TAREA 2.5 — Gestión de participantes y comprobantes
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea ParticipanteController (Admin/) con métodos: index (filtrable por sorteo y estado), show, confirmar, rechazar.

confirmar(): cambia estado a confirmado, llama participante.generarNumeroRegistro(), guarda.
rechazar(): requiere nota_interna, cambia estado a rechazado.

Vista: Admin/Participantes/Index.jsx
- Selector de sorteo en el top
- Tabs o filtro: Todos / Pendientes / Confirmados / Rechazados
- Tabla: número_registro, nombre completo, whatsapp, fecha registro, estado badge, botón Ver
- Badge con count de pendientes en sidebar (pasar desde el layout via shared props)

Vista: Admin/Participantes/Show.jsx
- Datos del participante
- Imagen del comprobante renderizada (img tag con URL del storage)
- Botones: CONFIRMAR (verde) / RECHAZAR (rojo, abre campo de nota)
- Estado actual visible
```

---

### TAREA 2.6 — Registro de ganadores
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea GanadorController (Admin/) métodos: index, store, togglePublicado.
store(): recibe sorteo_id, participante_id (debe ser confirmado), premio_id. Crea ganador.
togglePublicado(): alterna publicado true/false.

Vista: Admin/Ganadores/Index.jsx
- Formulario para registrar ganador: select sorteo → select participante confirmado → select premio del sorteo
- Tabla de ganadores registrados: nombre, premio, sorteo, publicado (toggle), fecha
```

---

### TAREA 2.7 — Transmisión en vivo
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea TransmisionController (Admin/) con método index (GET, muestra form) y update (POST, guarda).
Guarda/lee desde tabla configuracion las claves: url_stream_live, url_stream_grabado, estado_stream, mensaje_destacado.

Vista: Admin/Transmision/Index.jsx
- Campo URL en vivo
- Campo URL última transmisión grabada
- Select estado: en_vivo | sin_transmision | proximamente
- Campo mensaje destacado
- Botón guardar
- Feedback de guardado exitoso
```

---

### TAREA 2.8 — Configuración general
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea ConfiguracionController (Admin/) con index (GET) y update (POST).
Maneja subida de archivos para: logo (logo_path), QR Yape (qr_yape_path), QR Plin (qr_plin_path).
Archivos subidos a storage/app/public/ con enlace simbólico (php artisan storage:link).
Guarda rutas en tabla configuracion.
Resto de campos son texto simple guardados en configuracion.

Vista: Admin/Configuracion/Index.jsx
Campos: nombre_negocio, titular_pago, whatsapp_contacto, logo (file upload con preview), qr_yape (file upload con preview), qr_plin (file upload con preview), alerta_seguridad_texto, url_facebook, url_instagram, url_tiktok, terminos_condiciones (textarea grande).
```

---

## FASE 3 — Vistas Públicas

### TAREA 3.1 — Layout público y Landing
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

1. Crea resources/js/Layouts/PublicLayout.jsx: navbar sticky con logo desde configuracion, links de navegación (Inicio, Sorteo Activo, Ganadores, Mi Participación), botón CTA "Participar", menú hamburguesa en móvil. Footer con datos de configuracion.

2. Crea LandingController (Public/) que pase a la vista:
- sorteos_activos: sorteos con estado activo, con sus premios visibles
- ganadores_recientes: últimos 5 ganadores publicados
- config: array con claves necesarias de configuracion (nombre_negocio, alerta_seguridad_texto, url_stream_live, url_stream_grabado, estado_stream, mensaje_destacado, titular_pago)
- proxima_fecha: fecha_sorteo del próximo sorteo activo

3. Vista: Public/Landing.jsx con secciones: hero, stream, countdown (calcular diff desde proxima_fecha en JS), grid de sorteos activos, banner de seguridad.
Usar PublicLayout.
```

---

### TAREA 3.2 — Página de sorteo activo y formulario
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea SorteoPublicoController (Public/) método show($id).
Pasa a la vista: el sorteo con sus premios visibles, config (qr_yape_path, qr_plin_path, titular_pago, whatsapp_contacto, precio implícito del sorteo).

Vista: Public/Sorteo.jsx
- Header: nombre del sorteo, fecha, countdown
- Columna izquierda: lista de premios, instrucciones paso a paso
- Columna derecha: 
  * Precio del sorteo destacado
  * Dos tarjetas QR (Yape y Plin) con imagen desde storage y nombre del titular
  * Nota "Toma captura antes de continuar"
  * Formulario: nombres, apellidos, whatsapp, file upload comprobante, checkbox términos
  * Botón ENVIAR REGISTRO

store(): valida campos, guarda participante con estado pendiente, sube comprobante a storage/app/public/comprobantes/, guarda path. Retorna con flash de éxito y número de registro si está en pendiente, o mensaje de confirmación.
```

---

### TAREA 3.3 — Mi Participación
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea MiParticipacionController (Public/) métodos: index (GET, muestra buscador), buscar (POST, recibe whatsapp o dni).
Busca por campo whatsapp en participantes. Retorna lista con: numero_registro, nombre del sorteo, fecha_sorteo, estado.
No exponer datos sensibles: sin comprobante_path, sin nota_interna.

Vista: Public/MiParticipacion.jsx
- Buscador con input y botón
- Lista de resultados con estado badge (CONFIRMADO verde / PENDIENTE dorado / FINALIZADO gris)
- Estado vacío si no hay resultados
Usar PublicLayout.
```

---

### TAREA 3.4 — Ganadores públicos
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Crea GanadoresPublicoController (Public/) método index.
Retorna ganadores donde publicado = true, con nombre parcialmente ofuscado (función helper: "María Fernández" → "María F. ****"), premio, sorteo, fecha.
Filtrable por sorteo_id (query param).

Vista: Public/Ganadores.jsx
- Dropdown filtro por sorteo
- Grid de tarjetas: avatar con inicial, nombre ofuscado, monto en dorado, tipo de premio, sorteo y fecha
Usar PublicLayout.
```

---

## FASE 4 — Ajustes finales

### TAREA 4.1 — Identidad visual y paleta
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Aplica la paleta de colores y tipografías definidas al proyecto:
1. Importa Bebas Neue y Outfit desde Google Fonts en el layout Blade principal (resources/views/app.blade.php)
2. Configura las variables de color en tailwind.config.js o el CSS base según la paleta aprobada
3. Aplica fuentes base: Outfit para body, Bebas Neue disponible como clase utility

No modificar lógica de componentes, solo estilos globales y configuración de Tailwind.
```

---

### TAREA 4.2 — Shared props y pendientes badge
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

En HandleInertiaRequests middleware, agregar a share():
- auth.user: usuario autenticado si existe
- flash: mensajes flash (success, error)
- config_publica: array con claves públicas de configuracion (nombre_negocio, logo_path, alerta_seguridad_texto, titular_pago)
- pendientes_count: count de participantes con estado pendiente (solo si usuario autenticado)

Actualizar AdminLayout.jsx y PublicLayout.jsx para consumir estas shared props en lugar de recibirlas por props individuales.
```

---

### TAREA 4.3 — Deploy Railway
**Estado:** [ ]

**Prompt:**
```
Contexto: Lee AGENT_CONTEXT.md del proyecto.

Prepara el proyecto para deploy en Railway:
1. Crea Procfile con: web: php artisan serve --host=0.0.0.0 --port=$PORT
2. Crea railway.json con configuración de build (npm run build antes de deploy)
3. Lista las variables de entorno necesarias en .env.example actualizado (sin valores reales)
4. Agrega php artisan storage:link y php artisan migrate --force al proceso de deploy
5. Documenta los pasos exactos para configurar el proyecto en Railway desde GitHub en un archivo DEPLOY.md
```

---

## Orden de ejecución recomendado
1.1 → 1.2 → 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6 → 2.7 → 2.8 → 4.2 → 3.1 → 3.2 → 3.3 → 3.4 → 4.1 → 4.3
