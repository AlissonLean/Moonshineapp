# Moonshine Kaizen - Sistema de Gestión de Producción e Inventario

Aplicación integral para talleres de manufactura esbelta **Moonshine Kaizen** (fabricación y ensamble de estructuras tubulares, carros móviles de transporte, estaciones de trabajo ergonómicas, racks de kitting y líneas de ensamble PCBA).

El sistema cuenta con **Modo Estación de Producción Simplificado** para operadores de piso (sin necesidad de recordar números de nómina ni contraseñas), **85 Estructuras Reales de Moonshine pre-cargadas con Recetas BOM Preliminares**, **Control de Estatus de Receta (Completa / Incompleta)**, **Consumo Atómico y Automático de Materia Prima**, **Código Único de Acceso Administrativo (`4125715`)**, **Tablero Ejecutivo con Métricas de Estructuras y 5 Gráficas**, e **Historial de Auditoría Inmutable**.

---

## 🔐 Modelo de Acceso y Operación en Planta

La aplicación separa la interfaz en dos modalidades:

### 1. Modo Estación de Producción (Pantalla Principal por Defecto)
- **Destinado a:** Operadores en el taller Moonshine.
- **Acceso:** Inmediato y directo. No requiere contraseñas ni números de nómina.
- **Identificación:** Menú desplegable obligatorio con los **10 Operadores Reales de Moonshine**:
  - *Pedro Zavala*
  - *Carlos Barela*
  - *Daniel Jimenez*
  - *Brandon Avila*
  - *Brian Ortiz*
  - *Christian Garcia*
  - *Omar Osorio*
  - *Ivan Sanchez*
  - *Josue Gomez*
  - *Sergio Jimenez*
- **Validación Estricta:** No permite captura manual de texto; la selección de un operador de la lista es obligatoria antes de confirmar el lote de producción.
- **Catálogo de 85 Estructuras:** Selector agrupado por categorías (*Carros de Transporte*, *Mesas y Estaciones*, *Racks y Bastidores*, *Celdas PCBA*, *Ayudas Visuales y 5S*).
- **Protección de Datos:** Los operadores **NUNCA** ven existencias de almacén, recetas internas, costos unitarios ni valuaciones de inventario.
- **Consumo Automático:** Al registrar una estructura, el sistema descuenta automáticamente los materiales del inventario en segundo plano.

### 2. Área Administrativa (Código de Acceso: `4125715`)
- **Destinado a:** Supervisores, Ingenieros de Procesos y Administradores de Planta.
- **Acceso:** Botón **"Acceso Administrativo"** en la barra superior ingresando el código `4125715`.
- **Módulos Disponibles:**
  - Tablero Ejecutivo con métricas de estructuras, filtros por operador y 5 gráficas interactivas.
  - Inventario de Materia Prima (Altas, Bajas, Ediciones, Ajustes y Reabastecimiento).
  - Catálogo de 85 Estructuras y Editor de Recetas BOM (con buscador y filtros).
  - Libro Mayor de Producción con 4 filtros combinables (Operador, Fecha, Turno, Estructura).
  - Gestión de Operadores (Agregar nuevos operadores, Editar nombres y Desactivar sin perder trazabilidad).
  - Historial de Auditoría Inmutable (Registro de acciones y consumos).
  - Exportación de Reportes en CSV compatible con Excel.

---

## 🚀 Inicio Rápido

### Opción 1: Apertura Directa en el Navegador (Recomendada)
Haga doble clic en `start.bat` o abra directamente [index.html](file:///C:/Users/gdlgemro/OneDrive%20-%20Flex/Documents/Moonshineapp/index.html) en Microsoft Edge, Google Chrome o cualquier navegador web moderno.

### Opción 2: Servidor Web Local (PowerShell)
Ejecute el script incluido para iniciar un servidor HTTP local en el puerto 8080:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```

---

## ☁️ Conexión con Supabase (Base de Datos en la Nube)

Para que los datos de operadores, inventarios y lotes de producción se sincronicen en la nube (y no dependan únicamente del navegador local):

1. **Crea tu proyecto en Supabase:**
   - Entra a [https://supabase.com](https://supabase.com) y crea una cuenta gratuita.
   - Crea un nuevo proyecto (ej. `moonshine-db`).
2. **Crea las tablas en Supabase:**
   - En el menú lateral izquierdo ve a **SQL Editor**.
   - Haz clic en **New query**, copia y pega el contenido de [supabase_schema.sql](file:///C:/Users/gdlgemro/OneDrive%20-%20Flex/Documents/Moonshineapp/supabase_schema.sql) y pulsa **Run**.
3. **Copia tus credenciales:**
   - En Supabase ve a **Project Settings** (icono de engranaje) &rarr; **API**.
   - Copia la **Project URL** (`https://xxxxxxxx.supabase.co`).
   - Copia la **Project API key (anon / public)**.
4. **Conecta la aplicación:**
   - Abre la app, haz clic en el botón superior **☁️ Nube: Modo Local**.
   - Pega tu URL y tu clave anónima y pulsa **💾 Guardar y Conectar**.
   - ¡Listo! Los datos ahora se sincronizan en tiempo real entre todos los usuarios.

---

## 🌐 Publicación en la Nube con GitHub y GitHub Pages

Para tener la aplicación en línea con un enlace público accesible desde cualquier computadora o celular:

1. **Crea un repositorio en GitHub:**
   - Entra a [https://github.com/new](https://github.com/new).
   - Nómbralo (ejemplo: `Moonshineapp`).
   - Puedes dejarlo **Público** o **Privado**.
   - No marques inicializar con README ni `.gitignore` (ya están creados localmente).
   - Haz clic en **Create repository**.
2. **Sube tu código desde tu terminal:**
   ```powershell
   git remote add origin https://github.com/<TU_USUARIO>/Moonshineapp.git
   git branch -M main
   git push -u origin main
   ```
3. **Activa GitHub Pages:**
   - En la página de tu repositorio en GitHub, ve a **Settings** &rarr; pestaña **Pages**.
   - En **Build and deployment &rarr; Branch**, selecciona `main` y la carpeta `/ (root)`.
   - Haz clic en **Save**.
   - En 1 o 2 minutos, GitHub te entregará tu enlace web público:
     `https://<TU_USUARIO>.github.io/Moonshineapp/`

---

## 🏗️ Catálogo de 85 Estructuras Reales de Moonshine

El sistema incluye las 85 estructuras oficiales pre-cargadas con recetas temporales preliminares:

| # | Estructura | Categoría Asignada | Estado BOM Inicial |
| :-: | :--- | :--- | :--- |
| 1 | **FISH 8 CART** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 2 | **FISH CHASIS CART** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 3 | **FISHFAN CART** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 4 | **FISH TRAY CART** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 5 | **ROMA** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 6 | **LAPTOP CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 7 | **5'S CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 8 | **FISH 8 BASTIDOR RACK** | Racks y Bastidores | 🟡 BOM Temporal |
| 9 | **FEEDER BASE** | Accesorios Kaizen 5S | 🟡 BOM Temporal |
| 10 | **LEAK CART** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 11 | **CHAROLERO** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 12 | **PUFFIN-MANIFOLD CART** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 13 | **COVERYEJECTOR CART** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 14 | **FRESH MARKET** | Manejo de Materiales | 🟡 BOM Temporal |
| 15 | **MESA CUADRADA DOBLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 16 | **ASSY PCBA** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 17 | **ESTACION ROMA** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 18 | **RACK PCBA MAIN** | Racks y Bastidores | 🟡 BOM Temporal |
| 19 | **ASSY QA** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 20 | **ASSY PCBA 2** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 21 | **HV MATERIAL** | Manejo de Materiales | 🟡 BOM Temporal |
| 22 | **DEK** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 23 | **ICT TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 24 | **SQUARE TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 25 | **SMT TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 26 | **DRY BOX TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 27 | **TIE TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 28 | **BLACKBOARD** | Ayudas Visuales y 5S | 🟡 BOM Temporal |
| 29 | **BLACKBOARD BIG** | Ayudas Visuales y 5S | 🟡 BOM Temporal |
| 30 | **SUPPORT DESK** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 31 | **REPAIR** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 32 | **DEBUG** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 33 | **AOI STATION** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 34 | **DEBUG NODOS** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 35 | **CONVEYOR LEVEL 1** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 36 | **CONVEYOR LEVEL 2** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 37 | **BIN ASSY** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 38 | **DIASSY CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 39 | **DIASSY 1** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 40 | **DIASSY 2** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 41 | **DIASSY 3** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 42 | **ICT CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 43 | **FUSE ASSY** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 44 | **FAN ASSY** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 45 | **TV PILLAR** | Ayudas Visuales y 5S | 🟡 BOM Temporal |
| 46 | **REMOVE PRESSFIT** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 47 | **STENCIL CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 48 | **ASM TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 49 | **ASM DOUBLE TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 50 | **QA PRESSFIT** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 51 | **SIPLACE PRO** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 52 | **MAC LABEL** | Ayudas Visuales y 5S | 🟡 BOM Temporal |
| 53 | **TRANSFER BALLS TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 54 | **NODOS DEBUG REV A** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 55 | **TRASH CONTAINER** | Accesorios Kaizen 5S | 🟡 BOM Temporal |
| 56 | **BREAD CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 57 | **IST GOLDEN CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 58 | **STENCIL WASHER** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 59 | **MINIPOINT TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 60 | **SECURITY CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 61 | **IST TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 62 | **ZEBRA HOLDER** | Ayudas Visuales y 5S | 🟡 BOM Temporal |
| 63 | **MEETING STATION CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 64 | **DYSON BOX** | Accesorios Kaizen 5S | 🟡 BOM Temporal |
| 65 | **HEATSINK CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 66 | **CONVEYOR MONITOR** | Ayudas Visuales y 5S | 🟡 BOM Temporal |
| 67 | **TRANSFER CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 68 | **SNORKEL PENGUIN** | Celdas y Ensamble PCBA | 🟡 BOM Temporal |
| 69 | **COVER CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 70 | **HV SECURITY CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 71 | **SMKT CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 72 | **KAIKAKU CH CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 73 | **CARRIER RACK** | Racks y Bastidores | 🟡 BOM Temporal |
| 74 | **RH CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 75 | **NOISE BOX** | Accesorios Kaizen 5S | 🟡 BOM Temporal |
| 76 | **MAGAZINE CAR** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 77 | **FIXTURES RACK** | Racks y Bastidores | 🟡 BOM Temporal |
| 78 | **PROTECT SCREEN** | Ayudas Visuales y 5S | 🟡 BOM Temporal |
| 79 | **ROTAFOLIO** | Ayudas Visuales y 5S | 🟡 BOM Temporal |
| 80 | **MAIN TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 81 | **HOLDER BOX** | Accesorios Kaizen 5S | 🟡 BOM Temporal |
| 82 | **GLC RACK** | Racks y Bastidores | 🟡 BOM Temporal |
| 83 | **CHEMICAL TEST CART** | Carros de Transporte (Carts) | 🟡 BOM Temporal |
| 84 | **WASHERYDRY TABLE** | Mesas y Estaciones de Trabajo | 🟡 BOM Temporal |
| 85 | **BASTIDOR RACK** | Racks y Bastidores | 🟡 BOM Temporal |

### Receta BOM Preliminar (Placeholder)
Cada una de las 85 estructuras se ha configurado con una receta base temporal:
- **Perfil de Acero 28mm (Tubo Creform):** 4 metros
- **Lámina Metálica 1.5mm Galvanizada:** 1 lámina
- **Tornillo con Brida Hexagonal M6:** 12 tornillos
- **Pintura Industrial en Aerosol / Paint:** 1 pieza

*El administrador puede modificar o reemplazar estos materiales en cualquier momento sin requerir recetas completas para guardar cambios.*

---

## 🛠️ Herramientas Administrativas para Recetas BOM

El Administrador tiene control total sobre el catálogo:
1. **Editar Nombre y Categoría:** Modificar libremente la denominación y familia de la estructura.
2. **Crear / Modificar Recetas:** Agregar nuevos componentes, cambiar cantidades unitarias y recalcular costos en tiempo real.
3. **Vaciar / Eliminar Recetas:** Botón directo *"Vaciar Receta (BOM)"* para limpiar ingredientes sin eliminar la estructura.
4. **Control de Estatus de Receta:**
   - 🟢 **Receta Completa (Validada):** Estructuras con BOM final aprobado por ingeniería.
   - 🟡 **Receta Incompleta (BOM Temporal):** Estructuras con lista preliminar pendiente de validación física.
   - Botón de 1 solo clic en la tarjeta: `[✓ Marcar Completa]` / `[Marcar Incompleta]`.
5. **Búsqueda y Filtros Rápidos:**
   - Filtro por texto en tiempo real sobre las 85 estructuras.
   - Filtro por Familia / Categoría.
   - Filtro por Estatus de Receta (Completas, Incompletas, Vacías).

---

## 📊 Tablero Ejecutivo del Administrador & Métricas por Operador

- **Filtro Dinámico de Tablero por Operador:**
  - Selector superior para aislar las métricas de un operador individual o ver el consolidado global de la planta.
  - Al seleccionar un operador (ej. *Josue Gomez*, *Pedro Zavala*):
    - `Producción Hoy` y `Producción Este Mes` se recalculan en tiempo real para ese colaborador.
    - La gráfica de estructuras muestra exclusivamente los modelos armados por él.
    - La gráfica de operador cambia automáticamente a **Historial Mensual del Operador** (`📅 Mes YYYY-MM`) con desglose de piezas producidas por mes.
    - La gráfica de turnos muestra la distribución de turnos trabajados por dicho operador.
  - Al ver el consolidado de planta:
    - Se muestra el ranking completo de los 10 operadores con barras interactivas (haga clic en una barra para filtrar instantáneamente el tablero por ese operador).
- **Métricas KPI Destacadas:**
  - `Total Estructuras Registradas`: Conteo de modelos en catálogo (85).
  - `Sin BOM Completo`: Conteo de estructuras en estatus preliminar / incompleto.
  - `Recetas Completas`: Modelos con BOM formalmente validado.
  - `Total Materiales`, `Valor del Inventario`, `Bajo Stock Mínimo`, `Agotados`, `Producción Hoy`, `Producción del Mes`.
- **Panel de Estatus BOM:** Muestra la proporción y porcentaje de validación del catálogo y ofrece acceso directo filtrado con un clic.
- **5 Gráficas Operativas:**
  1. `Inventario por Categoría`
  2. `Materiales Más Consumidos`
  3. `Estructuras Producidas` (Consolidado o filtrado por operador)
  4. `Producción por Operador / Historial Mensual` (Ranking general o evolución mensual por operador)
  5. `Producción por Turno` (Turnos 1, 2 y 3)

---

## 📜 Libro de Producción y Filtros Avanzados

El Libro Mayor de Producción para Administradores almacena la trazabilidad completa de cada lote:
- **Campos registrados:** ID de Lote, Fecha, Turno, Nombre del Operador, Estructura Ensamblada, Cantidad Producida, Desglose de Materiales Consumidos, Costo Total y Notas/OT.
- **4 Filtros Combinables simultáneamente:**
  1. **Filtro por Operador:** Desplegable con los 10 operadores Moonshine.
  2. **Filtro por Fecha:** Selector de calendario tipo `date`.
  3. **Filtro por Turno:** Turno 1 (Matutino), Turno 2 (Vespertino), Turno 3 (Nocturno).
  4. **Filtro por Estructura:** Desplegable con las 85 estructuras del catálogo.
  5. **Buscador de Texto Libre:** Para encontrar notas, órdenes de trabajo o IDs de lote.
  6. **Botón `✕ Limpiar`:** Restablece todos los filtros de producción a sus valores por defecto con un solo clic.

---

## 👥 Administración de Operadores (Preparado para Futuras Ampliaciones)

Dentro del panel administrativo (`tab-operators`), el supervisor puede:
- **Agregar Operadores:** Añadir nuevos técnicos al equipo Moonshine con validación contra duplicados.
- **Editar Operadores:** Renombrar colaboradores manteniendo intacto el histórico en el libro mayor y la auditoría.
- **Desactivar / Activar Operadores:** Alternar el estatus de un operador entre `🟢 Activo` y `⚪ Inactivo`. Los operadores inactivos se ocultan de los menús de selección en piso pero conservan todos sus registros históricos.
- **Eliminar Operadores:** Opción protegida para remover un registro con confirmación previa.

---

## 📗 Exportación Avanzada a Excel (.xlsx)

El módulo de exportación de producción genera un libro de cálculo nativo de Microsoft Excel (`.xlsx`) compuesto por **3 hojas de cálculo independientes**, estructuradas para análisis gerencial y de ingeniería:

### 1. Hoja "Production" (Lotes de Producción)
- **Columnas:** `Record ID`, `Date`, `Shift`, `Operator`, `Structure`, `Quantity Produced`, `Lot Cost`.
- **Formato de Fechas:** `MM/DD/YYYY` (con ancho de columna amplio que previene el error `#######` en Excel).
- **Auto-Ajuste de Columnas:** Todas las columnas ajustadas al ancho del contenido con márgenes de seguridad.
- **Filtros Automáticos (AutoFilter):** Activados en todos los encabezados de columna.
- **Fila de Encabezado Congelada:** Permite desplazarse verticalmente manteniendo visible la primera fila.
- **Fila de Totales:** Resumen acumulado de piezas fabricadas y costo monetario de producción.

### 2. Hoja "Material Consumption" (Consumo de Materia Prima)
- **Columnas:** `Record ID`, `Date`, `Operator`, `Structure`, `Material`, `Quantity Consumed`, `Unit`, `Material Cost`.
- **Desglose Individual:** Cada material consumido ocupa su propia fila independiente para facilitar tablas dinámicas, filtros y análisis de costos.
- **Filtros Automáticos & Encabezado Congelado.**

### 3. Hoja "Summary" (Resumen Ejecutivo)
- **Banner de Encabezado Institucional.**
- **Tarjetas KPI:**
  - `Total Structures Produced` (Total piezas fabricadas)
  - `Total Production Cost` (Valor monetario consolidado)
  - `Total Materials Consumed` (Unidades totales de material deducidas)
  - `Total Production Batches` (Número de órdenes/lotes completados)
- **Tabla Top 10 Materiales Más Consumidos:** Rank, Nombre, Categoría, Cantidad Consumida, Unidad, Costo Total ($) y % del Costo Total.
- **Tabla de Desempeño por Operador:** Operador, Lotes Fabricados, Estructuras (piezas), Valor Generado ($), % de Participación y Última Fecha de Actividad.

---

## 📁 Estructura del Código

```
Moonshineapp/
├── index.html       # Interfaz SPA, estación de operadores, catálogo 85 estructuras y panel admin
├── css/styles.css   # Estilos Kaizen, barra de filtros, tarjetas de estructura y modales 90vh
├── js/app.js        # Catálogo maestro de 85 estructuras, motor BOM, KPIs y auditoría
├── server.ps1       # Servidor HTTP local en PowerShell
├── start.bat        # Acceso directo para Windows
└── README.md        # Manual de usuario y documentación técnica
```
