function ocultarSecciones(){
  //Quitar la clase activa a todas las secciones por su id
  document.getElementById("fijos").classList.remove("activa");
  document.getElementById("variables").classList.remove("activa");
  document.getElementById("directos").classList.remove("activa");
  document.getElementById("materia").classList.remove("activa");
  document.getElementById("recetas").classList.remove("activa");
  document.getElementById("ganancias").classList.remove("activa");
  document.getElementById("equilibrio").classList.remove("activa");
  document.getElementById("manoDeObra").classList.remove("activa");
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
  }
    // SI la sección que se va a mostrar es 'Costos Fijos', inyectamos su teoría
  if(id === "fijos"){
    document.getElementById("bloque_explicacion_fijos").innerHTML = explicacionCostosFijosHTML;
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
  // Condición para la pestaña de Costos variables
  if(id === "variables"){
    document.getElementById("bloque_explicacion_variables").innerHTML = explicacionCostosVariablesHTML;
  }
  // Condición para la pestaña de Mano de Obra
  if(id === "manoDeObra"){
    document.getElementById("bloque_explicacion_manoDeObra").innerHTML = explicacionManoDeObraHTML;
  }
  //
  if(id === "ganancias"){
    document.getElementById("bloque_explicacion_ganancias").innerHTML = explicacionGananciaHTML;
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

// COSTOS FIJOS
const explicacionCostosFijosHTML = `
    <p>
        <strong>¿Qué son los Costos Fijos?</strong> Son obligaciones que la cafetería debe pagar independientemente de cuántas tazas venda en el mes. No varían con el volumen de producción o ventas. Se calcula sumando cada uno de los costos fijos individuales durante un periodo de tiempo determinado.
    </p>
    <ul>
        <li><strong>No cambian a corto plazo:</strong> Se pagan igual aunque se vendan 10 o 500 tazas.</li>
        <li><strong>Son obligatorios:</strong> La cafetería debe pagarlos para poder operar</li>
        <li><strong>Permiten planificar:</strong> Al conocerlos, sabemos cuánto debemos vender mínimo para no perder dinero.</li>
    </ul>

    <p><strong>Fórmula Costos Fijos:</strong></p>
    <div class="formula-tech">
       CFT = F1 + F2 + F3...
    </div>
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
// COSTOS VARIABLES
const explicacionCostosVariablesHTML = `
    <p>
        <strong>¿Qué son los Costos Variables?</strong> Son costos que cambian dependiendo de cuánto produce o vende la cafetería.
    </p>
    <ul> 
        <li><strong>Aumentan con las ventas:</strong> Mientras más productos se preparen, mayor será el gasto.</li>
        <li><strong>Dependen de la producción:</strong> Se consumen según la cantidad de bebidas vendidas.</li>
        <li><strong>Son operativos:</strong> Incluyen servicios, limpieza y empaques adicionales.</li>
    </ul>

    <p><strong>Fórmula Costos Variables:</strong></p>
    <div class="formula-tech">
       Costo Variable Total (CVT) = Costo Variable Unitario (CVu) × Cantidad (Q) - CVT = CVu × Q
    </div>
`;
// MANO DE OBRA
 const explicacionManoDeObraHTML = `
    <p>
        <strong>¿Cómo se calcula el Costo de Mano de Obra con Horas Extras y Beneficios?</strong> Es el cálculo completo para conocer cuánto cuesta un empleado al mes en Ecuador, sumando su sueldo base, sus horas adicionales y todos los derechos de ley.
    </p>
    <ul>
        <li><strong>Paso 1 (Calcular las Horas):</strong> Se divide el sueldo base para 240 horas al mes para obtener el valor de la hora normal. Las horas con el 50% de recargo se multiplican por 1.5, y las del 100% (fines de semana) se multiplican por 2.</li>
        <li><strong>Paso 2 (Calcular el Ingreso Total):</strong> Se suma el sueldo base más el dinero ganado por todas las horas extras trabajadas en el mes.</li>
        <li><strong>Paso 3 (Calcular los Beneficios de Ley):</strong> Sobre ese ingreso total se calculan los costos obligatorios: IESS Patronal (12.15%), Décimo Tercero (ingreso total dividido para 12), Vacaciones (ingreso total dividido para 24) y Décimo Cuarto (un valor fijo de $40.17).</li>
    </ul>
    <p><strong>Fórmula de las Horas:</strong></p>
        <div class="formula-tech">
        Hora Normal = Sueldo Base ÷ 240 | Hora 50% = Hora Normal × 1.5 | Hora 100% = Hora Normal × 2
        </div>
    
    <p><strong>Fórmula del Ingreso Total (IT):</strong></p>
        <div class="formula-tech">
        IT = Sueldo Base + Total de Horas Extras Ganadas
        </div>
    
    <p><strong>Fórmula del Costo Real Total:</strong></p>
        <div class="formula-tech">
        Costo Total = IT + IESS Patronal + Décimo Tercero + Décimo Cuarto + Vacaciones
        </div>
`;
// GANANCIA
const explicacionGananciaHTML = `
    <p>
        <strong>¿Qué es la Ganancia y cómo se calcula?</strong> Es el beneficio económico real que obtiene el negocio una vez que se han restado todos los costos y gastos (tanto los costos fijos de personal como los costos variables) de los ingresos totales por ventas.
    </p>
    <ul>
        <li><strong>Ganancia Bruta:</strong> Es el resultado de restar únicamente los costos directos de producción (materia prima) de las ventas totales. Indica si el precio del producto está bien asignado.</li>
        <li><strong>Ganancia Neta (Utilidad Real):</strong> Es el dinero final que le queda a la empresa. Se calcula restando de la ganancia bruta todos los gastos fijos, sueldos con beneficios de ley, servicios y administración.</li>
        <li><strong>Margen de Ganancia:</strong> Es el porcentaje que representa la ganancia sobre el precio de venta. Permite medir qué tan rentable y eficiente está siendo el negocio.</li>
    </ul>
    <p><strong>Fórmula de Ganancia Bruta:</strong></p>
        <div class="formula-tech"> 
        Ganancia Bruta = Ventas Totales - Costos de Producción
        </div>
    
    <p><strong>Fórmula de Ganancia Neta:</strong></p>
        <div class="formula-tech">
        Ganancia Neta = Ventas Totales - Total de Costos y Gastos
        </div>

    <p><strong>Fórmula del Margen de Ganancia (%):</strong></p>
        <div class="formula-tech">
        Margen = (Ganancia Neta ÷ Ventas Totales) × 100
        </div>
`;
