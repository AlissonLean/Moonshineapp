/**
 * Moonshine - Sistema de Gestión de Producción e Inventario Kaizen
 * Acceso por Código de Administrador (4125715), Modo Estación para Operadores y Deducción BOM
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'MOONSHINE_APP_STATE_ES_V4';
  const ADMIN_ACCESS_CODE = '4125715';
  const SESSION_AUTH_KEY = 'MOONSHINE_ADMIN_UNLOCKED';

  // Datos Iniciales Maestros
  const INITIAL_DATA = {
    // 1. Lista Maestra de Operadores Moonshine (10 Operadores Reales)
    operators: [
      { name: 'Pedro Zavala', active: true },
      { name: 'Carlos Barela', active: true },
      { name: 'Daniel Jimenez', active: true },
      { name: 'Brandon Avila', active: true },
      { name: 'Brian Ortiz', active: true },
      { name: 'Christian Garcia', active: true },
      { name: 'Omar Osorio', active: true },
      { name: 'Ivan Sanchez', active: true },
      { name: 'Josue Gomez', active: true },
      { name: 'Sergio Jimenez', active: true }
    ],

    // 2. Materias Primas
    materials: [
      {
        id: 'mat-1',
        name: 'Perfil de Acero 28mm (Tubo Creform)',
        category: 'Perfiles y Tubos',
        unit: 'metros',
        currentStock: 140,
        minimumStock: 40,
        unitCost: 8.50
      },
      {
        id: 'mat-2',
        name: 'Lámina Metálica 1.5mm Galvanizada',
        category: 'Láminas y Paneles',
        unit: 'láminas',
        currentStock: 22,
        minimumStock: 10,
        unitCost: 24.00
      },
      {
        id: 'mat-3',
        name: 'Tornillo con Brida Hexagonal M6',
        category: 'Tornillería y Fijaciones',
        unit: 'tornillos',
        currentStock: 350,
        minimumStock: 100,
        unitCost: 0.18
      },
      {
        id: 'mat-4',
        name: 'Rueda Giratoria 3" con Freno',
        category: 'Herrajes y Rodajas',
        unit: 'piezas',
        currentStock: 28,
        minimumStock: 12,
        unitCost: 7.25
      },
      {
        id: 'mat-5',
        name: 'Abrazadera Unión T (Recubrimiento Negro)',
        category: 'Conectores y Abrazaderas',
        unit: 'piezas',
        currentStock: 75,
        minimumStock: 25,
        unitCost: 2.80
      },
      {
        id: 'mat-6',
        name: 'Inserto de Espuma para Sombras 20mm',
        category: 'Ergonomía y 5S',
        unit: 'piezas',
        currentStock: 9,
        minimumStock: 10, // Stock bajo
        unitCost: 19.50
      },
      {
        id: 'mat-7',
        name: 'Cubierta Antiestática ESD 1200x600mm',
        category: 'Superficies de Trabajo',
        unit: 'piezas',
        currentStock: 0, // Agotado crítico
        minimumStock: 6,
        unitCost: 65.00
      },
      {
        id: 'mat-8',
        name: 'Nivelador M12 de Alta Carga',
        category: 'Herrajes y Rodajas',
        unit: 'piezas',
        currentStock: 32,
        minimumStock: 16,
        unitCost: 3.50
      },
      {
        id: 'mat-9',
        name: 'Tapa Terminal de Plástico 28mm',
        category: 'Accesorios',
        unit: 'piezas',
        currentStock: 130,
        minimumStock: 30,
        unitCost: 0.45
      },
      {
        id: 'mat-10',
        name: 'Pintura Industrial en Aerosol / Paint',
        category: 'Acabados y Pintura',
        unit: 'piezas',
        currentStock: 80,
        minimumStock: 20,
        unitCost: 11.50
      }
    ],

    // 3. Estructuras y Recetas (BOM) - 85 Estructuras Reales de Moonshine Kaizen
    structures: [
      { id: 'struct-1', name: 'FISH 8 CART', category: 'Carros de Transporte (Carts)', description: 'Carro tubular Moonshine Kaizen para flujo continuo de ensamble', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-2', name: 'FISH CHASIS CART', category: 'Carros de Transporte (Carts)', description: 'Carro de transporte de chasis con guías tubulares ajustables', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-3', name: 'FISHFAN CART', category: 'Carros de Transporte (Carts)', description: 'Carro móvil para ensamble y prueba de ventiladores', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-4', name: 'FISH TRAY CART', category: 'Carros de Transporte (Carts)', description: 'Carro transportador de charolas y kitting modular', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-5', name: 'ROMA', category: 'Celdas y Ensamble PCBA', description: 'Estación de proceso ROMA con fijación ergonómica', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-6', name: 'LAPTOP CAR', category: 'Carros de Transporte (Carts)', description: 'Carro rodante ergonómico para terminal de cómputo y pruebas', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-7', name: "5'S CAR", category: 'Carros de Transporte (Carts)', description: 'Carro móvil de limpieza y orden 5S para piso de producción', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-8', name: 'FISH 8 BASTIDOR RACK', category: 'Racks y Bastidores', description: 'Rack vertical para almacenamiento de bastidores Fish 8', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-9', name: 'FEEDER BASE', category: 'Accesorios Kaizen 5S', description: 'Base tubular estabilizadora para alimentadores SMT', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-10', name: 'LEAK CART', category: 'Carros de Transporte (Carts)', description: 'Carro de prueba de estanqueidad y detección de fugas', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-11', name: 'CHAROLERO', category: 'Carros de Transporte (Carts)', description: 'Carro organizador multipiso para charolas antiestáticas ESD', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-12', name: 'PUFFIN-MANIFOLD CART', category: 'Carros de Transporte (Carts)', description: 'Carro especializado de transporte para ensamble de manifolds', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-13', name: 'COVERYEJECTOR CART', category: 'Carros de Transporte (Carts)', description: 'Carro para manejo de cubiertas y expulsores mecánicos', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-14', name: 'FRESH MARKET', category: 'Manejo de Materiales', description: 'Estación de supermercado interno Kaizen para resurtido FIFO', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-15', name: 'MESA CUADRADA DOBLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa de trabajo de ensamble con doble posición operativa', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-16', name: 'ASSY PCBA', category: 'Celdas y Ensamble PCBA', description: 'Celda ergonómica para inserción y ensamble manual de PCBA', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-17', name: 'ESTACION ROMA', category: 'Celdas y Ensamble PCBA', description: 'Estación fija de banco de pruebas y ajuste ROMA', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-18', name: 'RACK PCBA MAIN', category: 'Racks y Bastidores', description: 'Rack principal con rieles conductivos ESD para tarjetas madre', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-19', name: 'ASSY QA', category: 'Celdas y Ensamble PCBA', description: 'Estación de inspección visual de calidad QA con iluminación', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-20', name: 'ASSY PCBA 2', category: 'Celdas y Ensamble PCBA', description: 'Segunda etapa de ensamble secundario y preparación de PCBA', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-21', name: 'HV MATERIAL', category: 'Manejo de Materiales', description: 'Estación de resguardo y distribución de componentes de alto valor', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-22', name: 'DEK', category: 'Celdas y Ensamble PCBA', description: 'Mesa de soporte e interfaz para impresora serigráfica DEK', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-23', name: 'ICT TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa reforzada con conexión a tierra para probador In-Circuit', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-24', name: 'SQUARE TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa tubular cuadrada estándar de 1000x1000mm', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-25', name: 'SMT TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa de soporte lateral para línea de montaje superficial SMT', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-26', name: 'DRY BOX TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa de carga pesada para gabinete de secado y deshumidificación', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-27', name: 'TIE TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa de cinchos, ruteo y amarre de arneses de cables', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-28', name: 'BLACKBOARD', category: 'Ayudas Visuales y 5S', description: 'Pizarrón blanco tubular para indicadores Kaizen de línea', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-29', name: 'BLACKBOARD BIG', category: 'Ayudas Visuales y 5S', description: 'Pizarrón de gran formato para juntas de inicio de turno', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-30', name: 'SUPPORT DESK', category: 'Mesas y Estaciones de Trabajo', description: 'Escritorio de soporte para líderes de celda y documentación', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-31', name: 'REPAIR', category: 'Celdas y Ensamble PCBA', description: 'Estación de retrabajo y soldadura manual con extractor de humo', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-32', name: 'DEBUG', category: 'Celdas y Ensamble PCBA', description: 'Estación de diagnóstico electrónico con osciloscopio y multímetros', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-33', name: 'AOI STATION', category: 'Celdas y Ensamble PCBA', description: 'Estación de revisión para máquina de inspección óptica automatizada', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-34', name: 'DEBUG NODOS', category: 'Celdas y Ensamble PCBA', description: 'Módulo de depuración y prueba nodal de circuitos integrados', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-35', name: 'CONVEYOR LEVEL 1', category: 'Celdas y Ensamble PCBA', description: 'Transportador tubular por gravedad de nivel 1 para flujo continuo', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-36', name: 'CONVEYOR LEVEL 2', category: 'Celdas y Ensamble PCBA', description: 'Transportador tubular de nivel 2 para retorno de cajas vacías', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-37', name: 'BIN ASSY', category: 'Celdas y Ensamble PCBA', description: 'Estación de preparación y montaje de contenedores de ensamble', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-38', name: 'DIASSY CAR', category: 'Carros de Transporte (Carts)', description: 'Carro móvil para transporte de ensambles Diassy', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-39', name: 'DIASSY 1', category: 'Celdas y Ensamble PCBA', description: 'Módulo de ensamble etapa 1 para producto Diassy', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-40', name: 'DIASSY 2', category: 'Celdas y Ensamble PCBA', description: 'Módulo de ensamble etapa 2 para producto Diassy', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-41', name: 'DIASSY 3', category: 'Celdas y Ensamble PCBA', description: 'Módulo de ensamble etapa 3 e integración para Diassy', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-42', name: 'ICT CAR', category: 'Carros de Transporte (Carts)', description: 'Carro móvil para transporte de fijaciones y tarjetas de prueba ICT', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-43', name: 'FUSE ASSY', category: 'Celdas y Ensamble PCBA', description: 'Estación de inserción de fusibles y pruebas de continuidad', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-44', name: 'FAN ASSY', category: 'Celdas y Ensamble PCBA', description: 'Estación de atornillado y ensamble de ventiladores axiales', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-45', name: 'TV PILLAR', category: 'Ayudas Visuales y 5S', description: 'Columna tubular para montaje de monitor LCD / TV Andon', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-46', name: 'REMOVE PRESSFIT', category: 'Celdas y Ensamble PCBA', description: 'Estación de extracción y desensamble de conectores pressfit', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-47', name: 'STENCIL CAR', category: 'Carros de Transporte (Carts)', description: 'Carro vertical para transporte seguro de esténciles SMT de acero', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-48', name: 'ASM TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa de ensamble general con superficie antiestática ESD', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-49', name: 'ASM DOUBLE TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa de ensamble doble frente a frente con repisa superior', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-50', name: 'QA PRESSFIT', category: 'Celdas y Ensamble PCBA', description: 'Estación de inspección y validación dimensional de pressfit', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-51', name: 'SIPLACE PRO', category: 'Celdas y Ensamble PCBA', description: 'Estación de preparación para alimentadores Siplace Pro', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-52', name: 'MAC LABEL', category: 'Ayudas Visuales y 5S', description: 'Puesto ergonómico para escaneo e impresión de etiquetas MAC', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-53', name: 'TRANSFER BALLS TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa con rodajas omnidireccionales de esferas para deslizamiento', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-54', name: 'NODOS DEBUG REV A', category: 'Celdas y Ensamble PCBA', description: 'Banco de pruebas de nodos versión de ingeniería Rev A', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-55', name: 'TRASH CONTAINER', category: 'Accesorios Kaizen 5S', description: 'Contenedor modular Moonshine para recolección selectiva de scrap', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-56', name: 'BREAD CAR', category: 'Carros de Transporte (Carts)', description: 'Carro tipo panadería con charolas múltiples para loteo', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-57', name: 'IST GOLDEN CAR', category: 'Carros de Transporte (Carts)', description: 'Carro resguardado para unidades maestras doradas IST', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-58', name: 'STENCIL WASHER', category: 'Celdas y Ensamble PCBA', description: 'Base estabilizadora de tina lavadora de esténciles', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-59', name: 'MINIPOINT TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa compacta auxiliar para punto de inspección rápido', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-60', name: 'SECURITY CAR', category: 'Carros de Transporte (Carts)', description: 'Carro de transporte con cerramiento de malla metálica y candado', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-61', name: 'IST TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa de pruebas funcionales IST con repisa de cableado', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-62', name: 'ZEBRA HOLDER', category: 'Ayudas Visuales y 5S', description: 'Soporte articulado ergonómico para escáner e impresora Zebra', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-63', name: 'MEETING STATION CAR', category: 'Carros de Transporte (Carts)', description: 'Estación móvil para juntas rápidas Stand-up en piso', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-64', name: 'DYSON BOX', category: 'Accesorios Kaizen 5S', description: 'Gabinete contenedor para equipo de limpieza y soplado Dyson', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-65', name: 'HEATSINK CAR', category: 'Carros de Transporte (Carts)', description: 'Carro para manejo de disipadores térmicos de aluminio', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-66', name: 'CONVEYOR MONITOR', category: 'Ayudas Visuales y 5S', description: 'Brazo tubular para monitor visual sobre transportador', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-67', name: 'TRANSFER CAR', category: 'Carros de Transporte (Carts)', description: 'Carro de transferencia interceldas con altura ajustable', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-68', name: 'SNORKEL PENGUIN', category: 'Celdas y Ensamble PCBA', description: 'Dispositivo snorkel tubular para ventilación y aspirado de humos', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-69', name: 'COVER CAR', category: 'Carros de Transporte (Carts)', description: 'Carro protegido para transporte de cubiertas plásticas y carcasas', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-70', name: 'HV SECURITY CAR', category: 'Carros de Transporte (Carts)', description: 'Carro de alta seguridad con llave para materiales de alto valor', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-71', name: 'SMKT CAR', category: 'Carros de Transporte (Carts)', description: 'Carro para surtimiento de supermercado y kitting SMKT', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-72', name: 'KAIKAKU CH CAR', category: 'Carros de Transporte (Carts)', description: 'Carro Kaikaku para cambio rápido de modelo y preparación', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-73', name: 'CARRIER RACK', category: 'Racks y Bastidores', description: 'Rack de almacenamiento para transportadores (carriers) de pallets', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-74', name: 'RH CAR', category: 'Carros de Transporte (Carts)', description: 'Carro móvil para ensambles lado derecho (RH)', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-75', name: 'NOISE BOX', category: 'Accesorios Kaizen 5S', description: 'Cabina aislante de ruido para pruebas acústicas', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-76', name: 'MAGAZINE CAR', category: 'Carros de Transporte (Carts)', description: 'Carro portacargadores (magazines) para tarjetas PCBA de SMT', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-77', name: 'FIXTURES RACK', category: 'Racks y Bastidores', description: 'Rack robusto para almacenamiento de fijaciones y nidos de prueba', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-78', name: 'PROTECT SCREEN', category: 'Ayudas Visuales y 5S', description: 'Pantalla protectora tubular transparente de acrílico ESD', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-79', name: 'ROTAFOLIO', category: 'Ayudas Visuales y 5S', description: 'Rotafolio móvil de doble cara para instrucciones de trabajo Kaizen', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-80', name: 'MAIN TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa de ensamble principal con canaletas eléctricas y neumáticas', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-81', name: 'HOLDER BOX', category: 'Accesorios Kaizen 5S', description: 'Caja soporte para herramientas y pistolas de torque', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-82', name: 'GLC RACK', category: 'Racks y Bastidores', description: 'Rack tubular para almacenamiento y flujo por gravedad GLC', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-83', name: 'CHEMICAL TEST CART', category: 'Carros de Transporte (Carts)', description: 'Carro con bandeja antiderrame para pruebas de sustancias químicas', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-84', name: 'WASHERYDRY TABLE', category: 'Mesas y Estaciones de Trabajo', description: 'Mesa con drenaje y superficie perforada para lavado y secado', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] },
      { id: 'struct-85', name: 'BASTIDOR RACK', category: 'Racks y Bastidores', description: 'Rack tubular pesado para bastidores estructurales y marcos', recipeStatus: 'incomplete', recipe: [{ materialId: 'mat-1', quantity: 4 }, { materialId: 'mat-2', quantity: 1 }, { materialId: 'mat-3', quantity: 12 }, { materialId: 'mat-10', quantity: 1 }] }
    ],

    // 4. Registros de Producción
    productionRecords: [
      {
        id: 'PR-1001',
        operatorName: 'Josue Gomez',
        date: '2026-10-26',
        shift: 'Turno 2 (Vespertino)',
        structureId: 'struct-1',
        structureName: 'Trash Bin (Bote de Basura)',
        quantityProduced: 4,
        notes: 'Ensamble de botes para línea Kaizen 2',
        createdAt: 1792944000000,
        materialsConsumed: [
          { materialId: 'mat-1', materialName: 'Perfil de Acero 28mm (Tubo Creform)', unit: 'metros', quantityPerUnit: 4, totalQuantity: 16, unitCost: 8.50, totalCost: 136.00 },
          { materialId: 'mat-2', materialName: 'Lámina Metálica 1.5mm Galvanizada', unit: 'láminas', quantityPerUnit: 1, totalQuantity: 4, unitCost: 24.00, totalCost: 96.00 },
          { materialId: 'mat-3', materialName: 'Tornillo con Brida Hexagonal M6', unit: 'tornillos', quantityPerUnit: 12, totalQuantity: 48, unitCost: 0.18, totalCost: 8.64 },
          { materialId: 'mat-9', materialName: 'Tapa Terminal de Plástico 28mm', unit: 'piezas', quantityPerUnit: 4, totalQuantity: 16, unitCost: 0.45, totalCost: 7.20 }
        ],
        totalCost: 247.84
      },
      {
        id: 'PR-1002',
        operatorName: 'Operador 2',
        date: '2026-10-27',
        shift: 'Turno 1 (Matutino)',
        structureId: 'struct-2',
        structureName: 'Cart (Carro de Transporte)',
        quantityProduced: 2,
        notes: 'Carros para resurtido SMT',
        createdAt: 1792972800000,
        materialsConsumed: [
          { materialId: 'mat-1', materialName: 'Perfil de Acero 28mm (Tubo Creform)', unit: 'metros', quantityPerUnit: 14, totalQuantity: 28, unitCost: 8.50, totalCost: 238.00 },
          { materialId: 'mat-5', materialName: 'Abrazadera Unión T (Recubrimiento Negro)', unit: 'piezas', quantityPerUnit: 8, totalQuantity: 16, unitCost: 2.80, totalCost: 44.80 },
          { materialId: 'mat-4', materialName: 'Rueda Giratoria 3" con Freno', unit: 'piezas', quantityPerUnit: 4, totalQuantity: 8, unitCost: 7.25, totalCost: 58.00 },
          { materialId: 'mat-3', materialName: 'Tornillo con Brida Hexagonal M6', unit: 'tornillos', quantityPerUnit: 24, totalQuantity: 48, unitCost: 0.18, totalCost: 8.64 },
          { materialId: 'mat-2', materialName: 'Lámina Metálica 1.5mm Galvanizada', unit: 'láminas', quantityPerUnit: 1, totalQuantity: 2, unitCost: 24.00, totalCost: 48.00 }
        ],
        totalCost: 397.44
      },
      {
        id: 'PR-1003',
        operatorName: 'Josue Gomez',
        date: '2026-10-28',
        shift: 'Turno 1 (Matutino)',
        structureId: 'struct-3',
        structureName: 'Shadow Board (Tablero de Sombras)',
        quantityProduced: 2,
        notes: 'Tableros de herramientas para celda B',
        createdAt: 1793116800000,
        materialsConsumed: [
          { materialId: 'mat-1', materialName: 'Perfil de Acero 28mm (Tubo Creform)', unit: 'metros', quantityPerUnit: 6, totalQuantity: 12, unitCost: 8.50, totalCost: 102.00 },
          { materialId: 'mat-5', materialName: 'Abrazadera Unión T (Recubrimiento Negro)', unit: 'piezas', quantityPerUnit: 4, totalQuantity: 8, unitCost: 2.80, totalCost: 22.40 },
          { materialId: 'mat-6', materialName: 'Inserto de Espuma para Sombras 20mm', unit: 'piezas', quantityPerUnit: 1, totalQuantity: 2, unitCost: 19.50, totalCost: 39.00 },
          { materialId: 'mat-2', materialName: 'Lámina Metálica 1.5mm Galvanizada', unit: 'láminas', quantityPerUnit: 1, totalQuantity: 2, unitCost: 24.00, totalCost: 48.00 },
          { materialId: 'mat-3', materialName: 'Tornillo con Brida Hexagonal M6', unit: 'tornillos', quantityPerUnit: 16, totalQuantity: 32, unitCost: 0.18, totalCost: 5.76 }
        ],
        totalCost: 217.16
      }
    ],

    // 5. Historial de Auditoría
    auditLog: [
      {
        id: 'AUD-101',
        user: 'Josue Gomez',
        date: '2026-10-26 14:35:00',
        action: 'Producción',
        details: 'Registró 4x Trash Bin (Bote de Basura) [Lote: PR-1001] - Consumió 16m Perfil, 4 Láminas, 48 Tornillos, 16 Tapas'
      },
      {
        id: 'AUD-102',
        user: 'Administrador',
        date: '2026-10-26 16:10:00',
        action: 'Inventario',
        details: 'Reabasteció stock: +50 unidades de Tornillo con Brida Hexagonal M6'
      },
      {
        id: 'AUD-103',
        user: 'Operador 2',
        date: '2026-10-27 09:20:00',
        action: 'Producción',
        details: 'Registró 2x Cart (Carro de Transporte) [Lote: PR-1002] - Consumió 28m Perfil, 16 Uniones, 8 Ruedas, 48 Tornillos, 2 Láminas'
      },
      {
        id: 'AUD-104',
        user: 'Josue Gomez',
        date: '2026-10-28 08:45:00',
        action: 'Producción',
        details: 'Registró 2x Shadow Board (Tablero de Sombras) [Lote: PR-1003] - Consumió 12m Perfil, 8 Uniones, 2 Espumas, 2 Láminas, 32 Tornillos'
      }
    ]
  };

  // Estado Activo
  let state = {
    isAdmin: false,
    operators: [],
    materials: [],
    structures: [],
    productionRecords: [],
    auditLog: []
  };

  // Helpers de Operadores
  function getOperatorName(op) {
    if (!op) return '';
    return typeof op === 'string' ? op : (op.name || '');
  }

  function isOperatorActive(op) {
    if (!op) return false;
    return typeof op === 'string' ? true : (op.active !== false);
  }

  // Persistencia de Estado
  function saveState(skipRemote = false) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error al guardar estado:', e);
    }

    // Persistencia sincronizada en la nube con Supabase
    if (!skipRemote && window.MoonshineSupabase && window.MoonshineSupabase.isConfigured()) {
      window.MoonshineSupabase.saveRemoteState(state);
    }
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        state = JSON.parse(saved);
        if (!Array.isArray(state.materials)) state.materials = INITIAL_DATA.materials;
        if (!Array.isArray(state.productionRecords)) state.productionRecords = INITIAL_DATA.productionRecords;
        if (!Array.isArray(state.auditLog)) state.auditLog = INITIAL_DATA.auditLog;

        // Migración a los 10 operadores reales de Moonshine Kaizen:
        const hasOldSampleOperators = !Array.isArray(state.operators) || 
          state.operators.length < 10 ||
          state.operators.some(op => {
            const n = getOperatorName(op);
            return n === 'Operador 2' || n === 'Operador 3' || n === 'Carlos Mendoza' || n === 'Ana Beltrán';
          });

        if (hasOldSampleOperators) {
          state.operators = JSON.parse(JSON.stringify(INITIAL_DATA.operators));
          saveState();
        } else {
          // Normalizar a formato de objetos { name, active }
          state.operators = state.operators.map(op => {
            if (typeof op === 'string') return { name: op, active: true };
            return { name: op.name, active: op.active !== false };
          });
        }

        // Migración a las 85 estructuras reales de Moonshine Kaizen:
        // Si no existen estructuras o sólo están los demo antiguos, cargamos el catálogo real
        const hasOldDemo = !Array.isArray(state.structures) || 
                           state.structures.length <= 4 || 
                           state.structures.some(s => s.name.includes('Trash Bin (Bote de Basura)') || s.name.includes('Work Table (Mesa de Trabajo)'));

        if (hasOldDemo) {
          state.structures = JSON.parse(JSON.stringify(INITIAL_DATA.structures));
          saveState();
        } else {
          // Asegurar que cada estructura tenga recipeStatus
          state.structures.forEach(s => {
            if (!s.recipeStatus) {
              s.recipeStatus = (s.recipe && s.recipe.length > 0) ? 'incomplete' : 'incomplete';
            }
          });
        }

        // Asegurar que exista material de Pintura Industrial / Paint en inventario
        if (!state.materials.some(m => m.id === 'mat-10' || m.name.toLowerCase().includes('pintura') || m.name.toLowerCase().includes('paint'))) {
          state.materials.push({
            id: 'mat-10',
            name: 'Pintura Industrial en Aerosol / Paint',
            category: 'Acabados y Pintura',
            unit: 'piezas',
            currentStock: 80,
            minimumStock: 20,
            unitCost: 11.50
          });
          saveState();
        }
      } else {
        resetToSampleData(false);
      }
    } catch (e) {
      console.error('Error al cargar estado:', e);
      resetToSampleData(false);
    }

    // Verificar si el administrador estaba desbloqueado en la sesión
    state.isAdmin = sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
  }

  function resetToSampleData(notify = true) {
    const adminStatus = state.isAdmin;
    state = JSON.parse(JSON.stringify(INITIAL_DATA));
    state.isAdmin = adminStatus;
    saveState();
    if (notify) {
      logAudit('Admin', 'Restableció todos los datos a valores de muestra originales');
      showToast('¡Datos restablecidos con éxito!', 'success', 'Muestra Restaurada');
      renderAll();
    }
  }

  function logAudit(action, details, operatorName = null) {
    const user = operatorName || (state.isAdmin ? 'Administrador' : 'Operador');
    const now = new Date();
    const dateFormatted = now.toISOString().replace('T', ' ').substring(0, 19);

    const entry = {
      id: 'AUD-' + (Date.now().toString(36).toUpperCase()),
      user: user,
      date: dateFormatted,
      action: action,
      details: details
    };

    state.auditLog.unshift(entry);
    saveState();
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  }

  function formatNumber(num) {
    return new Intl.NumberFormat('es-MX').format(num || 0);
  }

  function getMaterialById(id) {
    return state.materials.find(m => m.id === id);
  }

  function getStructureById(id) {
    return state.structures.find(s => s.id === id);
  }

  function calculateStructureUnitCost(structure) {
    if (!structure || !structure.recipe) return 0;
    return structure.recipe.reduce((sum, item) => {
      const mat = getMaterialById(item.materialId);
      if (!mat) return sum;
      return sum + (mat.unitCost * item.quantity);
    }, 0);
  }

  function calculateMaxProducible(structure) {
    if (!structure || !structure.recipe || structure.recipe.length === 0) return { maxUnits: 0, bottleneck: null };
    let minUnits = Infinity;
    let bottleneck = null;

    for (const item of structure.recipe) {
      const mat = getMaterialById(item.materialId);
      if (!mat || item.quantity <= 0) continue;
      const possible = Math.floor(mat.currentStock / item.quantity);
      if (possible < minUnits) {
        minUnits = possible;
        bottleneck = mat.name;
      }
    }

    return {
      maxUnits: minUnits === Infinity ? 0 : Math.max(0, minUnits),
      bottleneck: bottleneck
    };
  }

  function getMaterialConsumptionSummary() {
    const summary = {};
    state.productionRecords.forEach(record => {
      if (record.materialsConsumed && Array.isArray(record.materialsConsumed)) {
        record.materialsConsumed.forEach(item => {
          if (!summary[item.materialId]) {
            summary[item.materialId] = {
              materialId: item.materialId,
              name: item.materialName,
              unit: item.unit,
              totalQuantity: 0,
              totalCost: 0
            };
          }
          summary[item.materialId].totalQuantity += (item.totalQuantity || 0);
          summary[item.materialId].totalCost += (item.totalCost || 0);
        });
      }
    });
    return Object.values(summary).sort((a, b) => b.totalCost - a.totalCost);
  }

  function getStructuresProducedSummary() {
    const summary = {};
    state.structures.forEach(s => {
      summary[s.id] = {
        structureId: s.id,
        name: s.name,
        category: s.category || 'General',
        totalProduced: 0,
        batchCount: 0,
        lastProducedDate: null
      };
    });

    state.productionRecords.forEach(rec => {
      if (!summary[rec.structureId]) {
        summary[rec.structureId] = {
          structureId: rec.structureId,
          name: rec.structureName,
          category: 'Otros',
          totalProduced: 0,
          batchCount: 0,
          lastProducedDate: null
        };
      }
      summary[rec.structureId].totalProduced += (rec.quantityProduced || 0);
      summary[rec.structureId].batchCount += 1;
      if (!summary[rec.structureId].lastProducedDate || rec.date > summary[rec.structureId].lastProducedDate) {
        summary[rec.structureId].lastProducedDate = rec.date;
      }
    });

    return Object.values(summary).sort((a, b) => b.totalProduced - a.totalProduced);
  }

  // Notificaciones Toast
  function showToast(message, type = 'info', title = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let defaultTitle = 'Notificación';
    if (type === 'success') defaultTitle = 'Éxito';
    if (type === 'danger') defaultTitle = 'Error';
    if (type === 'warning') defaultTitle = 'Advertencia';
    if (type === 'info') defaultTitle = 'Información';

    toast.innerHTML = `
      <div style="font-size: 1.25rem;">
        ${type === 'success' ? '✅' : type === 'danger' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
      </div>
      <div>
        <div class="toast-title">${title || defaultTitle}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // ==========================================
  // CONTROL DE ACCESO SIMPLIFICADO (CÓDIGO 4125715)
  // ==========================================
  function openAdminAuthModal() {
    const modal = document.getElementById('modal-admin-auth');
    const input = document.getElementById('admin-code-input');
    const errorBox = document.getElementById('admin-code-error');

    if (input) input.value = '';
    if (errorBox) errorBox.style.display = 'none';

    modal.classList.add('active');
    setTimeout(() => input?.focus(), 100);
  }

  function handleAdminAuthSubmit(e) {
    e.preventDefault();
    const code = document.getElementById('admin-code-input').value.trim();
    const errorBox = document.getElementById('admin-code-error');

    if (code === ADMIN_ACCESS_CODE) {
      state.isAdmin = true;
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
      closeModal('modal-admin-auth');

      logAudit('Admin', 'Acceso de Administrador desbloqueado con código 4125715');
      showToast('Panel de administración desbloqueado con éxito.', 'success', 'Modo Administrador');

      applyAccessView();
      switchTab('dashboard');
    } else {
      errorBox.style.display = 'block';
      errorBox.innerHTML = '❌ Código incorrecto. Ingrese el código de administración autorizado (4125715).';
    }
  }

  function exitAdminMode() {
    state.isAdmin = false;
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    logAudit('Admin', 'Salió de modo administrador a Estación de Producción');
    showToast('Modo Estación de Producción activado.', 'info', 'Piso de Producción');
    applyAccessView();
    switchTab('station');
  }

  function applyAccessView() {
    const isAdmin = state.isAdmin;

    // Elementos exclusivos de administrador
    document.querySelectorAll('.admin-only-item').forEach(el => {
      el.style.display = isAdmin ? '' : 'none';
    });

    // Botones del encabezado
    const modeIndicator = document.getElementById('header-mode-indicator');
    const btnAdminAccess = document.getElementById('btn-admin-access');
    const btnAdminExit = document.getElementById('btn-admin-exit');
    const sidebarAdminLogin = document.getElementById('sidebar-admin-login-btn');

    if (isAdmin) {
      modeIndicator.className = 'mode-indicator admin-active';
      modeIndicator.innerHTML = '<span>👑 Administrador Activo</span>';
      if (btnAdminAccess) btnAdminAccess.style.display = 'none';
      if (btnAdminExit) btnAdminExit.style.display = 'inline-flex';
      if (sidebarAdminLogin) sidebarAdminLogin.style.display = 'none';
    } else {
      modeIndicator.className = 'mode-indicator operator-active';
      modeIndicator.innerHTML = '<span>👷 Estación de Producción</span>';
      if (btnAdminAccess) btnAdminAccess.style.display = 'inline-flex';
      if (btnAdminExit) btnAdminExit.style.display = 'none';
      if (sidebarAdminLogin) sidebarAdminLogin.style.display = 'block';
    }

    renderAll();
  }

  // ==========================================
  // NAVEGACIÓN
  // ==========================================
  function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-tab]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute('data-tab');

        if (!state.isAdmin && targetTab !== 'station') {
          openAdminAuthModal();
          return;
        }

        switchTab(targetTab);
      });
    });
  }

  function switchTab(tabId) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    const activeLink = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
    const activePane = document.getElementById(`tab-${tabId}`);

    if (activeLink) activeLink.classList.add('active');
    if (activePane) activePane.classList.add('active');

    const headerTitles = {
      station: { 
        title: 'Estación de Registro de Producción', 
        desc: 'Puesto de captura para operadores Moonshine (descuento automático de materiales)' 
      },
      dashboard: { 
        title: 'Tablero de Control Ejecutivo', 
        desc: 'Monitoreo en tiempo real de inventario, consumo de materiales y rendimiento' 
      },
      ledger: { 
        title: 'Libro Mayor de Registros de Producción', 
        desc: 'Historial completo de lotes ensamblados por operador y costos de materia prima' 
      },
      materials: { 
        title: 'Inventario Maestro de Materias Primas', 
        desc: 'Existencias en almacén, umbrales mínimos de seguridad y costos unitarios' 
      },
      structures: { 
        title: 'Estructuras Terminadas y Recetas (BOM)', 
        desc: 'Catálogo de modelos Kaizen y definición de listas de materiales por unidad' 
      },
      operators: { 
        title: 'Gestión de Operadores de Planta', 
        desc: 'Administre los nombres que aparecen en la lista desplegable de la estación de producción' 
      },
      audit: { 
        title: 'Historial de Auditoría y Trazabilidad', 
        desc: 'Registro cronológico inmutable de actividad de operadores y cambios administrativos' 
      }
    };

    const header = headerTitles[tabId] || headerTitles.station;
    document.getElementById('page-title').textContent = header.title;
    document.getElementById('page-desc').textContent = header.desc;

    if (tabId === 'station') {
      populateOperatorDropdowns();
      populateStationStructuresDropdown();
      renderStationRecentTable();
    }
    if (tabId === 'dashboard') renderDashboard();
    if (tabId === 'ledger') renderProductionLedgerTable();
    if (tabId === 'materials') renderMaterialsTable();
    if (tabId === 'structures') renderStructuresView();
    if (tabId === 'operators') renderOperatorsManagementTable();
    if (tabId === 'audit') renderAuditTable();
  }

  // ==========================================
  // MODO ESTACIÓN DE PRODUCCIÓN (OPERADORES)
  // ==========================================
  function populateOperatorDropdowns() {
    const opSelect = document.getElementById('op-operator-select');
    const prodAdminSelect = document.getElementById('prod-operator-select');
    const filterLedgerSelect = document.getElementById('filter-prod-operator');
    const filterDashSelect = document.getElementById('dash-filter-operator');

    const activeOps = state.operators.filter(isOperatorActive).map(getOperatorName);
    const allOps = state.operators.map(getOperatorName);

    const buildStationOptions = (curVal = '') => {
      let opts = '<option value="">-- Seleccione su Nombre (10 Operadores) --</option>';
      activeOps.forEach(op => {
        opts += `<option value="${escapeHtml(op)}"${op === curVal ? ' selected' : ''}>${escapeHtml(op)}</option>`;
      });
      return opts;
    };

    if (opSelect) {
      const cur = opSelect.value;
      opSelect.innerHTML = buildStationOptions(cur);
    }
    if (prodAdminSelect) {
      const cur = prodAdminSelect.value;
      prodAdminSelect.innerHTML = buildStationOptions(cur);
    }

    if (filterLedgerSelect) {
      const cur = filterLedgerSelect.value;
      let opts = '<option value="">Todos los Operadores</option>';
      allOps.forEach(op => {
        opts += `<option value="${escapeHtml(op)}"${op === cur ? ' selected' : ''}>${escapeHtml(op)}</option>`;
      });
      filterLedgerSelect.innerHTML = opts;
    }

    if (filterDashSelect) {
      const cur = filterDashSelect.value;
      let opts = '<option value="">-- Todos los Operadores (Consolidado Planta) --</option>';
      allOps.forEach(op => {
        opts += `<option value="${escapeHtml(op)}"${op === cur ? ' selected' : ''}>👷 ${escapeHtml(op)}</option>`;
      });
      filterDashSelect.innerHTML = opts;
    }
  }

  function populateStationStructuresDropdown() {
    const select = document.getElementById('op-prod-structure');
    if (!select) return;

    const groups = {};
    state.structures.forEach(s => {
      const cat = s.category || 'Otras Estructuras';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });

    let html = '<option value="">-- Seleccionar Estructura Moonshine (85 Modelos) --</option>';
    const sortedCats = Object.keys(groups).sort();
    sortedCats.forEach(cat => {
      html += `<optgroup label="${escapeHtml(cat)}">`;
      groups[cat].sort((a, b) => a.name.localeCompare(b.name)).forEach(s => {
        html += `<option value="${s.id}">${escapeHtml(s.name)}</option>`;
      });
      html += `</optgroup>`;
    });

    select.innerHTML = html;
  }

  function handleStationProductionSubmit(e) {
    e.preventDefault();

    const operatorName = document.getElementById('op-operator-select').value.trim();
    const date = document.getElementById('op-prod-date').value;
    const shift = document.getElementById('op-prod-shift').value;
    const structureId = document.getElementById('op-prod-structure').value;
    const qty = parseInt(document.getElementById('op-prod-quantity').value, 10);
    const notes = document.getElementById('op-prod-notes').value.trim();
    const alertBox = document.getElementById('op-shortage-alert');

    if (!operatorName) {
      showToast('Debe seleccionar su nombre de la lista de operadores antes de registrar.', 'danger', 'Operador Obligatorio');
      document.getElementById('op-operator-select').focus();
      return;
    }

    if (!date || !shift || !structureId || !qty || qty <= 0) {
      showToast('Por favor complete todos los datos obligatorios del ensamble.', 'danger');
      return;
    }

    const structure = getStructureById(structureId);
    if (!structure) {
      showToast('Estructura seleccionada no válida.', 'danger');
      return;
    }

    // 1. Verificación en segundo plano sin revelar costos ni recetas
    const consumptionPlan = [];
    let hasShortage = false;

    for (const item of structure.recipe) {
      const mat = getMaterialById(item.materialId);
      if (!mat) {
        hasShortage = true;
        break;
      }
      const needed = item.quantity * qty;
      if (mat.currentStock < needed) {
        hasShortage = true;
        break;
      }
      consumptionPlan.push({
        material: mat,
        quantityPerUnit: item.quantity,
        totalQuantity: needed,
        unitCost: mat.unitCost,
        totalCost: needed * mat.unitCost
      });
    }

    if (hasShortage) {
      alertBox.style.display = 'block';
      alertBox.innerHTML = `
        <strong>⚠️ INVENTARIO INSUFICIENTE EN ALMACÉN:</strong><br>
        No hay suficiente materia prima para completar este lote (${qty}x ${escapeHtml(structure.name)}).<br>
        Por favor contacte a su supervisor o al Administrador de Inventario para reabastecimiento.
      `;
      return;
    }

    alertBox.style.display = 'none';

    // 2. Consumo atómico de materiales en segundo plano
    const consumedRecords = [];
    let totalBatchCost = 0;

    consumptionPlan.forEach(plan => {
      plan.material.currentStock -= plan.totalQuantity;
      totalBatchCost += plan.totalCost;

      consumedRecords.push({
        materialId: plan.material.id,
        materialName: plan.material.name,
        unit: plan.material.unit,
        quantityPerUnit: plan.quantityPerUnit,
        totalQuantity: plan.totalQuantity,
        unitCost: plan.unitCost,
        totalCost: plan.totalCost
      });
    });

    const newRecordId = 'PR-' + (1000 + state.productionRecords.length + 1);
    const newRecord = {
      id: newRecordId,
      operatorName: operatorName,
      employeeName: operatorName,
      date: date,
      shift: shift,
      structureId: structure.id,
      structureName: structure.name,
      quantityProduced: qty,
      notes: notes,
      createdAt: Date.now(),
      materialsConsumed: consumedRecords,
      totalCost: totalBatchCost
    };

    state.productionRecords.unshift(newRecord);

    const consumedSummaryStr = consumedRecords.map(c => `${c.totalQuantity} ${c.unit} de ${c.materialName}`).join(', ');
    logAudit('Producción', `Registró ${qty}x ${structure.name} (Lote: ${newRecordId}) - Consumió: ${consumedSummaryStr}`, operatorName);

    saveState();

    // Resetear campos
    document.getElementById('op-prod-quantity').value = 1;
    document.getElementById('op-prod-notes').value = '';
    document.getElementById('op-prod-structure').value = '';

    showToast(`¡Lote registrado! ${qty}x ${structure.name} por ${operatorName}.`, 'success', 'Producción Confirmada');

    renderStationRecentTable();
  }

  function renderStationRecentTable() {
    const tbody = document.getElementById('station-recent-records-tbody');
    if (!tbody) return;

    const today = new Date().toISOString().split('T')[0];
    const todayRecords = state.productionRecords.filter(r => r.date === today);

    if (todayRecords.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:1.5rem; color:var(--text-muted);">
            No hay piezas registradas el día de hoy (${today}). Ingrese el primer lote arriba.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = todayRecords.map(r => `
      <tr>
        <td><strong>${escapeHtml(r.id)}</strong></td>
        <td>${escapeHtml(r.date)}</td>
        <td><span class="badge badge-shift">${escapeHtml(r.shift)}</span></td>
        <td><strong>${escapeHtml(r.operatorName || r.employeeName)}</strong></td>
        <td><strong>${escapeHtml(r.structureName)}</strong></td>
        <td><span class="badge badge-success">+${r.quantityProduced} pzas</span></td>
        <td><span class="badge badge-success">✅ Confirmado</span></td>
      </tr>
    `).join('');
  }

  // ==========================================
  // GESTIÓN DE OPERADORES (ADMIN)
  // ==========================================
  function renderOperatorsManagementTable() {
    const tbody = document.getElementById('operators-table-tbody');
    if (!tbody) return;

    if (state.operators.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-muted);">
            No hay operadores registrados. Agregue el primer operador en el formulario de arriba.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = state.operators.map(op => {
      const opName = getOperatorName(op);
      const isActive = isOperatorActive(op);
      const records = state.productionRecords.filter(r => (r.operatorName || r.employeeName) === opName);
      const totalPieces = records.reduce((sum, r) => sum + (r.quantityProduced || 0), 0);
      const sortedRecs = [...records].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      const lastRec = sortedRecs[0];
      const lastActivity = lastRec ? `${lastRec.date} (${lastRec.structureName})` : 'Sin actividad aún';

      return `
        <tr style="${!isActive ? 'opacity:0.6; background-color:#f8fafc;' : ''}">
          <td>
            <strong>${escapeHtml(opName)}</strong>
          </td>
          <td>
            ${isActive ? '<span class="badge badge-success">🟢 Activo</span>' : '<span class="badge badge-neutral">⚪ Inactivo</span>'}
          </td>
          <td>${records.length} lote(s)</td>
          <td><span class="badge badge-info">${totalPieces} pzas</span></td>
          <td style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(lastActivity)}</td>
          <td>
            <div style="display:flex; gap:0.35rem;">
              <button class="btn btn-sm btn-secondary" onclick="window.MoonshineApp.editOperator('${escapeHtml(opName)}')">
                Editar
              </button>
              <button class="btn btn-sm ${isActive ? 'btn-outline-warning' : 'btn-outline-success'}" onclick="window.MoonshineApp.toggleOperatorActive('${escapeHtml(opName)}')">
                ${isActive ? 'Desactivar' : 'Activar'}
              </button>
              <button class="btn btn-sm btn-danger" onclick="window.MoonshineApp.deleteOperator('${escapeHtml(opName)}')">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function handleAddOperatorSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('new-operator-name');
    const name = input.value.trim();

    if (!name) return;

    if (state.operators.some(o => getOperatorName(o).toLowerCase() === name.toLowerCase())) {
      showToast('Ya existe un operador con ese nombre.', 'warning');
      return;
    }

    state.operators.push({ name: name, active: true });
    logAudit('Operador', `Agregó nuevo operador: ${name}`);
    saveState();

    input.value = '';
    showToast(`Operador "${name}" agregado al equipo.`, 'success');

    populateOperatorDropdowns();
    renderOperatorsManagementTable();
  }

  function editOperator(oldName) {
    const newName = prompt(`Editar nombre del operador "${oldName}":`, oldName);
    if (!newName || !newName.trim() || newName.trim() === oldName) return;

    const trimmed = newName.trim();
    if (state.operators.some(o => getOperatorName(o).toLowerCase() === trimmed.toLowerCase() && getOperatorName(o) !== oldName)) {
      showToast('Ya existe otro operador con ese nombre.', 'warning');
      return;
    }

    const opObj = state.operators.find(o => getOperatorName(o) === oldName);
    if (opObj) {
      if (typeof opObj === 'string') {
        const idx = state.operators.indexOf(oldName);
        state.operators[idx] = { name: trimmed, active: true };
      } else {
        opObj.name = trimmed;
      }
    }

    state.productionRecords.forEach(r => {
      if ((r.operatorName || r.employeeName) === oldName) {
        r.operatorName = trimmed;
        if (r.employeeName) r.employeeName = trimmed;
      }
    });

    logAudit('Operador', `Editó nombre de operador: "${oldName}" a "${trimmed}"`);
    saveState();
    showToast(`Operador actualizado a "${trimmed}".`, 'success');

    populateOperatorDropdowns();
    renderOperatorsManagementTable();
    renderAll();
  }

  function toggleOperatorActive(name) {
    const opObj = state.operators.find(o => getOperatorName(o) === name);
    if (!opObj) return;

    if (typeof opObj === 'string') {
      const idx = state.operators.indexOf(name);
      state.operators[idx] = { name: name, active: false };
    } else {
      opObj.active = (opObj.active === false) ? true : false;
    }

    const isNowActive = isOperatorActive(opObj);
    logAudit('Operador', `${isNowActive ? 'Activó' : 'Desactivó'} al operador: ${name}`);
    saveState();
    showToast(`Operador "${name}" ${isNowActive ? 'activado' : 'desactivado'}.`, isNowActive ? 'success' : 'info');

    populateOperatorDropdowns();
    renderOperatorsManagementTable();
  }

  function deleteOperator(name) {
    if (confirm(`¿Eliminar al operador "${name}" del catálogo?`)) {
      state.operators = state.operators.filter(o => getOperatorName(o) !== name);
      logAudit('Operador', `Eliminó al operador: ${name}`);
      saveState();

      showToast(`Operador "${name}" eliminado de la lista.`, 'info');
      populateOperatorDropdowns();
      renderOperatorsManagementTable();
    }
  }

  // ==========================================
  // DASHBOARD DEL ADMINISTRADOR
  // ==========================================
  let selectedDashboardOperator = '';

  function onDashboardOperatorFilterChange() {
    selectedDashboardOperator = (document.getElementById('dash-filter-operator')?.value || '').trim();
    renderDashboard();
  }

  function clearDashboardOperatorFilter() {
    selectedDashboardOperator = '';
    const sel = document.getElementById('dash-filter-operator');
    if (sel) sel.value = '';
    renderDashboard();
  }

  function filterDashboardByOperator(opName) {
    selectedDashboardOperator = opName;
    const sel = document.getElementById('dash-filter-operator');
    if (sel) sel.value = opName;
    renderDashboard();
  }

  function renderDashboard() {
    if (!state.isAdmin) return;

    let totalInventoryValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    state.materials.forEach(mat => {
      totalInventoryValue += (mat.currentStock * mat.unitCost);
      if (mat.currentStock <= 0) {
        outOfStockCount++;
      } else if (mat.currentStock <= mat.minimumStock) {
        lowStockCount++;
      }
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const currentYearMonth = todayStr.slice(0, 7);

    let productionToday = 0;
    let productionThisMonth = 0;

    const relevantRecords = selectedDashboardOperator 
      ? state.productionRecords.filter(r => (r.operatorName || r.employeeName) === selectedDashboardOperator)
      : state.productionRecords;

    relevantRecords.forEach(pr => {
      const q = pr.quantityProduced || 0;
      if (pr.date === todayStr) {
        productionToday += q;
      }
      if (pr.date && pr.date.startsWith(currentYearMonth)) {
        productionThisMonth += q;
      }
    });

    // Actualizar indicador de filtro por operador
    const opBadge = document.getElementById('dash-operator-badge-status');
    const clearBtn = document.getElementById('btn-clear-dash-op-filter');
    if (selectedDashboardOperator) {
      if (opBadge) opBadge.innerHTML = `Mostrando métricas individuales de: <strong style="color:var(--primary); font-size:0.95rem;">${escapeHtml(selectedDashboardOperator)}</strong> (${relevantRecords.length} lotes registrados)`;
      if (clearBtn) clearBtn.style.display = 'inline-flex';
    } else {
      if (opBadge) opBadge.textContent = 'Mostrando métricas consolidadas de todo el equipo de 10 operadores';
      if (clearBtn) clearBtn.style.display = 'none';
    }

    // Conteos de Recetas BOM de Estructuras
    let completeRecipesCount = 0;
    let incompleteRecipesCount = 0;
    let emptyRecipesCount = 0;

    state.structures.forEach(s => {
      const hasRecipe = Array.isArray(s.recipe) && s.recipe.length > 0;
      if (!hasRecipe) {
        emptyRecipesCount++;
        incompleteRecipesCount++;
      } else if (s.recipeStatus === 'complete') {
        completeRecipesCount++;
      } else {
        incompleteRecipesCount++;
      }
    });

    // 1. Métricas KPI del Dashboard
    const elTotalMat = document.getElementById('kpi-total-materials');
    if (elTotalMat) elTotalMat.textContent = state.materials.length;

    const elTotalStruct = document.getElementById('kpi-total-structures');
    if (elTotalStruct) elTotalStruct.textContent = state.structures.length;

    const elIncompleteStruct = document.getElementById('kpi-structures-incomplete');
    if (elIncompleteStruct) elIncompleteStruct.textContent = incompleteRecipesCount;

    const elCompleteStruct = document.getElementById('kpi-structures-complete');
    if (elCompleteStruct) elCompleteStruct.textContent = completeRecipesCount;

    const elInvVal = document.getElementById('kpi-inventory-value');
    if (elInvVal) elInvVal.textContent = formatCurrency(totalInventoryValue);
    
    const elLowStock = document.getElementById('kpi-low-stock');
    if (elLowStock) elLowStock.textContent = lowStockCount;
    const lowStockCard = document.getElementById('kpi-low-stock-card');
    if (lowStockCard) {
      if (lowStockCount > 0) lowStockCard.classList.add('warning-card');
      else lowStockCard.classList.remove('warning-card');
    }

    const elOutStock = document.getElementById('kpi-out-stock');
    if (elOutStock) elOutStock.textContent = outOfStockCount;
    const outStockCard = document.getElementById('kpi-out-stock-card');
    if (outStockCard) {
      if (outOfStockCount > 0) outStockCard.classList.add('critical-card');
      else outStockCard.classList.remove('critical-card');
    }

    const elProdToday = document.getElementById('kpi-production-today');
    if (elProdToday) elProdToday.textContent = formatNumber(productionToday);

    const elProdMonth = document.getElementById('kpi-production-month');
    if (elProdMonth) elProdMonth.textContent = formatNumber(productionThisMonth);

    // 2. Panel Estado de Recetas BOM
    const elDashCompleteCount = document.getElementById('dash-complete-recipes-count');
    if (elDashCompleteCount) elDashCompleteCount.textContent = completeRecipesCount;

    const elDashCompletePct = document.getElementById('dash-complete-recipes-pct');
    if (elDashCompletePct) {
      const pct = state.structures.length > 0 ? Math.round((completeRecipesCount / state.structures.length) * 100) : 0;
      elDashCompletePct.textContent = `(${pct}%)`;
    }

    const elDashIncompleteCount = document.getElementById('dash-incomplete-recipes-count');
    if (elDashIncompleteCount) elDashIncompleteCount.textContent = incompleteRecipesCount;

    const elDashIncompletePct = document.getElementById('dash-incomplete-recipes-pct');
    if (elDashIncompletePct) {
      const pct = state.structures.length > 0 ? Math.round((incompleteRecipesCount / state.structures.length) * 100) : 0;
      elDashIncompletePct.textContent = `(${pct}%)`;
    }

    const badge = document.getElementById('sidebar-low-stock-badge');
    if (badge) {
      const totalAlerts = lowStockCount + outOfStockCount;
      if (totalAlerts > 0) {
        badge.textContent = totalAlerts;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }

    renderDashboardAlerts(lowStockCount, outOfStockCount);
    renderDashboardCharts();
    renderDashboardLowStockTable();
  }

  function renderDashboardAlerts(lowCount, outCount) {
    const alertStockBanner = document.getElementById('alert-stock-banner');
    const alertMissingRecipe = document.getElementById('alert-missing-recipe-banner');
    const alertNoRecipe = document.getElementById('alert-norecipe-banner');

    if (outCount > 0 || lowCount > 0) {
      alertStockBanner.style.display = 'flex';
      if (outCount > 0) {
        alertStockBanner.className = 'alert-item critical';
        document.getElementById('alert-stock-title').textContent = `🚨 ALERTA CRÍTICA: ${outCount} material(es) completamente AGOTADOS (Stock = 0)`;
        document.getElementById('alert-stock-desc').textContent = `Adicionalmente hay ${lowCount} material(es) en o bajo el stock mínimo de seguridad.`;
      } else {
        alertStockBanner.className = 'alert-item warning';
        document.getElementById('alert-stock-title').textContent = `⚠️ ADVERTENCIA: ${lowCount} material(es) en o bajo el stock mínimo de seguridad`;
        document.getElementById('alert-stock-desc').textContent = 'Se recomienda emitir órdenes de compra para evitar desabasto en ensamble.';
      }
    } else {
      alertStockBanner.style.display = 'none';
    }

    const blockedStructures = [];
    state.structures.forEach(s => {
      const missing = s.recipe.filter(r => {
        const mat = getMaterialById(r.materialId);
        return !mat || mat.currentStock <= 0;
      });
      if (missing.length > 0) {
        blockedStructures.push(s.name);
      }
    });

    if (blockedStructures.length > 0) {
      alertMissingRecipe.style.display = 'flex';
      document.getElementById('alert-missing-recipe-title').textContent = 
        `🛑 Componentes Agotados en Receta: Bloqueo en ${blockedStructures.length} modelo(s)`;
      document.getElementById('alert-missing-recipe-desc').textContent = 
        `No se pueden ensamblar: ${blockedStructures.join(', ')} porque requieren materias primas con existencia en 0.`;
    } else {
      alertMissingRecipe.style.display = 'none';
    }

    const emptyRecipeStructures = state.structures.filter(s => !s.recipe || s.recipe.length === 0);
    if (emptyRecipeStructures.length > 0) {
      alertNoRecipe.style.display = 'flex';
      document.getElementById('alert-norecipe-desc').textContent = 
        `Estructuras registradas sin receta (BOM) asignada: ${emptyRecipeStructures.map(s => s.name).join(', ')}.`;
    } else {
      alertNoRecipe.style.display = 'none';
    }
  }

  function renderDashboardCharts() {
    // 1. Inventario por Categoría
    const catData = {};
    state.materials.forEach(m => {
      const cat = m.category || 'Otros';
      if (!catData[cat]) catData[cat] = { value: 0, count: 0 };
      catData[cat].value += (m.currentStock * m.unitCost);
      catData[cat].count += 1;
    });

    const catContainer = document.getElementById('chart-inv-category');
    const maxCatVal = Math.max(...Object.values(catData).map(c => c.value), 1);
    catContainer.innerHTML = Object.entries(catData).map(([cat, d]) => {
      const pct = Math.round((d.value / maxCatVal) * 100);
      return `
        <div class="chart-bar-row">
          <div class="chart-bar-labels">
            <span class="chart-bar-name">${escapeHtml(cat)} <small style="color:var(--text-muted);">(${d.count} mat.)</small></span>
            <span class="chart-bar-val">${formatCurrency(d.value)}</span>
          </div>
          <div class="chart-meter-track">
            <div class="chart-meter-fill" style="width: ${pct}%; background-color: var(--primary);"></div>
          </div>
        </div>
      `;
    }).join('');

    // 2. Materiales Más Consumidos
    const consumptionSummary = getMaterialConsumptionSummary().slice(0, 5);
    const maxCons = consumptionSummary.length > 0 ? consumptionSummary[0].totalQuantity : 1;
    const consContainer = document.getElementById('chart-most-consumed');
    if (consumptionSummary.length === 0) {
      consContainer.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:1.5rem;">Sin registros de consumo aún.</div>';
    } else {
      consContainer.innerHTML = consumptionSummary.map(c => {
        const pct = Math.round((c.totalQuantity / maxCons) * 100);
        return `
          <div class="chart-bar-row">
            <div class="chart-bar-labels">
              <span class="chart-bar-name" title="${escapeHtml(c.name)}">${escapeHtml(c.name)}</span>
              <span class="chart-bar-val" style="color:#d97706;">${formatNumber(c.totalQuantity)} ${c.unit}</span>
            </div>
            <div class="chart-meter-track">
              <div class="chart-meter-fill" style="width: ${pct}%; background-color: #f59e0b;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 3. Producción por Estructura
    const relevantRecords = selectedDashboardOperator 
      ? state.productionRecords.filter(r => (r.operatorName || r.employeeName) === selectedDashboardOperator)
      : state.productionRecords;

    const structCountMap = {};
    relevantRecords.forEach(r => {
      const name = r.structureName || 'Estructura';
      structCountMap[name] = (structCountMap[name] || 0) + (r.quantityProduced || 0);
    });

    const activeProduced = Object.entries(structCountMap)
      .map(([name, qty]) => ({ name, totalProduced: qty }))
      .sort((a, b) => b.totalProduced - a.totalProduced)
      .slice(0, 8);

    const structContainer = document.getElementById('chart-structures-produced');

    if (activeProduced.length === 0) {
      structContainer.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding:1.5rem;">${selectedDashboardOperator ? `Sin producción registrada para ${escapeHtml(selectedDashboardOperator)} aún.` : 'Sin registros de ensamble aún.'}</div>`;
    } else {
      const maxStruct = Math.max(...activeProduced.map(s => s.totalProduced), 1);
      structContainer.innerHTML = activeProduced.map(s => {
        const pct = Math.round((s.totalProduced / maxStruct) * 100);
        return `
          <div class="chart-bar-row">
            <div class="chart-bar-labels">
              <span class="chart-bar-name" title="${escapeHtml(s.name)}">${escapeHtml(s.name)}</span>
              <span class="chart-bar-val" style="color:#059669;">${s.totalProduced} pzas</span>
            </div>
            <div class="chart-meter-track">
              <div class="chart-meter-fill" style="width: ${pct}%; background-color: #10b981;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 4. Métricas de Producción por Operador (Ranking o Historial Mensual)
    const opChartContainer = document.getElementById('chart-operator-produced');
    if (selectedDashboardOperator) {
      // Vista individual: Historial de Producción Mensual del Operador
      const monthlyData = {};
      relevantRecords.forEach(r => {
        const ym = (r.date || '').slice(0, 7) || 'Reciente';
        monthlyData[ym] = (monthlyData[ym] || 0) + (r.quantityProduced || 0);
      });

      const monthEntries = Object.entries(monthlyData).sort(([a], [b]) => b.localeCompare(a));
      if (monthEntries.length === 0) {
        opChartContainer.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding:1.5rem;">Sin producción para ${escapeHtml(selectedDashboardOperator)} aún.</div>`;
      } else {
        const maxMonth = Math.max(...monthEntries.map(([, qty]) => qty), 1);
        opChartContainer.innerHTML = `
          <div style="font-size:0.775rem; color:var(--text-muted); margin-bottom:0.6rem; font-weight:700;">
            HISTORIAL MENSUAL DE ${escapeHtml(selectedDashboardOperator.toUpperCase())}:
          </div>
        ` + monthEntries.map(([ym, qty]) => {
          const pct = Math.round((qty / maxMonth) * 100);
          return `
            <div class="chart-bar-row">
              <div class="chart-bar-labels">
                <span class="chart-bar-name">📅 Mes ${escapeHtml(ym)}</span>
                <span class="chart-bar-val" style="color:#2563eb;">${qty} pzas</span>
              </div>
              <div class="chart-meter-track">
                <div class="chart-meter-fill" style="width: ${pct}%; background-color: #3b82f6;"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    } else {
      // Vista consolidada: Ranking de todos los operadores del equipo
      const opProdData = {};
      state.productionRecords.forEach(r => {
        const name = r.operatorName || r.employeeName || 'No Especificado';
        opProdData[name] = (opProdData[name] || 0) + (r.quantityProduced || 0);
      });

      // Incluir también los operadores que tienen 0 piezas
      state.operators.forEach(op => {
        const n = getOperatorName(op);
        if (!opProdData[n]) opProdData[n] = 0;
      });

      const opEntries = Object.entries(opProdData).sort(([, a], [, b]) => b - a);
      const maxOpVal = Math.max(...opEntries.map(([, qty]) => qty), 1);
      if (opEntries.length === 0) {
        opChartContainer.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:1.5rem;">Sin producción registrada aún.</div>';
      } else {
        opChartContainer.innerHTML = opEntries.map(([name, qty]) => {
          const pct = Math.round((qty / maxOpVal) * 100);
          return `
            <div class="chart-bar-row" style="cursor:pointer;" onclick="window.MoonshineApp.filterDashboardByOperator('${escapeHtml(name)}')" title="Clic para filtrar tablero por ${escapeHtml(name)}">
              <div class="chart-bar-labels">
                <span class="chart-bar-name">👷 ${escapeHtml(name)}</span>
                <span class="chart-bar-val" style="color:#2563eb;">${qty} pzas</span>
              </div>
              <div class="chart-meter-track">
                <div class="chart-meter-fill" style="width: ${pct}%; background-color: #3b82f6;"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 5. Producción por Turno
    let t1 = 0, t2 = 0, t3 = 0;
    relevantRecords.forEach(r => {
      const shift = r.shift || '';
      const qty = r.quantityProduced || 0;
      if (shift.includes('Turno 1')) t1 += qty;
      else if (shift.includes('Turno 2')) t2 += qty;
      else if (shift.includes('Turno 3')) t3 += qty;
    });

    const totalShift = (t1 + t2 + t3) || 1;
    const p1 = Math.round((t1 / totalShift) * 100);
    const p2 = Math.round((t2 / totalShift) * 100);
    const p3 = 100 - p1 - p2;

    const shiftContainer = document.getElementById('chart-production-shift');
    shiftContainer.innerHTML = `
      <div class="shift-distribution-bar">
        <div class="shift-seg shift-seg-1" style="width: ${p1}%;" title="Turno 1: ${t1} pzas (${p1}%)">${p1 > 10 ? p1 + '%' : ''}</div>
        <div class="shift-seg shift-seg-2" style="width: ${p2}%;" title="Turno 2: ${t2} pzas (${p2}%)">${p2 > 10 ? p2 + '%' : ''}</div>
        <div class="shift-seg shift-seg-3" style="width: ${p3}%;" title="Turno 3: ${t3} pzas (${p3}%)">${p3 > 10 ? p3 + '%' : ''}</div>
      </div>
      <div class="shift-legend">
        <div class="shift-legend-item">
          <span class="shift-dot" style="background-color: #3b82f6;"></span>
          <span>Turno 1 (Matutino): <strong>${t1} pzas</strong> (${p1}%)</span>
        </div>
        <div class="shift-legend-item">
          <span class="shift-dot" style="background-color: #f59e0b;"></span>
          <span>Turno 2 (Vespertino): <strong>${t2} pzas</strong> (${p2}%)</span>
        </div>
        <div class="shift-legend-item">
          <span class="shift-dot" style="background-color: #8b5cf6;"></span>
          <span>Turno 3 (Nocturno): <strong>${t3} pzas</strong> (${p3}%)</span>
        </div>
      </div>
    `;
  }

  function renderDashboardLowStockTable() {
    const lowStockMaterials = state.materials.filter(m => m.currentStock <= m.minimumStock);
    const tbodyLow = document.getElementById('dashboard-low-stock-tbody');
    if (!tbodyLow) return;

    if (lowStockMaterials.length === 0) {
      tbodyLow.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-muted);">
            ✅ Todos los materiales están en niveles saludables por encima del stock mínimo.
          </td>
        </tr>
      `;
    } else {
      tbodyLow.innerHTML = lowStockMaterials.map(m => {
        const isOut = m.currentStock <= 0;
        const deficit = Math.max(0, m.minimumStock - m.currentStock);
        return `
          <tr>
            <td>
              <strong>${escapeHtml(m.name)}</strong>
              <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(m.category)}</div>
            </td>
            <td>
              <span class="badge ${isOut ? 'badge-danger' : 'badge-warning'}">
                ${isOut ? '🔴 AGOTADO' : '🟡 STOCK BAJO'}
              </span>
            </td>
            <td><strong>${m.currentStock}</strong> ${m.unit}</td>
            <td>${m.minimumStock} ${m.unit}</td>
            <td style="color:var(--danger); font-weight:700;">-${deficit} ${m.unit}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="window.MoonshineApp.openRestockModal('${m.id}')">
                Reabastecer
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // ==========================================
  // LIBRO DE PRODUCCIÓN (ADMINISTRADOR)
  // ==========================================
  function renderProductionLedgerTable() {
    const tbody = document.getElementById('production-records-tbody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('search-production')?.value || '').toLowerCase();
    const filterOperator = document.getElementById('filter-prod-operator')?.value || '';
    const filterDate = document.getElementById('filter-prod-date')?.value || '';
    const filterStructure = document.getElementById('filter-prod-structure')?.value || '';
    const filterShift = document.getElementById('filter-prod-shift')?.value || '';

    const structFilterSelect = document.getElementById('filter-prod-structure');
    if (structFilterSelect) {
      const curVal = structFilterSelect.value;
      if (structFilterSelect.options.length !== state.structures.length + 1) {
        structFilterSelect.innerHTML = '<option value="">Todas las Estructuras</option>';
        [...state.structures].sort((a, b) => a.name.localeCompare(b.name)).forEach(s => {
          const opt = document.createElement('option');
          opt.value = s.id;
          opt.textContent = s.name;
          structFilterSelect.appendChild(opt);
        });
        structFilterSelect.value = curVal;
      }
    }

    let records = [...state.productionRecords].sort((a, b) => b.createdAt - a.createdAt);

    if (searchTerm) {
      records = records.filter(r => 
        r.id.toLowerCase().includes(searchTerm) ||
        (r.operatorName || r.employeeName || '').toLowerCase().includes(searchTerm) ||
        r.structureName.toLowerCase().includes(searchTerm) ||
        (r.notes && r.notes.toLowerCase().includes(searchTerm))
      );
    }

    if (filterOperator) {
      records = records.filter(r => (r.operatorName || r.employeeName) === filterOperator);
    }

    if (filterDate) {
      records = records.filter(r => r.date === filterDate);
    }

    if (filterStructure) {
      records = records.filter(r => r.structureId === filterStructure);
    }

    if (filterShift) {
      records = records.filter(r => r.shift.startsWith(filterShift));
    }

    if (records.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding: 2.5rem; color:var(--text-muted);">
            No se encontraron registros de producción coincidentes.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = records.map(r => {
      const itemsConsumedStr = r.materialsConsumed.map(m => `${m.totalQuantity} ${m.unit} de ${m.materialName}`).join('<br>');
      return `
        <tr>
          <td><strong>${escapeHtml(r.id)}</strong></td>
          <td>${escapeHtml(r.date)}</td>
          <td><span class="badge badge-shift">${escapeHtml(r.shift)}</span></td>
          <td>
            <strong>${escapeHtml(r.operatorName || r.employeeName)}</strong>
          </td>
          <td>
            <strong>${escapeHtml(r.structureName)}</strong>
            <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(r.notes || '')}</div>
          </td>
          <td><span class="badge badge-success" style="font-size:0.85rem;">+${r.quantityProduced}</span></td>
          <td style="font-size:0.8rem; line-height: 1.4;">${itemsConsumedStr}</td>
          <td><strong>${formatCurrency(r.totalCost)}</strong></td>
          <td>
            <div style="display:flex; gap:0.4rem;">
              <button class="btn btn-sm btn-secondary" onclick="window.MoonshineApp.viewProductionDetails('${r.id}')" title="Ver Recibo de Consumo">
                Recibo
              </button>
              <button class="btn btn-sm btn-danger" onclick="window.MoonshineApp.confirmRevertProduction('${r.id}')" title="Anular Registro y Regresar Stock">
                Anular
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function resetProductionFilters() {
    const op = document.getElementById('filter-prod-operator');
    if (op) op.value = '';
    const dt = document.getElementById('filter-prod-date');
    if (dt) dt.value = '';
    const sh = document.getElementById('filter-prod-shift');
    if (sh) sh.value = '';
    const st = document.getElementById('filter-prod-structure');
    if (st) st.value = '';
    const srch = document.getElementById('search-production');
    if (srch) srch.value = '';
    renderProductionLedgerTable();
  }

  function openProductionModal(preselectedStructureId = null) {
    if (!state.isAdmin) {
      openAdminAuthModal();
      return;
    }

    const modal = document.getElementById('modal-production');
    const form = document.getElementById('form-production');
    form.reset();

    document.getElementById('prod-date').value = new Date().toISOString().split('T')[0];

    populateOperatorDropdowns();

    const select = document.getElementById('prod-structure');
    const groups = {};
    state.structures.forEach(s => {
      const cat = s.category || 'Otras Estructuras';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });

    let html = '<option value="">-- Seleccionar Estructura Terminada (85 Modelos) --</option>';
    const sortedCats = Object.keys(groups).sort();
    sortedCats.forEach(cat => {
      html += `<optgroup label="${escapeHtml(cat)}">`;
      groups[cat].sort((a, b) => a.name.localeCompare(b.name)).forEach(s => {
        const statusBadge = s.recipeStatus === 'complete' ? '🟢' : '🟡';
        html += `<option value="${s.id}">${statusBadge} ${escapeHtml(s.name)} (${s.recipe.length} componentes)</option>`;
      });
      html += `</optgroup>`;
    });
    select.innerHTML = html;

    if (preselectedStructureId) {
      select.value = preselectedStructureId;
    }

    document.getElementById('prod-quantity').value = 1;
    updateProductionPreview();

    modal.classList.add('active');
  }

  function updateProductionPreview() {
    const structureId = document.getElementById('prod-structure').value;
    const qty = parseInt(document.getElementById('prod-quantity').value, 10) || 0;
    const previewContainer = document.getElementById('prod-preview-container');
    const previewTable = document.getElementById('prod-preview-table-tbody');
    const warningBox = document.getElementById('prod-shortage-warning');
    const submitBtn = document.getElementById('btn-submit-production');

    if (!structureId || qty <= 0) {
      previewContainer.style.display = 'none';
      if (warningBox) warningBox.style.display = 'none';
      submitBtn.disabled = true;
      return;
    }

    const structure = getStructureById(structureId);
    if (!structure || !structure.recipe || structure.recipe.length === 0) {
      previewContainer.style.display = 'none';
      if (warningBox) {
        warningBox.style.display = 'block';
        warningBox.innerHTML = '⚠️ Esta estructura no tiene materiales en su receta BOM.';
      }
      submitBtn.disabled = true;
      return;
    }

    previewContainer.style.display = 'block';
    let hasShortage = false;
    let totalEstimatedCost = 0;
    let shortageDetails = [];

    const rowsHtml = structure.recipe.map(item => {
      const mat = getMaterialById(item.materialId);
      if (!mat) return `<tr><td colspan="5">Material desconocido</td></tr>`;

      const totalNeeded = item.quantity * qty;
      const current = mat.currentStock;
      const remaining = current - totalNeeded;
      const isShort = remaining < 0;
      const lineCost = totalNeeded * mat.unitCost;
      totalEstimatedCost += lineCost;

      if (isShort) {
        hasShortage = true;
        shortageDetails.push(`${mat.name} (Requiere ${totalNeeded} ${mat.unit}, hay ${current})`);
      }

      return `
        <tr class="${isShort ? 'shortage' : ''}">
          <td>
            <strong>${escapeHtml(mat.name)}</strong>
            <div style="font-size:0.75rem; color:var(--text-muted);">${item.quantity} ${mat.unit} por estructura</div>
          </td>
          <td><strong>${totalNeeded}</strong> ${mat.unit}</td>
          <td>${current} ${mat.unit}</td>
          <td style="font-weight: 700; color: ${isShort ? 'var(--danger)' : remaining <= mat.minimumStock ? 'var(--accent)' : 'var(--success)'}">
            ${remaining} ${mat.unit}
          </td>
          <td>
            ${isShort 
              ? `<span class="badge badge-danger">Faltan ${Math.abs(remaining)} ${mat.unit}</span>` 
              : remaining <= mat.minimumStock 
                ? `<span class="badge badge-warning">Quedará en Mínimo</span>`
                : `<span class="badge badge-success">OK</span>`
            }
          </td>
        </tr>
      `;
    }).join('');

    previewTable.innerHTML = rowsHtml;
    document.getElementById('prod-preview-total-cost').textContent = formatCurrency(totalEstimatedCost);

    if (hasShortage) {
      warningBox.style.display = 'block';
      warningBox.innerHTML = `
        <strong>⚠️ INVENTARIO INSUFICIENTE:</strong><br>
        No hay suficiente stock para producir <strong>${qty} ${escapeHtml(structure.name)}</strong>.<br>
        <ul style="margin-top:0.4rem; padding-left:1.2rem; font-size:0.85rem;">
          ${shortageDetails.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
        </ul>
      `;
      submitBtn.disabled = true;
    } else {
      warningBox.style.display = 'none';
      submitBtn.disabled = false;
    }
  }

  function handleProductionSubmit(e) {
    e.preventDefault();

    const operatorName = document.getElementById('prod-operator-select').value.trim();
    const date = document.getElementById('prod-date').value;
    const shift = document.getElementById('prod-shift').value;
    const structureId = document.getElementById('prod-structure').value;
    const quantityProduced = parseInt(document.getElementById('prod-quantity').value, 10);
    const notes = document.getElementById('prod-notes').value.trim();

    if (!operatorName) {
      showToast('Debe seleccionar un operador de la lista antes de registrar.', 'danger', 'Operador Obligatorio');
      document.getElementById('prod-operator-select').focus();
      return;
    }

    if (!date || !shift || !structureId || !quantityProduced || quantityProduced <= 0) {
      showToast('Por favor complete todos los campos obligatorios.', 'danger');
      return;
    }

    const structure = getStructureById(structureId);
    if (!structure) return;

    const consumptionPlan = [];
    for (const item of structure.recipe) {
      const mat = getMaterialById(item.materialId);
      if (!mat || mat.currentStock < (item.quantity * quantityProduced)) {
        showToast('Existencias insuficientes para completar el lote.', 'danger');
        return;
      }
      consumptionPlan.push({
        material: mat,
        quantityPerUnit: item.quantity,
        totalQuantity: item.quantity * quantityProduced,
        unitCost: mat.unitCost,
        totalCost: (item.quantity * quantityProduced) * mat.unitCost
      });
    }

    const consumedRecords = [];
    let totalBatchCost = 0;

    consumptionPlan.forEach(plan => {
      plan.material.currentStock -= plan.totalQuantity;
      totalBatchCost += plan.totalCost;

      consumedRecords.push({
        materialId: plan.material.id,
        materialName: plan.material.name,
        unit: plan.material.unit,
        quantityPerUnit: plan.quantityPerUnit,
        totalQuantity: plan.totalQuantity,
        unitCost: plan.unitCost,
        totalCost: plan.totalCost
      });
    });

    const newRecordId = 'PR-' + (1000 + state.productionRecords.length + 1);
    const newRecord = {
      id: newRecordId,
      operatorName: operatorName,
      employeeName: operatorName,
      date: date,
      shift: shift,
      structureId: structure.id,
      structureName: structure.name,
      quantityProduced: quantityProduced,
      notes: notes,
      createdAt: Date.now(),
      materialsConsumed: consumedRecords,
      totalCost: totalBatchCost
    };

    state.productionRecords.unshift(newRecord);

    const consumedSummaryStr = consumedRecords.map(c => `${c.totalQuantity} ${c.unit} de ${c.materialName}`).join(', ');
    logAudit('Producción', `Registró ${quantityProduced}x ${structure.name} (Lote: ${newRecordId}) - Consumió: ${consumedSummaryStr}`, operatorName);

    saveState();
    closeModal('modal-production');

    showToast(`Registrado ${quantityProduced}x ${structure.name}. Materiales descontados automáticamente.`, 'success');
    renderAll();
  }

  function viewProductionDetails(recordId) {
    const record = state.productionRecords.find(r => r.id === recordId);
    if (!record) return;

    document.getElementById('receipt-id').textContent = record.id;
    document.getElementById('receipt-date').textContent = record.date;
    document.getElementById('receipt-shift').textContent = record.shift;
    document.getElementById('receipt-employee').textContent = record.operatorName || record.employeeName || 'Operador';
    document.getElementById('receipt-structure').textContent = record.structureName;
    document.getElementById('receipt-quantity').textContent = `${record.quantityProduced} unidad(es)`;
    document.getElementById('receipt-notes').textContent = record.notes || 'Ninguna';
    document.getElementById('receipt-total-cost').textContent = formatCurrency(record.totalCost);

    const tbody = document.getElementById('receipt-materials-tbody');
    tbody.innerHTML = record.materialsConsumed.map(m => `
      <tr>
        <td><strong>${escapeHtml(m.materialName)}</strong></td>
        <td>${m.quantityPerUnit} ${m.unit}</td>
        <td><strong>${m.totalQuantity}</strong> ${m.unit}</td>
        <td>${formatCurrency(m.unitCost)}</td>
        <td><strong>${formatCurrency(m.totalCost)}</strong></td>
      </tr>
    `).join('');

    const modal = document.getElementById('modal-production-details');
    modal.classList.add('active');
  }

  function confirmRevertProduction(recordId) {
    if (!state.isAdmin) {
      openAdminAuthModal();
      return;
    }

    const record = state.productionRecords.find(r => r.id === recordId);
    if (!record) return;

    const confirmed = confirm(
      `¿Está seguro de ANULAR el Registro de Producción ${record.id} (${record.quantityProduced}x ${record.structureName})?\n\n` +
      `¡Esta acción devolverá todas las materias primas consumidas nuevamente al inventario!`
    );

    if (!confirmed) return;

    record.materialsConsumed.forEach(item => {
      const mat = getMaterialById(item.materialId);
      if (mat) {
        mat.currentStock += item.totalQuantity;
      }
    });

    state.productionRecords = state.productionRecords.filter(r => r.id !== recordId);
    logAudit('Producción', `Anuló lote ${record.id} (${record.quantityProduced}x ${record.structureName}) y restauró componentes al inventario`);
    saveState();

    showToast(`Registro ${record.id} anulado. Materia prima devuelta al inventario.`, 'info');
    renderAll();
  }

  // ==========================================
  // GESTIÓN DE MATERIAS PRIMAS (ADMIN)
  // ==========================================
  function renderMaterialsTable() {
    const tbody = document.getElementById('materials-table-tbody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('search-materials')?.value || '').toLowerCase();
    const filterCat = document.getElementById('filter-mat-category')?.value || '';
    const filterStatus = document.getElementById('filter-mat-status')?.value || '';

    const catSelect = document.getElementById('filter-mat-category');
    if (catSelect && catSelect.options.length <= 1) {
      const categories = [...new Set(state.materials.map(m => m.category))].filter(Boolean);
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        catSelect.appendChild(opt);
      });
    }

    let materials = [...state.materials];

    if (searchTerm) {
      materials = materials.filter(m => 
        m.name.toLowerCase().includes(searchTerm) ||
        m.category.toLowerCase().includes(searchTerm) ||
        m.unit.toLowerCase().includes(searchTerm)
      );
    }

    if (filterCat) {
      materials = materials.filter(m => m.category === filterCat);
    }

    if (filterStatus) {
      if (filterStatus === 'low') {
        materials = materials.filter(m => m.currentStock <= m.minimumStock && m.currentStock > 0);
      } else if (filterStatus === 'out') {
        materials = materials.filter(m => m.currentStock <= 0);
      } else if (filterStatus === 'ok') {
        materials = materials.filter(m => m.currentStock > m.minimumStock);
      }
    }

    if (materials.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding: 2.5rem; color:var(--text-muted);">
            No se encontraron materias primas con los filtros actuales.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = materials.map(m => {
      const isOut = m.currentStock <= 0;
      const isLow = m.currentStock <= m.minimumStock;
      const totalVal = m.currentStock * m.unitCost;

      let statusBadge = `<span class="badge badge-success">Stock Saludable</span>`;
      if (isOut) {
        statusBadge = `<span class="badge badge-danger">🔴 Agotado</span>`;
      } else if (isLow) {
        statusBadge = `<span class="badge badge-warning">🟡 Stock Bajo (${m.currentStock}/${m.minimumStock})</span>`;
      }

      return `
        <tr>
          <td>
            <strong>${escapeHtml(m.name)}</strong>
            <div style="font-size:0.75rem; color:var(--text-muted);">ID: ${m.id}</div>
          </td>
          <td><span class="badge badge-neutral">${escapeHtml(m.category)}</span></td>
          <td>${escapeHtml(m.unit)}</td>
          <td>
            <strong style="font-size:1rem; color:${isOut ? 'var(--danger)' : isLow ? 'var(--accent)' : 'var(--text-main)'}">
              ${m.currentStock}
            </strong>
          </td>
          <td>${m.minimumStock}</td>
          <td>${formatCurrency(m.unitCost)}</td>
          <td><strong>${formatCurrency(totalVal)}</strong></td>
          <td>${statusBadge}</td>
          <td>
            <div style="display:flex; gap:0.35rem;">
              <button class="btn btn-sm btn-primary" onclick="window.MoonshineApp.openRestockModal('${m.id}')" title="Reabastecer / Ajustar Stock">
                + Stock
              </button>
              <button class="btn btn-sm btn-secondary" onclick="window.MoonshineApp.openEditMaterialModal('${m.id}')" title="Editar Material">
                Editar
              </button>
              <button class="btn btn-sm btn-danger" onclick="window.MoonshineApp.deleteMaterial('${m.id}')" title="Eliminar Material">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function openMaterialModal(materialId = null) {
    if (!state.isAdmin) {
      openAdminAuthModal();
      return;
    }

    const modal = document.getElementById('modal-material');
    const form = document.getElementById('form-material');
    form.reset();

    const titleEl = document.getElementById('modal-material-title');
    document.getElementById('material-id-hidden').value = materialId || '';

    if (materialId) {
      const mat = getMaterialById(materialId);
      if (!mat) return;
      titleEl.textContent = 'Editar Materia Prima';
      document.getElementById('mat-name').value = mat.name;
      document.getElementById('mat-category').value = mat.category;
      document.getElementById('mat-unit').value = mat.unit;
      document.getElementById('mat-current-stock').value = mat.currentStock;
      document.getElementById('mat-min-stock').value = mat.minimumStock;
      document.getElementById('mat-unit-cost').value = mat.unitCost;
    } else {
      titleEl.textContent = 'Agregar Materia Prima';
      document.getElementById('mat-unit').value = 'piezas';
      document.getElementById('mat-current-stock').value = 0;
      document.getElementById('mat-min-stock').value = 10;
      document.getElementById('mat-unit-cost').value = 1.00;
    }

    modal.classList.add('active');
  }

  function handleMaterialSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('material-id-hidden').value;
    const name = document.getElementById('mat-name').value.trim();
    const category = document.getElementById('mat-category').value.trim();
    const unit = document.getElementById('mat-unit').value.trim();
    const currentStock = parseFloat(document.getElementById('mat-current-stock').value) || 0;
    const minimumStock = parseFloat(document.getElementById('mat-min-stock').value) || 0;
    const unitCost = parseFloat(document.getElementById('mat-unit-cost').value) || 0;

    if (!name || !category || !unit) {
      showToast('Por favor ingrese todos los campos del material.', 'danger');
      return;
    }

    if (id) {
      const mat = getMaterialById(id);
      if (mat) {
        mat.name = name;
        mat.category = category;
        mat.unit = unit;
        mat.currentStock = currentStock;
        mat.minimumStock = minimumStock;
        mat.unitCost = unitCost;
        logAudit('Material', `Modificó material: ${name} (Stock: ${currentStock}, Min: ${minimumStock})`);
        showToast(`Material "${name}" actualizado.`, 'success');
      }
    } else {
      const newId = 'mat-' + (Date.now().toString(36));
      state.materials.push({
        id: newId,
        name,
        category,
        unit,
        currentStock,
        minimumStock,
        unitCost
      });
      logAudit('Material', `Creó material: ${name} (${unit})`);
      showToast(`Material "${name}" agregado al inventario.`, 'success');
    }

    saveState();
    closeModal('modal-material');
    renderAll();
  }

  function deleteMaterial(id) {
    if (!state.isAdmin) {
      openAdminAuthModal();
      return;
    }

    const mat = getMaterialById(id);
    if (!mat) return;

    const usedIn = state.structures.filter(s => s.recipe.some(r => r.materialId === id));
    if (usedIn.length > 0) {
      alert(`No se puede eliminar "${mat.name}" porque se usa en la receta de: ${usedIn.map(s => s.name).join(', ')}.`);
      return;
    }

    if (confirm(`¿Está seguro de eliminar "${mat.name}" del catálogo?`)) {
      state.materials = state.materials.filter(m => m.id !== id);
      logAudit('Material', `Eliminó material: ${mat.name}`);
      saveState();
      showToast(`Material "${mat.name}" eliminado.`, 'info');
      renderAll();
    }
  }

  function openRestockModal(materialId) {
    if (!state.isAdmin) {
      openAdminAuthModal();
      return;
    }

    const mat = getMaterialById(materialId);
    if (!mat) return;

    document.getElementById('restock-material-id').value = mat.id;
    document.getElementById('restock-material-name').textContent = mat.name;
    document.getElementById('restock-current-stock').textContent = `${mat.currentStock} ${mat.unit}`;
    document.getElementById('restock-unit-label').textContent = mat.unit;
    document.getElementById('restock-qty').value = Math.max(10, mat.minimumStock * 2);
    document.getElementById('restock-notes').value = 'Recepción de Orden de Compra de Proveedor';

    const modal = document.getElementById('modal-restock');
    modal.classList.add('active');
  }

  function handleRestockSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('restock-material-id').value;
    const addQty = parseFloat(document.getElementById('restock-qty').value) || 0;
    const notes = document.getElementById('restock-notes').value.trim();

    if (addQty <= 0) {
      showToast('Ingrese una cantidad válida mayor a cero.', 'danger');
      return;
    }

    const mat = getMaterialById(id);
    if (!mat) return;

    mat.currentStock += addQty;
    logAudit('Inventario', `Reabasteció stock: +${addQty} ${mat.unit} a ${mat.name} (${notes})`);
    saveState();
    closeModal('modal-restock');

    showToast(`Sumados ${addQty} ${mat.unit} a ${mat.name}. Stock actual: ${mat.currentStock} ${mat.unit}`, 'success', 'Inventario Ajustado');
    renderAll();
  }

  // ==========================================
  // ESTRUCTURAS Y RECETAS BOM (ADMIN)
  // ==========================================
  function populateStructureCategoryFilter() {
    const catSelect = document.getElementById('filter-structures-cat');
    if (!catSelect) return;
    const currentVal = catSelect.value;

    const categories = [...new Set(state.structures.map(s => s.category || 'General'))].sort();
    let opts = '<option value="">Todas las Categorías</option>';
    categories.forEach(c => {
      opts += `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`;
    });
    catSelect.innerHTML = opts;

    if (categories.includes(currentVal)) {
      catSelect.value = currentVal;
    }
  }

  function renderStructuresView() {
    const container = document.getElementById('structures-grid-container');
    if (!container) return;

    populateStructureCategoryFilter();

    const searchInput = (document.getElementById('search-structures')?.value || '').toLowerCase().trim();
    const catFilter = document.getElementById('filter-structures-cat')?.value || '';
    const statusFilter = document.getElementById('filter-structures-status')?.value || '';

    let filtered = [...state.structures];

    if (searchInput) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchInput) ||
        (s.category && s.category.toLowerCase().includes(searchInput)) ||
        (s.description && s.description.toLowerCase().includes(searchInput))
      );
    }

    if (catFilter) {
      filtered = filtered.filter(s => s.category === catFilter);
    }

    if (statusFilter === 'complete') {
      filtered = filtered.filter(s => s.recipeStatus === 'complete' && s.recipe && s.recipe.length > 0);
    } else if (statusFilter === 'incomplete') {
      filtered = filtered.filter(s => s.recipeStatus !== 'complete' || !s.recipe || s.recipe.length === 0);
    } else if (statusFilter === 'empty') {
      filtered = filtered.filter(s => !s.recipe || s.recipe.length === 0);
    }

    const countBadge = document.getElementById('structures-count-badge');
    if (countBadge) {
      countBadge.textContent = `${filtered.length} de ${state.structures.length} Estructuras`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">No se encontraron estructuras coincidentes</div>
          <p>Pruebe con otro término de búsqueda o limpie los filtros.</p>
          <button class="btn btn-sm btn-secondary" onclick="window.MoonshineApp.resetStructureFilters()" style="margin-top:0.75rem;">
            Limpiar Filtros
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(structure => {
      const unitCost = calculateStructureUnitCost(structure);
      const producible = calculateMaxProducible(structure);
      const isComplete = structure.recipeStatus === 'complete' && structure.recipe && structure.recipe.length > 0;

      const recipeItemsHtml = (structure.recipe || []).map(item => {
        const mat = getMaterialById(item.materialId);
        const matName = mat ? mat.name : 'Material Desconocido';
        const matUnit = mat ? mat.unit : 'unidades';
        const lineCost = mat ? mat.unitCost * item.quantity : 0;
        const hasEnoughForOne = mat && mat.currentStock >= item.quantity;

        return `
          <li class="recipe-item">
            <div>
              <span style="font-weight:600; color:${hasEnoughForOne ? 'var(--text-main)' : 'var(--danger)'};">
                ${item.quantity} ${matUnit}
              </span>
              <span style="color:var(--text-muted);"> ${escapeHtml(matName)}</span>
            </div>
            <div style="font-size:0.75rem; color:var(--text-muted);">
              ${formatCurrency(lineCost)}
            </div>
          </li>
        `;
      }).join('');

      return `
        <div class="structure-card">
          <div class="structure-card-header">
            <div style="flex:1; padding-right:0.5rem;">
              <div class="structure-title">${escapeHtml(structure.name)}</div>
              <div class="structure-desc">${escapeHtml(structure.description || '')}</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.35rem;">
              <span class="badge badge-neutral">${escapeHtml(structure.category || 'Kaizen')}</span>
              ${isComplete ? 
                `<span class="badge badge-success" title="Receta validada y completa">✓ Completa</span>` : 
                `<span class="badge badge-warning" title="BOM temporal preliminar">⚠️ BOM Temporal</span>`
              }
            </div>
          </div>

          <div class="structure-card-body">
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.5rem; display:flex; justify-content:space-between;">
              <span>Receta BOM (Por Unidad)</span>
              <span>Costo</span>
            </div>
            <ul class="recipe-list">
              ${recipeItemsHtml.length > 0 ? recipeItemsHtml : '<li style="color:var(--danger); font-style:italic;">🛑 Sin receta BOM asignada.</li>'}
            </ul>

            <div style="margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Costo Unitario BOM:</div>
                <div style="font-size:1.1rem; font-weight:800; color:var(--text-main);">${formatCurrency(unitCost)}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:0.75rem; color:var(--text-muted);">Capacidad Inmediata:</div>
                <span class="badge ${producible.maxUnits > 0 ? 'badge-success' : 'badge-danger'}" style="font-size:0.85rem;">
                  ${producible.maxUnits} unidades
                </span>
                ${producible.bottleneck ? `<div style="font-size:0.7rem; color:var(--danger); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="Limitante: ${escapeHtml(producible.bottleneck)}">Limitante: ${escapeHtml(producible.bottleneck)}</div>` : ''}
              </div>
            </div>
          </div>

          <div class="structure-card-footer" style="flex-wrap:wrap; gap:0.4rem;">
            <button class="btn btn-sm btn-primary" onclick="window.MoonshineApp.openProductionModalFor('${structure.id}')">
              ⚙️ Producir
            </button>
            <div style="display:flex; gap:0.35rem; align-items:center;">
              ${isComplete ? 
                `<button class="btn btn-sm btn-outline-warning" onclick="window.MoonshineApp.toggleRecipeStatus('${structure.id}')" title="Marcar como Receta Incompleta / BOM Temporal">
                  Incompleta
                </button>` : 
                `<button class="btn btn-sm btn-outline-success" onclick="window.MoonshineApp.toggleRecipeStatus('${structure.id}')" title="Marcar como Receta Completa y Validada">
                  ✓ Completa
                </button>`
              }
              <button class="btn btn-sm btn-secondary" onclick="window.MoonshineApp.openEditStructureModal('${structure.id}')" title="Editar receta BOM y detalles">
                Editar
              </button>
              <button class="btn btn-sm btn-danger" onclick="window.MoonshineApp.deleteStructure('${structure.id}')" title="Eliminar estructura">
                ✕
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function filterStructures() {
    renderStructuresView();
  }

  function resetStructureFilters() {
    const sInput = document.getElementById('search-structures');
    if (sInput) sInput.value = '';
    const catSelect = document.getElementById('filter-structures-cat');
    if (catSelect) catSelect.value = '';
    const statusSelect = document.getElementById('filter-structures-status');
    if (statusSelect) statusSelect.value = '';
    renderStructuresView();
  }

  function goToStructuresTabWithFilter(status) {
    switchTab('structures');
    const filterEl = document.getElementById('filter-structures-status');
    if (filterEl) filterEl.value = status;
    const searchEl = document.getElementById('search-structures');
    if (searchEl) searchEl.value = '';
    renderStructuresView();
  }

  function toggleRecipeStatus(id) {
    if (!state.isAdmin) {
      openAdminAuthModal();
      return;
    }
    const s = getStructureById(id);
    if (!s) return;

    s.recipeStatus = s.recipeStatus === 'complete' ? 'incomplete' : 'complete';
    const statusLabel = s.recipeStatus === 'complete' ? 'COMPLETA (Validada)' : 'INCOMPLETA (BOM Temporal)';
    logAudit('Receta', `Cambió estado de receta para ${s.name}: ${statusLabel}`);
    saveState();
    showToast(`Estructura "${s.name}" marcada como ${statusLabel}.`, s.recipeStatus === 'complete' ? 'success' : 'warning');
    renderAll();
  }

  let currentRecipeItems = [];

  function openStructureModal(structureId = null) {
    if (!state.isAdmin) {
      openAdminAuthModal();
      return;
    }

    const modal = document.getElementById('modal-structure');
    const form = document.getElementById('form-structure');
    form.reset();

    const titleEl = document.getElementById('modal-structure-title');
    document.getElementById('structure-id-hidden').value = structureId || '';

    const statusSelect = document.getElementById('struct-recipe-status');

    if (structureId) {
      const s = getStructureById(structureId);
      if (!s) return;
      titleEl.textContent = 'Editar Estructura y Receta BOM';
      document.getElementById('struct-name').value = s.name;
      document.getElementById('struct-category').value = s.category || '';
      document.getElementById('struct-description').value = s.description || '';
      if (statusSelect) statusSelect.value = s.recipeStatus || 'incomplete';
      currentRecipeItems = JSON.parse(JSON.stringify(s.recipe || []));
    } else {
      titleEl.textContent = 'Nueva Estructura y Receta BOM';
      document.getElementById('struct-category').value = 'Kaizen Moonshine';
      if (statusSelect) statusSelect.value = 'incomplete';
      currentRecipeItems = [];
    }

    renderRecipeBuilderTable();
    modal.classList.add('active');
  }

  function clearCurrentModalRecipe() {
    if (confirm('¿Vaciar la lista de materiales (BOM) de esta estructura? Se removerán los componentes asignados.')) {
      currentRecipeItems = [];
      const statusSelect = document.getElementById('struct-recipe-status');
      if (statusSelect) statusSelect.value = 'incomplete';
      renderRecipeBuilderTable();
      showToast('Receta BOM vaciada.', 'info');
    }
  }

  function renderRecipeBuilderTable() {
    const tbody = document.getElementById('recipe-builder-tbody');
    if (!tbody) return;

    if (currentRecipeItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:1.5rem; color:var(--text-muted);">
            No hay materias primas agregadas a esta receta. Seleccione materiales abajo.
          </td>
        </tr>
      `;
      document.getElementById('builder-total-unit-cost').textContent = formatCurrency(0);
      return;
    }

    let totalCost = 0;
    tbody.innerHTML = currentRecipeItems.map((item, index) => {
      const mat = getMaterialById(item.materialId);
      const name = mat ? mat.name : 'Desconocido';
      const unit = mat ? mat.unit : '';
      const unitCost = mat ? mat.unitCost : 0;
      const lineCost = item.quantity * unitCost;
      totalCost += lineCost;

      return `
        <tr>
          <td><strong>${escapeHtml(name)}</strong></td>
          <td style="width: 130px;">
            <input type="number" step="any" min="0.1" class="form-control" style="padding:0.3rem 0.5rem;" 
              value="${item.quantity}" onchange="window.MoonshineApp.updateRecipeItemQty(${index}, this.value)">
          </td>
          <td>${escapeHtml(unit)}</td>
          <td>${formatCurrency(lineCost)}</td>
          <td>
            <button type="button" class="btn btn-sm btn-danger" onclick="window.MoonshineApp.removeRecipeItem(${index})">
              ✕
            </button>
          </td>
        </tr>
      `;
    }).join('');

    document.getElementById('builder-total-unit-cost').textContent = formatCurrency(totalCost);
  }

  function addRecipeIngredient() {
    const matSelect = document.getElementById('builder-material-select');
    const qtyInput = document.getElementById('builder-material-qty');

    const materialId = matSelect.value;
    const qty = parseFloat(qtyInput.value) || 0;

    if (!materialId) {
      showToast('Seleccione una materia prima.', 'warning');
      return;
    }
    if (qty <= 0) {
      showToast('La cantidad debe ser mayor a cero.', 'warning');
      return;
    }

    const existingIndex = currentRecipeItems.findIndex(r => r.materialId === materialId);
    if (existingIndex >= 0) {
      currentRecipeItems[existingIndex].quantity += qty;
    } else {
      currentRecipeItems.push({
        materialId: materialId,
        quantity: qty
      });
    }

    qtyInput.value = 1;
    renderRecipeBuilderTable();
  }

  function removeRecipeItem(index) {
    currentRecipeItems.splice(index, 1);
    renderRecipeBuilderTable();
  }

  function updateRecipeItemQty(index, newQty) {
    const val = parseFloat(newQty);
    if (val > 0) {
      currentRecipeItems[index].quantity = val;
      renderRecipeBuilderTable();
    }
  }

  function handleStructureSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('structure-id-hidden').value;
    const name = document.getElementById('struct-name').value.trim();
    const category = document.getElementById('struct-category').value.trim();
    const description = document.getElementById('struct-description').value.trim();
    const statusSelect = document.getElementById('struct-recipe-status');
    const recipeStatus = statusSelect ? statusSelect.value : (currentRecipeItems.length > 0 ? 'complete' : 'incomplete');

    if (!name) {
      showToast('El nombre de la estructura es obligatorio.', 'danger');
      return;
    }

    if (id) {
      const s = getStructureById(id);
      if (s) {
        s.name = name;
        s.category = category;
        s.description = description;
        s.recipeStatus = recipeStatus;
        s.recipe = JSON.parse(JSON.stringify(currentRecipeItems));
        logAudit('Receta', `Modificó receta/estructura: ${name} (Estado: ${recipeStatus}, ${currentRecipeItems.length} materiales)`);
        showToast(`Estructura "${name}" actualizada.`, 'success');
      }
    } else {
      const newId = 'struct-' + (Date.now().toString(36));
      state.structures.push({
        id: newId,
        name,
        category,
        description,
        recipeStatus,
        recipe: JSON.parse(JSON.stringify(currentRecipeItems))
      });
      logAudit('Receta', `Creó estructura: ${name} con ${currentRecipeItems.length} materiales en receta`);
      showToast(`Estructura "${name}" guardada.`, 'success');
    }

    saveState();
    closeModal('modal-structure');
    renderAll();
  }

  function deleteStructure(id) {
    if (!state.isAdmin) {
      openAdminAuthModal();
      return;
    }

    const s = getStructureById(id);
    if (!s) return;

    if (confirm(`¿Eliminar estructura "${s.name}"? Los registros de producción históricos se conservarán.`)) {
      state.structures = state.structures.filter(item => item.id !== id);
      logAudit('Receta', `Eliminó estructura: ${s.name}`);
      saveState();
      showToast(`Estructura "${s.name}" eliminada.`, 'info');
      renderAll();
    }
  }

  function refreshMaterialSelectDropdowns() {
    const select = document.getElementById('builder-material-select');
    if (!select) return;
    select.innerHTML = '<option value="">-- Seleccionar Materia Prima --</option>';
    state.materials.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.name} (${m.unit}) - Existencia: ${m.currentStock}`;
      select.appendChild(opt);
    });
  }

  // ==========================================
  // HISTORIAL DE AUDITORÍA (ADMIN)
  // ==========================================
  function renderAuditTable() {
    const tbody = document.getElementById('audit-table-tbody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('search-audit')?.value || '').toLowerCase();
    const filterAction = document.getElementById('filter-audit-action')?.value || '';

    let logs = [...state.auditLog];

    if (searchTerm) {
      logs = logs.filter(l => 
        l.user.toLowerCase().includes(searchTerm) ||
        l.action.toLowerCase().includes(searchTerm) ||
        l.details.toLowerCase().includes(searchTerm)
      );
    }

    if (filterAction) {
      logs = logs.filter(l => l.action.includes(filterAction));
    }

    if (logs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted);">
            No se encontraron eventos en el historial de auditoría.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = logs.map(l => {
      let badgeCls = 'badge-neutral';
      if (l.action === 'Producción') badgeCls = 'badge-success';
      else if (l.action === 'Inventario') badgeCls = 'badge-warning';
      else if (l.action === 'Operador') badgeCls = 'badge-info';
      else if (l.action === 'Material' || l.action === 'Receta') badgeCls = 'badge-shift';

      return `
        <tr>
          <td style="white-space:nowrap; font-size:0.8rem; color:var(--text-muted);">${escapeHtml(l.date)}</td>
          <td><strong>${escapeHtml(l.user)}</strong></td>
          <td><span class="badge ${badgeCls}">${escapeHtml(l.action)}</span></td>
          <td style="font-size:0.85rem;">${escapeHtml(l.details)}</td>
        </tr>
      `;
    }).join('');
  }

  function exportAuditCSV() {
    if (state.auditLog.length === 0) {
      showToast('No hay registros de auditoría para exportar.', 'warning');
      return;
    }

    const headers = ['ID Auditoría', 'Fecha y Hora', 'Operador / Usuario', 'Acción', 'Detalles y Materiales Consumidos'];
    const rows = state.auditLog.map(l => [
      `"${l.id}"`,
      `"${l.date}"`,
      `"${l.user.replace(/"/g, '""')}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    downloadCSV(headers, rows, `auditoria_moonshine_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Historial de auditoría exportado a CSV.', 'success');
  }

  // ==========================================
  // EXPORTACIÓN & DESCARGA
  // ==========================================
  function downloadCSV(headers, rows, filename) {
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function exportDataJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `moonshine_respaldo_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Respaldo JSON descargado con éxito.', 'success');
  }

  // ==========================================
  // EXPORTACIÓN PROFESIONAL A EXCEL (.XLSX)
  // Generador OpenXML puro en JavaScript con 3 hojas,
  // congelamiento de paneles, autofiltros y formateo sin dependencias
  // ==========================================
  function createZipArchive(entries) {
    const crcTable = new Uint32Array(256);
    const poly = 0xEDB88320 >>> 0;
    for (let i = 0; i < 256; i++) {
      let c = i >>> 0;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (poly ^ (c >>> 1)) : (c >>> 1);
      }
      crcTable[i] = c >>> 0;
    }

    function crc32(buf) {
      let crc = 0xFFFFFFFF >>> 0;
      for (let i = 0; i < buf.length; i++) {
        crc = (crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)) >>> 0;
      }
      return (crc ^ 0xFFFFFFFF) >>> 0;
    }

    const utf8 = new TextEncoder();
    const processed = entries.map(e => {
      const nameBytes = utf8.encode(e.path);
      const dataBytes = typeof e.data === 'string' ? utf8.encode(e.data) : e.data;
      const crc = crc32(dataBytes);
      return {
        path: e.path,
        nameBytes,
        dataBytes,
        crc,
        size: dataBytes.length
      };
    });

    let totalLocal = 0;
    let totalCD = 0;
    for (const e of processed) {
      totalLocal += 30 + e.nameBytes.length + e.size;
      totalCD += 46 + e.nameBytes.length;
    }
    const totalSize = totalLocal + totalCD + 22;

    const buf = new ArrayBuffer(totalSize);
    const view = new DataView(buf);
    const u8 = new Uint8Array(buf);

    let offset = 0;
    for (const e of processed) {
      e.offset = offset;
      view.setUint32(offset, 0x04034B50, true);
      view.setUint16(offset + 4, 20, true);
      view.setUint16(offset + 6, 0x0800, true); // UTF-8
      view.setUint16(offset + 8, 0, true);      // Store
      view.setUint16(offset + 10, 0x7000, true);
      view.setUint16(offset + 12, 0x5D00, true);
      view.setUint32(offset + 14, e.crc, true);
      view.setUint32(offset + 18, e.size, true);
      view.setUint32(offset + 22, e.size, true);
      view.setUint16(offset + 26, e.nameBytes.length, true);
      view.setUint16(offset + 28, 0, true);

      u8.set(e.nameBytes, offset + 30);
      u8.set(e.dataBytes, offset + 30 + e.nameBytes.length);
      offset += 30 + e.nameBytes.length + e.size;
    }

    const cdStart = offset;
    for (const e of processed) {
      view.setUint32(offset, 0x02014B50, true);
      view.setUint16(offset + 4, 20, true);
      view.setUint16(offset + 6, 20, true);
      view.setUint16(offset + 8, 0x0800, true);
      view.setUint16(offset + 10, 0, true);
      view.setUint16(offset + 12, 0x7000, true);
      view.setUint16(offset + 14, 0x5D00, true);
      view.setUint32(offset + 16, e.crc, true);
      view.setUint32(offset + 20, e.size, true);
      view.setUint32(offset + 24, e.size, true);
      view.setUint16(offset + 28, e.nameBytes.length, true);
      view.setUint16(offset + 30, 0, true);
      view.setUint16(offset + 32, 0, true);
      view.setUint16(offset + 34, 0, true);
      view.setUint16(offset + 36, 0, true);
      view.setUint32(offset + 38, 0, true);
      view.setUint32(offset + 42, e.offset, true);

      u8.set(e.nameBytes, offset + 46);
      offset += 46 + e.nameBytes.length;
    }

    const cdSize = offset - cdStart;
    view.setUint32(offset, 0x06054B50, true);
    view.setUint16(offset + 4, 0, true);
    view.setUint16(offset + 6, 0, true);
    view.setUint16(offset + 8, processed.length, true);
    view.setUint16(offset + 10, processed.length, true);
    view.setUint32(offset + 12, cdSize, true);
    view.setUint32(offset + 16, cdStart, true);
    view.setUint16(offset + 20, 0, true);

    return u8;
  }

  function escapeXmlForExcel(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function formatExcelDateMMDDYYYY(dStr) {
    if (!dStr) return '';
    const clean = String(dStr).trim().split('T')[0];
    const parts = clean.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      const [yyyy, mm, dd] = parts;
      return `${mm.padStart(2, '0')}/${dd.padStart(2, '0')}/${yyyy}`;
    }
    const dt = new Date(dStr);
    if (!isNaN(dt.getTime())) {
      const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(dt.getUTCDate()).padStart(2, '0');
      const yyyy = dt.getUTCFullYear();
      return `${mm}/${dd}/${yyyy}`;
    }
    return String(dStr);
  }

  function getExcelColLetter(colIdx) {
    let letter = '';
    let temp = colIdx;
    while (temp > 0) {
      const mod = (temp - 1) % 26;
      letter = String.fromCharCode(65 + mod) + letter;
      temp = Math.floor((temp - mod) / 26);
    }
    return letter;
  }

  function downloadXlsxFile(zipBytes, filename) {
    const blob = new Blob([zipBytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1200);
  }

  function buildProductionXlsxWorkbook(productionRecords, materialsList) {
    const records = productionRecords || [];
    const materials = materialsList || [];

    // ==========================================
    // 1. PRODUCTION SHEET
    // ==========================================
    const prodHeaders = ['Record ID', 'Date', 'Shift', 'Operator', 'Structure', 'Quantity Produced', 'Lot Cost'];
    const prodColWidths = [18, 16, 22, 22, 28, 20, 18];

    let prodRowsXml = '';
    prodRowsXml += `<row r="1" ht="28" customHeight="1">` +
      prodHeaders.map((h, i) => `<c r="${getExcelColLetter(i + 1)}1" t="inlineStr" s="1"><is><t>${escapeXmlForExcel(h)}</t></is></c>`).join('') +
      `</row>`;

    let totalProdQty = 0;
    let totalProdCost = 0;

    records.forEach((r, idx) => {
      const rowNum = idx + 2;
      const zebra = (idx % 2 === 1);
      const sText = zebra ? 7 : 2;
      const sCenter = zebra ? 8 : 3;
      const sDate = zebra ? 9 : 4;
      const sInt = zebra ? 10 : 5;
      const sCurr = zebra ? 11 : 6;

      const dateStr = formatExcelDateMMDDYYYY(r.date);
      const qty = Number(r.quantityProduced) || 0;
      const cost = Number(r.totalCost) || 0;
      totalProdQty += qty;
      totalProdCost += cost;

      prodColWidths[0] = Math.max(prodColWidths[0], (r.id || '').length + 4);
      prodColWidths[1] = Math.max(prodColWidths[1], dateStr.length + 5);
      prodColWidths[2] = Math.max(prodColWidths[2], (r.shift || '').length + 4);
      const opName = r.operatorName || r.employeeName || '';
      prodColWidths[3] = Math.max(prodColWidths[3], opName.length + 4);
      prodColWidths[4] = Math.max(prodColWidths[4], (r.structureName || '').length + 4);

      prodRowsXml += `<row r="${rowNum}" ht="20" customHeight="1">` +
        `<c r="A${rowNum}" t="inlineStr" s="${sCenter}"><is><t>${escapeXmlForExcel(r.id)}</t></is></c>` +
        `<c r="B${rowNum}" t="inlineStr" s="${sDate}"><is><t>${escapeXmlForExcel(dateStr)}</t></is></c>` +
        `<c r="C${rowNum}" t="inlineStr" s="${sText}"><is><t>${escapeXmlForExcel(r.shift)}</t></is></c>` +
        `<c r="D${rowNum}" t="inlineStr" s="${sText}"><is><t>${escapeXmlForExcel(opName)}</t></is></c>` +
        `<c r="E${rowNum}" t="inlineStr" s="${sText}"><is><t>${escapeXmlForExcel(r.structureName)}</t></is></c>` +
        `<c r="F${rowNum}" s="${sInt}"><v>${qty}</v></c>` +
        `<c r="G${rowNum}" s="${sCurr}"><v>${cost.toFixed(2)}</v></c>` +
        `</row>`;
    });

    const prodTotalRowNum = records.length + 2;
    if (records.length > 0) {
      prodRowsXml += `<row r="${prodTotalRowNum}" ht="24" customHeight="1">` +
        `<c r="A${prodTotalRowNum}" t="inlineStr" s="12"><is><t>TOTAL</t></is></c>` +
        `<c r="B${prodTotalRowNum}" s="12"/>` +
        `<c r="C${prodTotalRowNum}" s="12"/>` +
        `<c r="D${prodTotalRowNum}" s="12"/>` +
        `<c r="E${prodTotalRowNum}" t="inlineStr" s="12"><is><t>Totales Acumulados</t></is></c>` +
        `<c r="F${prodTotalRowNum}" s="13"><v>${totalProdQty}</v></c>` +
        `<c r="G${prodTotalRowNum}" s="14"><v>${totalProdCost.toFixed(2)}</v></c>` +
        `</row>`;
    }

    const prodColsXml = `<cols>` +
      prodColWidths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${Math.min(w, 45)}" customWidth="1"/>`).join('') +
      `</cols>`;

    const prodFilterRef = records.length > 0 ? `A1:G${records.length + 1}` : 'A1:G1';

    const sheet1Xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews>
    <sheetView tabSelected="1" workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  ${prodColsXml}
  <sheetData>
    ${prodRowsXml}
  </sheetData>
  <autoFilter ref="${prodFilterRef}"/>
</worksheet>`;

    // ==========================================
    // 2. MATERIAL CONSUMPTION SHEET
    // ==========================================
    const matHeaders = ['Record ID', 'Date', 'Operator', 'Structure', 'Material', 'Quantity Consumed', 'Unit', 'Material Cost'];
    const matColWidths = [18, 16, 22, 28, 32, 20, 16, 18];

    let matRowsXml = '';
    matRowsXml += `<row r="1" ht="28" customHeight="1">` +
      matHeaders.map((h, i) => `<c r="${getExcelColLetter(i + 1)}1" t="inlineStr" s="1"><is><t>${escapeXmlForExcel(h)}</t></is></c>`).join('') +
      `</row>`;

    let totalMatConsumedQty = 0;
    let totalMatConsumedCost = 0;
    let matRowCounter = 1;

    records.forEach(r => {
      const dateStr = formatExcelDateMMDDYYYY(r.date);
      const opName = r.operatorName || r.employeeName || '';
      const items = (r.materialsConsumed && r.materialsConsumed.length > 0) ? r.materialsConsumed : [];

      items.forEach(m => {
        matRowCounter++;
        const zebra = (matRowCounter % 2 === 1);
        const sText = zebra ? 7 : 2;
        const sCenter = zebra ? 8 : 3;
        const sDate = zebra ? 9 : 4;
        const sInt = zebra ? 10 : 5;
        const sCurr = zebra ? 11 : 6;

        const consumedQty = Number(m.totalQuantity) || 0;
        const consumedCost = (m.totalCost != null) ? Number(m.totalCost) : (consumedQty * (Number(m.unitCost) || 0));

        totalMatConsumedQty += consumedQty;
        totalMatConsumedCost += consumedCost;

        matColWidths[0] = Math.max(matColWidths[0], (r.id || '').length + 4);
        matColWidths[1] = Math.max(matColWidths[1], dateStr.length + 5);
        matColWidths[2] = Math.max(matColWidths[2], opName.length + 4);
        matColWidths[3] = Math.max(matColWidths[3], (r.structureName || '').length + 4);
        matColWidths[4] = Math.max(matColWidths[4], (m.materialName || '').length + 4);
        matColWidths[6] = Math.max(matColWidths[6], (m.unit || '').length + 4);

        matRowsXml += `<row r="${matRowCounter}" ht="20" customHeight="1">` +
          `<c r="A${matRowCounter}" t="inlineStr" s="${sCenter}"><is><t>${escapeXmlForExcel(r.id)}</t></is></c>` +
          `<c r="B${matRowCounter}" t="inlineStr" s="${sDate}"><is><t>${escapeXmlForExcel(dateStr)}</t></is></c>` +
          `<c r="C${matRowCounter}" t="inlineStr" s="${sText}"><is><t>${escapeXmlForExcel(opName)}</t></is></c>` +
          `<c r="D${matRowCounter}" t="inlineStr" s="${sText}"><is><t>${escapeXmlForExcel(r.structureName)}</t></is></c>` +
          `<c r="E${matRowCounter}" t="inlineStr" s="${sText}"><is><t>${escapeXmlForExcel(m.materialName)}</t></is></c>` +
          `<c r="F${matRowCounter}" s="${sInt}"><v>${consumedQty}</v></c>` +
          `<c r="G${matRowCounter}" t="inlineStr" s="${sCenter}"><is><t>${escapeXmlForExcel(m.unit)}</t></is></c>` +
          `<c r="H${matRowCounter}" s="${sCurr}"><v>${consumedCost.toFixed(2)}</v></c>` +
          `</row>`;
      });
    });

    if (matRowCounter > 1) {
      const matTotalRowNum = matRowCounter + 1;
      matRowsXml += `<row r="${matTotalRowNum}" ht="24" customHeight="1">` +
        `<c r="A${matTotalRowNum}" t="inlineStr" s="12"><is><t>TOTAL</t></is></c>` +
        `<c r="B${matTotalRowNum}" s="12"/>` +
        `<c r="C${matTotalRowNum}" s="12"/>` +
        `<c r="D${matTotalRowNum}" s="12"/>` +
        `<c r="E${matTotalRowNum}" t="inlineStr" s="12"><is><t>Consumo Total</t></is></c>` +
        `<c r="F${matTotalRowNum}" s="13"><v>${totalMatConsumedQty}</v></c>` +
        `<c r="G${matTotalRowNum}" s="12"/>` +
        `<c r="H${matTotalRowNum}" s="14"><v>${totalMatConsumedCost.toFixed(2)}</v></c>` +
        `</row>`;
    }

    const matColsXml = `<cols>` +
      matColWidths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${Math.min(w, 50)}" customWidth="1"/>`).join('') +
      `</cols>`;

    const matFilterRef = matRowCounter > 1 ? `A1:H${matRowCounter}` : 'A1:H1';

    const sheet2Xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  ${matColsXml}
  <sheetData>
    ${matRowsXml}
  </sheetData>
  <autoFilter ref="${matFilterRef}"/>
</worksheet>`;

    // ==========================================
    // 3. SUMMARY SHEET
    // ==========================================
    const matAgg = {};
    records.forEach(r => {
      (r.materialsConsumed || []).forEach(m => {
        const id = m.materialId || m.materialName;
        if (!matAgg[id]) {
          const found = materials.find(x => x.id === m.materialId || x.name === m.materialName);
          matAgg[id] = {
            id,
            name: m.materialName,
            category: found ? found.category : 'General',
            unit: m.unit,
            totalQty: 0,
            totalCost: 0
          };
        }
        const q = Number(m.totalQuantity) || 0;
        const c = (m.totalCost != null) ? Number(m.totalCost) : (q * (Number(m.unitCost) || 0));
        matAgg[id].totalQty += q;
        matAgg[id].totalCost += c;
      });
    });

    const topMaterials = Object.values(matAgg)
      .sort((a, b) => b.totalCost - a.totalCost || b.totalQty - a.totalQty)
      .slice(0, 10);

    const opAgg = {};
    records.forEach(r => {
      const name = r.operatorName || r.employeeName || 'No Especificado';
      if (!opAgg[name]) {
        opAgg[name] = {
          name,
          batches: 0,
          pieces: 0,
          totalCost: 0,
          lastDate: ''
        };
      }
      opAgg[name].batches += 1;
      opAgg[name].pieces += (Number(r.quantityProduced) || 0);
      opAgg[name].totalCost += (Number(r.totalCost) || 0);
      if (!opAgg[name].lastDate || r.date > opAgg[name].lastDate) {
        opAgg[name].lastDate = r.date;
      }
    });

    const operatorSummary = Object.values(opAgg).sort((a, b) => b.pieces - a.pieces);

    const sumColWidths = [32, 24, 24, 24, 20, 20, 20];
    let sumRowsXml = '';

    // Title Banner
    sumRowsXml += `<row r="1" ht="30" customHeight="1">` +
      `<c r="A1" t="inlineStr" s="15"><is><t>MOONSHINE KAIZEN - RESUMEN EJECUTIVO DE PRODUCCIÓN E INVENTARIO</t></is></c>` +
      `<c r="B1" s="15"/><c r="C1" s="15"/><c r="D1" s="15"/><c r="E1" s="15"/><c r="F1" s="15"/><c r="G1" s="15"/>` +
      `</row>`;
    sumRowsXml += `<row r="2" ht="20" customHeight="1">` +
      `<c r="A2" t="inlineStr" s="16"><is><t>Generado el ${formatExcelDateMMDDYYYY(new Date().toISOString())} | Control de Operaciones Taller Moonshine</t></is></c>` +
      `<c r="B2" s="16"/><c r="C2" s="16"/><c r="D2" s="16"/><c r="E2" s="16"/><c r="F2" s="16"/><c r="G2" s="16"/>` +
      `</row>`;
    sumRowsXml += `<row r="3" ht="12"><c r="A3"/></row>`;

    // KPI Cards Header
    sumRowsXml += `<row r="4" ht="22" customHeight="1">` +
      `<c r="A4" t="inlineStr" s="18"><is><t>TOTAL ESTRUCTURAS FABRICADAS</t></is></c>` +
      `<c r="B4" t="inlineStr" s="18"><is><t>COSTO TOTAL PRODUCCIÓN</t></is></c>` +
      `<c r="C4" t="inlineStr" s="18"><is><t>TOTAL MATERIALES CONSUMIDOS</t></is></c>` +
      `<c r="D4" t="inlineStr" s="18"><is><t>ÓRDENES / LOTES REGISTRADOS</t></is></c>` +
      `</row>`;

    // KPI Cards Value
    sumRowsXml += `<row r="5" ht="32" customHeight="1">` +
      `<c r="A5" s="19"><v>${totalProdQty}</v></c>` +
      `<c r="B5" s="20"><v>${totalProdCost.toFixed(2)}</v></c>` +
      `<c r="C5" s="19"><v>${totalMatConsumedQty}</v></c>` +
      `<c r="D5" s="19"><v>${records.length}</v></c>` +
      `</row>`;

    sumRowsXml += `<row r="6" ht="14"><c r="A6"/></row>`;

    // SECTION 1: TOP 10 MATERIALES MÁS CONSUMIDOS
    sumRowsXml += `<row r="7" ht="24" customHeight="1">` +
      `<c r="A7" t="inlineStr" s="17"><is><t>🏆 TOP 10 MATERIALES MÁS CONSUMIDOS (MAYOR IMPACTO EN COSTO Y VOLUMEN)</t></is></c>` +
      `<c r="B7" s="17"/><c r="C7" s="17"/><c r="D7" s="17"/><c r="E7" s="17"/><c r="F7" s="17"/><c r="G7" s="17"/>` +
      `</row>`;

    const topMatHeaders = ['Rank', 'Material', 'Categoría', 'Cantidad Consumida', 'Unidad', 'Costo Total ($)', '% del Costo'];
    sumRowsXml += `<row r="8" ht="24" customHeight="1">` +
      topMatHeaders.map((h, i) => `<c r="${getExcelColLetter(i + 1)}8" t="inlineStr" s="1"><is><t>${escapeXmlForExcel(h)}</t></is></c>`).join('') +
      `</row>`;

    let curRow = 8;
    topMaterials.forEach((m, idx) => {
      curRow++;
      const zebra = (idx % 2 === 1);
      const sText = zebra ? 7 : 2;
      const sCenter = zebra ? 8 : 3;
      const sInt = zebra ? 10 : 5;
      const sCurr = zebra ? 11 : 6;
      const sPct = zebra ? 22 : 21;
      const pct = totalMatConsumedCost > 0 ? (m.totalCost / totalMatConsumedCost) : 0;

      sumColWidths[1] = Math.max(sumColWidths[1], m.name.length + 4);
      sumColWidths[2] = Math.max(sumColWidths[2], m.category.length + 4);

      sumRowsXml += `<row r="${curRow}" ht="20" customHeight="1">` +
        `<c r="A${curRow}" t="inlineStr" s="${sCenter}"><is><t>#${idx + 1}</t></is></c>` +
        `<c r="B${curRow}" t="inlineStr" s="${sText}"><is><t>${escapeXmlForExcel(m.name)}</t></is></c>` +
        `<c r="C${curRow}" t="inlineStr" s="${sCenter}"><is><t>${escapeXmlForExcel(m.category)}</t></is></c>` +
        `<c r="D${curRow}" s="${sInt}"><v>${m.totalQty}</v></c>` +
        `<c r="E${curRow}" t="inlineStr" s="${sCenter}"><is><t>${escapeXmlForExcel(m.unit)}</t></is></c>` +
        `<c r="F${curRow}" s="${sCurr}"><v>${m.totalCost.toFixed(2)}</v></c>` +
        `<c r="G${curRow}" s="${sPct}"><v>${pct.toFixed(4)}</v></c>` +
        `</row>`;
    });

    curRow++;
    sumRowsXml += `<row r="${curRow}" ht="14"><c r="A${curRow}"/></row>`;

    // SECTION 2: PRODUCCIÓN POR OPERADOR
    const opSecHeaderRow = curRow + 1;
    curRow = opSecHeaderRow;
    sumRowsXml += `<row r="${curRow}" ht="24" customHeight="1">` +
      `<c r="A${curRow}" t="inlineStr" s="17"><is><t>👷 DESEMPEÑO Y PRODUCCIÓN POR OPERADOR</t></is></c>` +
      `<c r="B${curRow}" s="17"/><c r="C${curRow}" s="17"/><c r="D${curRow}" s="17"/><c r="E${curRow}" s="17"/><c r="F${curRow}" s="17"/>` +
      `</row>`;

    curRow++;
    const opHeaders = ['Operador', 'Lotes Fabricados', 'Estructuras (pzas)', 'Valor Generado ($)', '% Producción', 'Última Actividad'];
    sumRowsXml += `<row r="${curRow}" ht="24" customHeight="1">` +
      opHeaders.map((h, i) => `<c r="${getExcelColLetter(i + 1)}${curRow}" t="inlineStr" s="1"><is><t>${escapeXmlForExcel(h)}</t></is></c>`).join('') +
      `</row>`;

    operatorSummary.forEach((o, idx) => {
      curRow++;
      const zebra = (idx % 2 === 1);
      const sText = zebra ? 7 : 2;
      const sCenter = zebra ? 8 : 3;
      const sInt = zebra ? 10 : 5;
      const sCurr = zebra ? 11 : 6;
      const sPct = zebra ? 22 : 21;
      const pct = totalProdQty > 0 ? (o.pieces / totalProdQty) : 0;
      const lastDateStr = formatExcelDateMMDDYYYY(o.lastDate);

      sumColWidths[0] = Math.max(sumColWidths[0], o.name.length + 4);

      sumRowsXml += `<row r="${curRow}" ht="20" customHeight="1">` +
        `<c r="A${curRow}" t="inlineStr" s="${sText}"><is><t>${escapeXmlForExcel(o.name)}</t></is></c>` +
        `<c r="B${curRow}" s="${sInt}"><v>${o.batches}</v></c>` +
        `<c r="C${curRow}" s="${sInt}"><v>${o.pieces}</v></c>` +
        `<c r="D${curRow}" s="${sCurr}"><v>${o.totalCost.toFixed(2)}</v></c>` +
        `<c r="E${curRow}" s="${sPct}"><v>${pct.toFixed(4)}</v></c>` +
        `<c r="F${curRow}" t="inlineStr" s="${sCenter}"><is><t>${escapeXmlForExcel(lastDateStr)}</t></is></c>` +
        `</row>`;
    });

    curRow++;
    sumRowsXml += `<row r="${curRow}" ht="24" customHeight="1">` +
      `<c r="A${curRow}" t="inlineStr" s="12"><is><t>TOTAL EQUIPO</t></is></c>` +
      `<c r="B${curRow}" s="13"><v>${records.length}</v></c>` +
      `<c r="C${curRow}" s="13"><v>${totalProdQty}</v></c>` +
      `<c r="D${curRow}" s="14"><v>${totalProdCost.toFixed(2)}</v></c>` +
      `<c r="E${curRow}" s="21"><v>1.0000</v></c>` +
      `<c r="F${curRow}" s="12"/>` +
      `</row>`;

    const sumColsXml = `<cols>` +
      sumColWidths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${Math.min(w, 45)}" customWidth="1"/>`).join('') +
      `</cols>`;

    const sheet3Xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  ${sumColsXml}
  <sheetData>
    ${sumRowsXml}
  </sheetData>
  <mergeCells count="4">
    <mergeCell ref="A1:G1"/>
    <mergeCell ref="A2:G2"/>
    <mergeCell ref="A7:G7"/>
    <mergeCell ref="A${opSecHeaderRow}:F${opSecHeaderRow}"/>
  </mergeCells>
</worksheet>`;

    // ==========================================
    // WORKBOOK XML & PACKAGE METADATA
    // ==========================================
    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

    const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

    const wbRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

    const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Production" sheetId="1" r:id="rId1"/>
    <sheet name="Material Consumption" sheetId="2" r:id="rId2"/>
    <sheet name="Summary" sheetId="3" r:id="rId3"/>
  </sheets>
</workbook>`;

    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="4">
    <numFmt numFmtId="164" formatCode="mm/dd/yyyy"/>
    <numFmt numFmtId="165" formatCode="&quot;$&quot;#,##0.00"/>
    <numFmt numFmtId="166" formatCode="#,##0"/>
    <numFmt numFmtId="167" formatCode="0.0%"/>
  </numFmts>
  <fonts count="9">
    <font><sz val="10"/><color rgb="FF0F172A"/><name val="Segoe UI"/></font>
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Segoe UI"/></font>
    <font><b/><sz val="11"/><color rgb="FF1E3A8A"/><name val="Segoe UI"/></font>
    <font><b/><sz val="14"/><color rgb="FFFFFFFF"/><name val="Segoe UI"/></font>
    <font><i/><sz val="9"/><color rgb="FF94A3B8"/><name val="Segoe UI"/></font>
    <font><b/><sz val="16"/><color rgb="FF0F172A"/><name val="Segoe UI"/></font>
    <font><b/><sz val="9"/><color rgb="FF475569"/><name val="Segoe UI"/></font>
    <font><b/><sz val="11"/><color rgb="FF1E293B"/><name val="Segoe UI"/></font>
    <font><b/><sz val="10"/><color rgb="FF0F172A"/><name val="Segoe UI"/></font>
  </fonts>
  <fills count="8">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1E3A8A"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF1F5F9"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0F172A"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE2E8F0"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFECFDF5"/></patternFill></fill>
  </fills>
  <borders count="4">
    <border><left/><right/><top/><bottom/></border>
    <border>
      <left style="thin"><color rgb="FFCBD5E1"/></left>
      <right style="thin"><color rgb="FFCBD5E1"/></right>
      <top style="thin"><color rgb="FFCBD5E1"/></top>
      <bottom style="thin"><color rgb="FFCBD5E1"/></bottom>
    </border>
    <border>
      <left style="thin"><color rgb="FFCBD5E1"/></left>
      <right style="thin"><color rgb="FFCBD5E1"/></right>
      <top style="thin"><color rgb="FFCBD5E1"/></top>
      <bottom style="double"><color rgb="FF0F172A"/></bottom>
    </border>
    <border>
      <left/><right/><top/><bottom style="medium"><color rgb="FF1E3A8A"/></bottom>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="24">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="164" fontId="0" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="166" fontId="0" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="165" fontId="0" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="0" fontId="8" fillId="0" borderId="2" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="166" fontId="8" fillId="7" borderId="2" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="165" fontId="8" fillId="7" borderId="2" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="5" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="4" fillId="5" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="7" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
    <xf numFmtId="0" fontId="6" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="166" fontId="5" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="165" fontId="5" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="167" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="167" fontId="0" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
  </cellXfs>
</styleSheet>`;

    const entries = [
      { path: '[Content_Types].xml', data: contentTypesXml },
      { path: '_rels/.rels', data: rootRelsXml },
      { path: 'xl/_rels/workbook.xml.rels', data: wbRelsXml },
      { path: 'xl/workbook.xml', data: workbookXml },
      { path: 'xl/styles.xml', data: stylesXml },
      { path: 'xl/worksheets/sheet1.xml', data: sheet1Xml },
      { path: 'xl/worksheets/sheet2.xml', data: sheet2Xml },
      { path: 'xl/worksheets/sheet3.xml', data: sheet3Xml }
    ];

    return createZipArchive(entries);
  }

  function exportProductionExcel() {
    if (state.productionRecords.length === 0) {
      showToast('No hay registros de producción para exportar.', 'warning');
      return;
    }

    try {
      const zipBytes = buildProductionXlsxWorkbook(state.productionRecords, state.materials);
      const todayFormatted = formatExcelDateMMDDYYYY(new Date().toISOString()).replace(/\//g, '-');
      const filename = `Moonshine_Produccion_${todayFormatted}.xlsx`;
      downloadXlsxFile(zipBytes, filename);
      logAudit('Exportación', `Descargó Libro Excel XLSX con 3 hojas (${state.productionRecords.length} registros)`);
      showToast('Libro Excel (.xlsx) descargado con éxito: 3 Hojas profesionales con filtros y métricas.', 'success');
    } catch (err) {
      console.error('Error al generar libro Excel:', err);
      showToast('Ocurrió un error al generar el archivo Excel.', 'danger');
    }
  }

  function exportProductionCSV() {
    if (state.productionRecords.length === 0) {
      showToast('No hay registros de producción para exportar.', 'warning');
      return;
    }

    const headers = ['Record ID', 'Date', 'Shift', 'Operator', 'Structure', 'Quantity Produced', 'Lot Cost ($)', 'Materiales Consumidos'];
    const rows = state.productionRecords.map(r => [
      `"${r.id}"`,
      `"${formatExcelDateMMDDYYYY(r.date)}"`,
      `"${r.shift}"`,
      `"${(r.operatorName || r.employeeName || '').replace(/"/g, '""')}"`,
      `"${r.structureName.replace(/"/g, '""')}"`,
      r.quantityProduced,
      r.totalCost.toFixed(2),
      `"${(r.materialsConsumed || []).map(m => `${m.totalQuantity} ${m.unit} de ${m.materialName}`).join('; ')}"`
    ]);

    const todayFormatted = formatExcelDateMMDDYYYY(new Date().toISOString()).replace(/\//g, '-');
    downloadCSV(headers, rows, `produccion_moonshine_${todayFormatted}.csv`);
    showToast('Registros de producción exportados a CSV.', 'success');
  }

  function exportMaterialsCSV() {
    const headers = ['ID Material', 'Nombre del Material', 'Categoría', 'Unidad', 'Stock Actual', 'Stock Mínimo', 'Costo Unitario ($)', 'Valor Total ($)', 'Estado'];
    const rows = state.materials.map(m => {
      const isOut = m.currentStock <= 0;
      const isLow = m.currentStock <= m.minimumStock;
      const status = isOut ? 'AGOTADO' : isLow ? 'STOCK BAJO' : 'SALUDABLE';
      return [
        `"${m.id}"`,
        `"${m.name.replace(/"/g, '""')}"`,
        `"${m.category.replace(/"/g, '""')}"`,
        `"${m.unit}"`,
        m.currentStock,
        m.minimumStock,
        m.unitCost.toFixed(2),
        (m.currentStock * m.unitCost).toFixed(2),
        status
      ];
    });

    downloadCSV(headers, rows, `inventario_materiales_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Catálogo de materiales exportado a CSV.', 'success');
  }

  function importDataJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.materials && imported.structures && imported.productionRecords) {
          state = imported;
          saveState();
          showToast('Base de datos importada con éxito.', 'success');
          renderAll();
        } else {
          showToast('Formato JSON incompatible.', 'danger');
        }
      } catch (err) {
        showToast('Error al procesar el archivo JSON.', 'danger');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Renderizado Completo
  function renderAll() {
    populateOperatorDropdowns();
    populateStationStructuresDropdown();
    renderStationRecentTable();

    if (state.isAdmin) {
      renderDashboard();
      renderProductionLedgerTable();
      renderMaterialsTable();
      renderStructuresView();
      renderOperatorsManagementTable();
      renderAuditTable();
      refreshMaterialSelectDropdowns();
    }
  }

  // Configuración de Escuchadores de Eventos
  function initEvents() {
    // Autenticación de Administrador (Modal)
    document.getElementById('form-admin-auth')?.addEventListener('submit', handleAdminAuthSubmit);

    // Formulario de Producción de Estación (Operador)
    document.getElementById('form-station-production')?.addEventListener('submit', handleStationProductionSubmit);

    // Formulario de Producción de Administrador
    document.getElementById('form-production')?.addEventListener('submit', handleProductionSubmit);

    // Agregar nuevo operador
    document.getElementById('form-add-operator')?.addEventListener('submit', handleAddOperatorSubmit);

    // Formularios maestros
    document.getElementById('form-material')?.addEventListener('submit', handleMaterialSubmit);
    document.getElementById('form-restock')?.addEventListener('submit', handleRestockSubmit);
    document.getElementById('form-structure')?.addEventListener('submit', handleStructureSubmit);

    // Previews dinámicos admin
    const structSelect = document.getElementById('prod-structure');
    const qtyInput = document.getElementById('prod-quantity');
    if (structSelect) structSelect.addEventListener('change', updateProductionPreview);
    if (qtyInput) qtyInput.addEventListener('input', updateProductionPreview);

    // Búsquedas y filtros
    document.getElementById('search-materials')?.addEventListener('input', renderMaterialsTable);
    document.getElementById('filter-mat-category')?.addEventListener('change', renderMaterialsTable);
    document.getElementById('filter-mat-status')?.addEventListener('change', renderMaterialsTable);

    document.getElementById('search-production')?.addEventListener('input', renderProductionLedgerTable);
    document.getElementById('filter-prod-operator')?.addEventListener('change', renderProductionLedgerTable);
    document.getElementById('filter-prod-date')?.addEventListener('change', renderProductionLedgerTable);
    document.getElementById('filter-prod-structure')?.addEventListener('change', renderProductionLedgerTable);
    document.getElementById('filter-prod-shift')?.addEventListener('change', renderProductionLedgerTable);

    document.getElementById('dash-filter-operator')?.addEventListener('change', onDashboardOperatorFilterChange);

    document.getElementById('search-audit')?.addEventListener('input', renderAuditTable);
    document.getElementById('filter-audit-action')?.addEventListener('change', renderAuditTable);

    initNavigation();

    // Cerrar modales
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        closeModal(modalId);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    const fileInput = document.getElementById('import-file-input');
    if (fileInput) fileInput.addEventListener('change', importDataJSON);

    // Eventos de Integración con Supabase
    const formSupabase = document.getElementById('form-supabase-config');
    if (formSupabase) {
      formSupabase.addEventListener('submit', handleSupabaseSaveSubmit);
    }

    const btnTestSupabase = document.getElementById('btn-supabase-test');
    if (btnTestSupabase) {
      btnTestSupabase.addEventListener('click', handleSupabaseTestClick);
    }

    const btnUploadSupabase = document.getElementById('btn-supabase-upload-now');
    if (btnUploadSupabase) {
      btnUploadSupabase.addEventListener('click', handleSupabaseUploadClick);
    }

    const btnDownloadSupabase = document.getElementById('btn-supabase-download-now');
    if (btnDownloadSupabase) {
      btnDownloadSupabase.addEventListener('click', handleSupabaseDownloadClick);
    }

    const btnDisconnectSupabase = document.getElementById('btn-supabase-disconnect');
    if (btnDisconnectSupabase) {
      btnDisconnectSupabase.addEventListener('click', handleSupabaseDisconnectClick);
    }
  }

  // Sincronización Remota con Supabase
  function applyRemoteState(remoteData, notify = false) {
    if (!remoteData || typeof remoteData !== 'object') return;

    const currentAdminStatus = state.isAdmin;

    // Actualizar colecciones preservando referencias y estructuras
    if (Array.isArray(remoteData.operators)) state.operators = remoteData.operators;
    if (Array.isArray(remoteData.materials)) state.materials = remoteData.materials;
    if (Array.isArray(remoteData.structures)) state.structures = remoteData.structures;
    if (Array.isArray(remoteData.productionRecords)) state.productionRecords = remoteData.productionRecords;
    if (Array.isArray(remoteData.auditLog)) state.auditLog = remoteData.auditLog;

    state.isAdmin = currentAdminStatus;

    // Guardar copia local sin volver a disparar guardado en nube
    saveState(true);
    renderAll();

    if (notify) {
      showToast('Los datos se sincronizaron con los cambios más recientes de la nube.', 'info', 'Sincronización Supabase');
    }
  }

  async function initSupabaseSync() {
    if (!window.MoonshineSupabase) return;

    if (!window.MoonshineSupabase.isConfigured()) {
      window.MoonshineSupabase.updateBadge('Modo Local', 'badge-warning', 'Operando sin sincronización remota');
      return;
    }

    // Inicializar cliente
    window.MoonshineSupabase.initClient();

    // 1. Descargar estado de la nube
    try {
      const remote = await window.MoonshineSupabase.fetchRemoteState();
      if (remote) {
        applyRemoteState(remote, false);
      } else {
        // Primera vez con tabla vacía: subir el estado local inicial a Supabase
        await window.MoonshineSupabase.saveRemoteState(state, true);
      }

      // 2. Suscribirse a cambios en tiempo real
      window.MoonshineSupabase.subscribeRealtime((newRemoteData) => {
        applyRemoteState(newRemoteData, true);
      });
    } catch (err) {
      console.warn('Error durante la sincronización inicial con Supabase:', err);
    }
  }

  function openSupabaseModal() {
    const modal = document.getElementById('modal-supabase-config');
    if (!modal) return;

    const feedback = document.getElementById('supabase-test-feedback');
    if (feedback) feedback.style.display = 'none';

    const cfg = window.MoonshineSupabase ? window.MoonshineSupabase.getConfig() : { url: '', anonKey: '' };
    const urlInput = document.getElementById('supabase-url');
    const keyInput = document.getElementById('supabase-anon-key');

    if (urlInput) urlInput.value = cfg.url || '';
    if (keyInput) keyInput.value = cfg.anonKey || '';

    modal.classList.add('active');
  }

  async function handleSupabaseSaveSubmit(e) {
    e.preventDefault();
    const url = document.getElementById('supabase-url')?.value.trim();
    const key = document.getElementById('supabase-anon-key')?.value.trim();
    const feedback = document.getElementById('supabase-test-feedback');

    if (!window.MoonshineSupabase) return;

    try {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.backgroundColor = 'var(--info-bg)';
        feedback.style.color = '#075985';
        feedback.textContent = '⏳ Verificando credenciales y conectando...';
      }

      await window.MoonshineSupabase.testConnection(url, key);
      window.MoonshineSupabase.setConfig(url, key);

      // Sincronizar inmediatamente
      await initSupabaseSync();

      if (feedback) {
        feedback.style.backgroundColor = 'var(--success-bg)';
        feedback.style.color = '#065f46';
        feedback.textContent = '✅ Conexión establecida con éxito y datos sincronizados.';
      }

      showToast('Supabase conectado correctamente. Los datos ahora se sincronizan en la nube.', 'success', 'Nube Conectada');
      setTimeout(() => closeModal('modal-supabase-config'), 1000);
    } catch (err) {
      if (feedback) {
        feedback.style.backgroundColor = 'var(--danger-bg)';
        feedback.style.color = '#991b1b';
        feedback.textContent = `❌ ${err.message || 'Error al conectar'}`;
      }
      showToast(err.message || 'Error al conectar con Supabase', 'danger', 'Fallo de Conexión');
    }
  }

  async function handleSupabaseTestClick() {
    const url = document.getElementById('supabase-url')?.value.trim();
    const key = document.getElementById('supabase-anon-key')?.value.trim();
    const feedback = document.getElementById('supabase-test-feedback');

    if (!window.MoonshineSupabase) return;

    try {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.backgroundColor = 'var(--info-bg)';
        feedback.style.color = '#075985';
        feedback.textContent = '⏳ Probando conexión con Supabase...';
      }

      await window.MoonshineSupabase.testConnection(url, key);

      // Guardar y activar la conexión de inmediato para que no se quede en "Modo Local"
      window.MoonshineSupabase.setConfig(url, key);
      await initSupabaseSync();

      if (feedback) {
        feedback.style.backgroundColor = 'var(--success-bg)';
        feedback.style.color = '#065f46';
        feedback.textContent = '✅ ¡Conexión exitosa y activada! Tus credenciales quedaron guardadas y el indicador cambió a Nube Activa.';
      }
      showToast('Conectado a Supabase con éxito.', 'success', 'Nube Activa');
    } catch (err) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.backgroundColor = 'var(--danger-bg)';
        feedback.style.color = '#991b1b';
        feedback.textContent = `❌ ${err.message || 'Error al conectar'}`;
      }
      showToast(err.message || 'Error al conectar con Supabase', 'danger', 'Fallo de Conexión');
    }
  }

  async function handleSupabaseUploadClick() {
    if (!window.MoonshineSupabase || !window.MoonshineSupabase.isConfigured()) {
      alert('Debes configurar y conectar Supabase primero.');
      return;
    }

    if (!confirm('¿Deseas subir todos los datos actuales de este navegador a Supabase? Esto sobrescribirá el estado en la nube.')) {
      return;
    }

    try {
      await window.MoonshineSupabase.saveRemoteState(state, true);
      showToast('Datos locales subidos exitosamente a Supabase.', 'success', 'Nube Actualizada');
      logAudit('Admin', 'Subió manualmente los datos locales a la base de datos Supabase');
    } catch (e) {
      showToast('No se pudieron subir los datos a Supabase: ' + e.message, 'danger');
    }
  }

  async function handleSupabaseDownloadClick() {
    if (!window.MoonshineSupabase || !window.MoonshineSupabase.isConfigured()) {
      alert('Debes configurar y conectar Supabase primero.');
      return;
    }

    if (!confirm('¿Deseas descargar el estado desde Supabase? Los datos que no estén en la nube se sobrescribirán en este navegador.')) {
      return;
    }

    try {
      const remote = await window.MoonshineSupabase.fetchRemoteState();
      if (remote) {
        applyRemoteState(remote, false);
        showToast('Datos descargados exitosamente desde la nube Supabase.', 'success', 'Sincronizado');
        logAudit('Admin', 'Descargó manualmente los datos desde la nube Supabase');
      } else {
        alert('No se encontraron datos previos en la base de datos de Supabase.');
      }
    } catch (e) {
      showToast('Error al descargar datos de Supabase: ' + e.message, 'danger');
    }
  }

  function handleSupabaseDisconnectClick() {
    if (!confirm('¿Deseas desconectar Supabase? La aplicación continuará funcionando en Modo Local (guardando solo en este navegador).')) {
      return;
    }

    if (window.MoonshineSupabase) {
      window.MoonshineSupabase.clearConfig();
    }

    const urlInput = document.getElementById('supabase-url');
    const keyInput = document.getElementById('supabase-anon-key');
    if (urlInput) urlInput.value = '';
    if (keyInput) keyInput.value = '';

    const feedback = document.getElementById('supabase-test-feedback');
    if (feedback) feedback.style.display = 'none';

    showToast('Supabase desconectado. Aplicación en Modo Local.', 'warning', 'Desconectado');
    closeModal('modal-supabase-config');
  }

  // Arranque
  function init() {
    loadState();
    initEvents();

    // Fecha predeterminada de hoy en la estación
    const today = new Date().toISOString().split('T')[0];
    const opDateInput = document.getElementById('op-prod-date');
    if (opDateInput) opDateInput.value = today;

    applyAccessView();

    if (state.isAdmin) {
      switchTab('dashboard');
    } else {
      switchTab('station');
    }

    // Iniciar sincronización con Supabase (si está configurado)
    initSupabaseSync();
  }

  // API Pública
  window.MoonshineApp = {
    openAdminAuthModal: openAdminAuthModal,
    exitAdminMode: exitAdminMode,
    openProductionModal: () => openProductionModal(),
    openProductionModalFor: (id) => openProductionModal(id),
    openMaterialModal: () => openMaterialModal(),
    openEditMaterialModal: (id) => openMaterialModal(id),
    openRestockModal: (id) => openRestockModal(id),
    deleteMaterial: (id) => deleteMaterial(id),
    openStructureModal: () => openStructureModal(),
    openEditStructureModal: (id) => openStructureModal(id),
    deleteStructure: (id) => deleteStructure(id),
    toggleRecipeStatus: (id) => toggleRecipeStatus(id),
    clearCurrentModalRecipe: () => clearCurrentModalRecipe(),
    filterStructures: () => filterStructures(),
    resetStructureFilters: () => resetStructureFilters(),
    goToStructuresTabWithFilter: (status) => goToStructuresTabWithFilter(status),
    onDashboardOperatorFilterChange: () => onDashboardOperatorFilterChange(),
    clearDashboardOperatorFilter: () => clearDashboardOperatorFilter(),
    filterDashboardByOperator: (opName) => filterDashboardByOperator(opName),
    resetProductionFilters: () => resetProductionFilters(),
    editOperator: (oldName) => editOperator(oldName),
    toggleOperatorActive: (name) => toggleOperatorActive(name),
    deleteOperator: (name) => deleteOperator(name),
    addRecipeIngredient: () => addRecipeIngredient(),
    removeRecipeItem: (index) => removeRecipeItem(index),
    updateRecipeItemQty: (index, val) => updateRecipeItemQty(index, val),
    viewProductionDetails: (id) => viewProductionDetails(id),
    confirmRevertProduction: (id) => confirmRevertProduction(id),
    resetToSampleData: () => {
      if (confirm('¿Restablecer todos los datos a la muestra original?')) {
        resetToSampleData(true);
      }
    },
    exportDataJSON: exportDataJSON,
    exportProductionExcel: exportProductionExcel,
    exportProductionCSV: exportProductionExcel,
    exportProductionPlainCSV: exportProductionCSV,
    exportMaterialsCSV: exportMaterialsCSV,
    exportAuditCSV: exportAuditCSV,
    triggerImport: () => document.getElementById('import-file-input')?.click(),
    openSupabaseModal: () => openSupabaseModal(),
    closeModal: (id) => closeModal(id)
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
