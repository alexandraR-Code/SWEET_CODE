function ocultarSecciones(){
  //Quitar la clase activa a todas las secciones por su id
  document.getElementById("fijos").classList.remove("activa");
  document.getElementById("variables").classList.remove("activa");
  document.getElementById("directos").classList.remove("activa");
  document.getElementById("materia").classList.remove("activa");
  document.getElementById("recetas").classList.remove("activa");
  document.getElementById("ganancias").classList.remove("activa");
  document.getElementById("equilibrio").classList.remove("activa");
  document.getElementById("personal").classList.remove("activa");
}
//funcion que muestra solo la seccion cuyo id recibe como parametro 
function mostrarSeccion(id){
  //incovamos la funcion 
  ocultarSecciones(); 
  //Agregamos la clase activa solo a la seccion indicada
  document.getElementById(id).classList.add("activa");
  
  // SI la sección que se va a mostrar es 'materia', inyectamos su teoría
  if (id === "materia") {
      document.getElementById("bloque_explicacion_materia").innerHTML = explicacionMateriaPrimaHTML;
      // Llama a la función del script principal para dibujar los insumos
      if (typeof actualizarTablaMateria === "function") {
          actualizarTablaMateria();
      }
    }
  // Condición para la pestaña de costos directos e indirectos
  if (id === "directos") {
      document.getElementById("bloque_explicacion_directos").innerHTML = explicacionDirectosHTML;
  }
  // Condición para la pestaña de Recetas y Costos
  if (id === "recetas") {
      document.getElementById("bloque_explicacion_recetas").innerHTML = explicacionRecetasHTML;
  }
  // Condición para la pestaña de Equilibrio Financiero
  if (id === "equilibrio") {
      document.getElementById("bloque_explicacion_equilibrio").innerHTML = explicacionEquilibrioHTML;
  }
  
  // En el futuro, aquí podrás añadir más condiciones para las otras pestañas:
  // if (id === "recetas") { ... }
}

// MATERIA PRIMA

const explicacionMateriaPrimaHTML = `
    <p>
        <strong>¿Qué es la Materia Prima?</strong> Comprende todos los recursos e insumos primarios adquiridos por la cafetería para ser sometidos a un proceso de transformación operativa o consumo directo, con el objetivo de estructurar los productos finales destinados a la venta. En la contabilidad de costos, su correcto control e inventario son fundamentales para determinar la rentabilidad real del negocio.
    </p>
    <ul>
        <li><strong>Materia Prima Directa (MPD):</strong> Representa los componentes esenciales que se integran de forma física, medible y principal en la elaboración de cada taza o producto terminado (Ej: Café en grano/molido, leche, agua filtrada, jarabes esenciales). Su costo es directamente asignable al producto unitario.</li>
        <li><strong>Materia Prima Indirecta (MPI):</strong> Constituye el conjunto de materiales y suministros complementarios que, aunque no forman parte física del contenido consumible, son indispensables para la presentación, el expendio y el servicio comercial al cliente (Ej: Vasos descartables, tapas, pajillas, servilletas). Se distribuyen como costos indirectos de fabricación.</li>
    </ul>
`;
// COSTOS DIRECTOS E INDIRECTOS EN LA CAFETERÍA

const explicacionDirectosHTML = `
    <p>
        <strong>¿Qué son los Costos Directos e Indirectos?</strong> En la gestión financiera de una cafetería, es fundamental clasificar los costos según su nivel de vinculación con los productos del menú. Esta división te permite identificar con precisión cuánto te cuesta producir cada taza de café y qué gastos generales debe absorber el negocio para mantenerse operativo.
    </p>
    <ul>
        <li><strong>Costos Directos:</strong> Son aquellos recursos que se asocian de forma clara, inequívoca y proporcional a un producto específico. Si dejas de vender ese producto en particular, este costo desaparece (Ej: Café en grano para un espresso, leche para un Latte o el sirope de vainilla).</li>
        <li><strong>Costos Indirectos:</strong> Son los gastos compartidos necesarios para el funcionamiento global de la cafetería, pero que no se pueden asignar fácilmente a una sola taza de café vendida (Ej: El alquiler del local comercial, la factura de energía eléctrica, el Wi-Fi gratuito para los clientes, y los sueldos del personal de administración o limpieza).</li>
    </ul>
`;

// COSTEO DE RECETAS
const explicacionRecetasHTML = `
    <p>
        <strong>¿Qué es el Costeo de Recetas?</strong> Es el proceso matemático y operativo que permite desglosar un producto del menú en sus ingredientes individuales para calcular con precisión cuánto dinero cuesta producir una sola unidad (por ejemplo, una taza de Cappuccino o una taza de Cafe con Leche). Es la herramienta clave para fijar precios de venta estratégicos y evitar pérdidas invisibles.
    </p>
`;

// PUNTO DE EQUILIBRIO 
const explicacionEquilibrioHTML = `
    <p>
        <strong>¿Qué es el Punto de Equilibrio?</strong> Es el límite financiero donde los ingresos totales de tu cafetería igualan exactamente a tus costos totales. En este punto, el negocio ni gana ni pierde dinero, sirviendo como métrica base para saber cuántas unidades se deben vender como mínimo para que el negocio sea autosustentable.
    </p>
    
    <p><strong>Fórmula del Punto de Equilibrio:</strong></p>
    
    <div class="formula-tech">
        PE = Costos Fijos / (Precio de Venta - Costo Variable Unitario)
    </div>
    `;