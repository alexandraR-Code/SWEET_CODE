function ocultarSecciones(){
  document.getElementById("fijos").classList.remove("activa");
  document.getElementById("variables").classList.remove("activa");
  document.getElementById("directos").classList.remove("activa");
  document.getElementById("materia").classList.remove("activa");
  document.getElementById("recetas").classList.remove("activa");
  document.getElementById("ganancias").classList.remove("activa");
  document.getElementById("equilibrio").classList.remove("activa");
  document.getElementById("manoDeObra").classList.remove("activa");
}

function mostrarSeccion(id){
  ocultarSecciones();
  document.getElementById(id).classList.add("activa");

  if (id === "materia") {
      document.getElementById("bloque_explicacion_materia").innerHTML = explicacionMateriaPrimaHTML;
      // Llama a la función del script principal para dibujar los insumos
      if (typeof actualizarTablaMateria === "function") {
          actualizarTablaMateria();
      }
  }
  if (id === "fijos") {
      document.getElementById("bloque_explicacion_fijos").innerHTML = explicacionCostosFijosHTML;
      // Llama a la función del script principal para dibujar la tabla de costos fijos
      if (typeof actualizarTablaCostosFijos === "function") {
          actualizarTablaCostosFijos();
      }
  }
  // Condición para la pestaña de costos directos e indirectos
  if (id === "directos") {
      document.getElementById("bloque_explicacion_directos").innerHTML = explicacionDirectosHTML;
  }
  if (id === "recetas") {
      document.getElementById("bloque_explicacion_recetas").innerHTML = explicacionRecetasHTML;
      if (typeof actualizarPantallaRecetas === "function") {
          actualizarPantallaRecetas();
      }
  }
  if (id === "equilibrio") {
      document.getElementById("bloque_explicacion_equilibrio").innerHTML = explicacionEquilibrioHTML;
  }
  if(id === "variables"){
    document.getElementById("bloque_explicacion_variables").innerHTML = explicacionCostosVariablesHTML;
  }
  if(id === "manoDeObra"){
    document.getElementById("bloque_explicacion_manoDeObra").innerHTML = explicacionManoDeObraHTML;
    cargarOpcionesCargos();
    mostrarTabla();
  }
  if(id === "ganancias"){
    document.getElementById("bloque_explicacion_ganancias").innerHTML = explicacionGananciaHTML;
  }
}

/*=============================*/
// MATERIA PRIMA
/*=============================*/
const explicacionMateriaPrimaHTML = `
    <p>
        <strong>¿Qué es la Materia Prima?</strong> Son todos los insumos que la cafetería adquiere para elaborar sus productos. Su correcto control es fundamental para determinar la rentabilidad real del negocio.
    </p>
    <ul>
        <li><strong>Materia Prima Directa (MPD):</strong> Ingredientes que forman parte del producto terminado (Ej: café, leche, jarabes). Su costo es directamente asignable a cada unidad producida.</li>
        <li><strong>Materia Prima Indirecta (MPI):</strong> Materiales necesarios para la presentación y servicio, pero que no forman parte del contenido (Ej: vasos, tapas, pajillas, servilletas).</li>
        </ul>
`;

/*=============================*/
// COSTOS FIJOS
/*=============================*/
const explicacionCostosFijosHTML = `
    <p>
        <strong>¿Qué son los Costos Fijos?</strong> Son obligaciones económicas que la cafetería debe cubrir independientemente del volumen de ventas o producción del mes. No varían si se venden 10 o 500 tazas, y deben pagarse para que el negocio pueda operar. Conocerlos permite planificar cuánto se necesita vender como mínimo para no generar pérdidas.
    </p>
    <ul>
        </li>
    </ul>
`;

/*==============================================*/
// COSTOS DIRECTOS E INDIRECTOS
/*==============================================*/
const explicacionDirectosHTML = `
    <p>
        <strong>¿Qué son los Costos Directos e Indirectos?</strong> Clasificación que permite identificar qué gastos se pueden asignar a un producto específico y cuáles corresponden al funcionamiento general del negocio.
    </p>
    <ul>
        <li><strong>Costos Directos:</strong> Se asocian directamente a un producto. Si ese producto deja de venderse, el costo desaparece (Ej: café en grano, leche, sirope de vainilla).</li>
        <li><strong>Costos Indirectos:</strong> Gastos compartidos que no se pueden asignar a una sola unidad vendida (Ej: alquiler, energía eléctrica, sueldos administrativos).</li>
    </ul>
`;

/*=============================*/
// COSTEO DE RECETAS
/*=============================*/
const explicacionRecetasHTML = `
    <p>
        <strong>¿Qué es el Costeo de Recetas?</strong> Proceso que desglosa un producto del menú en sus ingredientes para calcular cuánto cuesta producir una sola unidad. Es la base para fijar precios de venta y evitar pérdidas.
    </p>
    <ul>
        <li><strong>Costo total de la receta:</strong>
            <div class="formula-tech-sm">CTR = Σ (CMPu × cantidad usada por ingrediente)</div>
        </li>
        <li><strong>CTR</strong> = Costo Total de la Receta &nbsp;|&nbsp; <strong>CMPu</strong> = Costo de Materia Prima unitario &nbsp;|&nbsp; <strong>Σ</strong> = sumatoria de todos los ingredientes</li>
    </ul>
`;

/*=============================*/
// PUNTO DE EQUILIBRIO
/*=============================*/
const explicacionEquilibrioHTML = `
    <p>
        <strong>¿Qué es el Punto de Equilibrio?</strong> Es el límite financiero donde los ingresos totales de tu cafetería igualan exactamente a tus costos totales. En este punto, el negocio ni gana ni pierde dinero, sirviendo como métrica base para saber cuántas unidades se deben vender como mínimo para que el negocio sea autosustentable.
    </p>
    <ul>
        <li><strong>Fórmula del Punto de Equilibrio:</strong>
            <div class="formula-tech-sm">PE = CF / (PV - CVu)</div>
        </li>
        <li><strong>CF</strong> = Costos Fijos &nbsp;|&nbsp; <strong>PV</strong> = Precio de Venta &nbsp;|&nbsp; <strong>CVu</strong> = Costo Variable Unitario</li>
    </ul>
`;

/*=============================*/
// COSTOS VARIABLES
/*=============================*/
const explicacionCostosVariablesHTML = `
    <p>
        <strong>¿Qué son los Costos Variables?</strong> Son costos que cambian directamente según el volumen de producción o ventas de la cafetería. A diferencia de los costos fijos, si no se produce ni se vende nada, estos costos no se generan. Mientras más bebidas se preparen, mayor será el gasto en materias primas, empaques y suministros operativos.
    </p>
    <ul>
        <li><strong>Fórmula Costos Variables:</strong>
            <div class="formula-tech-sm">CVT = CVu × Q</div>
        </li>
        <li><strong>CVT</strong> = Costo Variable Total &nbsp;|&nbsp; <strong>CVu</strong> = Costo Variable Unitario &nbsp;|&nbsp; <strong>Q</strong> = Cantidad producida</li>
    </ul>
`;

/*=============================*/
// MANO DE OBRA
/*=============================*/
const explicacionManoDeObraHTML = `
    <p>
        <strong>¿Cómo se calcula el Costo de Mano de Obra con Horas Extras y Beneficios?</strong> Es el cálculo completo para conocer cuánto cuesta un empleado al mes en Ecuador, sumando su sueldo base, sus horas adicionales y todos los derechos de ley.
    </p>

    <ul>
        <li><strong>Fórmula del Costo Total:</strong>
            <div class="formula-tech-sm">CT = IT + IESS + D3 + D4 + Vac + FR</div>
        </li>
        <li><strong>IT</strong> = Ingreso Total &nbsp;|&nbsp; <strong>IESS</strong> = 12.15% &nbsp;|&nbsp; <strong>D3</strong> = Décimo Tercero &nbsp;|&nbsp; <strong>D4</strong> = Décimo Cuarto &nbsp;|&nbsp; <strong>Vac</strong> = Vacaciones &nbsp;|&nbsp; <strong>FR</strong> = Fondos de Reserva</li>
    </ul>

    <!-- ===== FORMULARIO DE REGISTRO ===== -->
    <div style="margin-top: 1.8rem;">
        <p style="margin-bottom: 1rem;"><strong>Registrar empleado:</strong></p>

        <div class="grid-formulario">
            <div>
                <label>Nombre del empleado</label>
                <input type="text" id="inputNombre" class="input-formulario" placeholder="Ej: John">
            </div>
            <div>
                <label>Cargo</label>
                <select id="inputCargo" class="input-formulario" onchange="manejarCargo()"></select>
            </div>
            <div id="divNuevoCargo" style="display:none;">
                <label>Nombre del nuevo cargo</label>
                <input type="text" id="inputNuevoCargo" class="input-formulario" placeholder="Ej: Limpieza">
            </div>
            <div>
                <label>Tipo de mano de obra</label>
                <input type="text" id="inputTipo" class="input-formulario" placeholder="Directo / Indirecto" readonly>
            </div>
            <div>
                <label>Sueldo base ($)</label>
                <input type="number" id="inputSueldo" class="input-formulario" placeholder="Ej: 460.00">
            </div>
            <div>
                <label>Horas extras al 50% — lunes a viernes</label>
                <input type="number" id="inputHoras50" class="input-formulario" placeholder="0">
            </div>
            <div>
                <label>Horas extras al 100% — sábados y domingos</label>
                <input type="number" id="inputHoras100" class="input-formulario" placeholder="0">
            </div>
        </div>

        <button onclick="agregarEmpleado()" class="boton-agregar">+ Agregar empleado</button>
    </div>

    <!-- ===== TABLA DE EMPLEADOS ===== -->
    <div style="margin-top: 2rem; overflow-x: auto;">
        <table style="width:100%; border-collapse:collapse;">
            <thead>
                <tr>
                    <th class="encabezado-tabla th-num">#</th>
                    <th class="encabezado-tabla th-concepto">Nombre</th>
                    <th class="encabezado-tabla th-concepto">Cargo</th>
                    <th class="encabezado-tabla th-concepto" style="text-align:center;">Tipo</th>
                    <th class="encabezado-tabla th-monto-celeste">Sueldo Base ($)</th>
                    <th class="encabezado-tabla th-monto-celeste">Ingreso Total ($)</th>
                    <th class="encabezado-tabla th-monto-rosa">IESS 12.15%</th>
                    <th class="encabezado-tabla th-monto-rosa">D. Tercero</th>
                    <th class="encabezado-tabla th-monto-rosa">D. Cuarto</th>
                    <th class="encabezado-tabla th-monto-rosa">Vacaciones</th>
                    <th class="encabezado-tabla th-monto-rosa">F. Reserva</th>
                    <th class="encabezado-tabla th-monto-verde">Costo Total ($)</th>
                    <th class="encabezado-tabla th-acciones">Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaEmpleados"></tbody>
        </table>
    </div>
`;

/*=============================*/
// GANANCIA
/*=============================*/
const explicacionGananciaHTML = `
    <p>
        <strong>¿Qué es la Ganancia y cómo se calcula?</strong> Es el beneficio económico real que obtiene el negocio una vez que se han restado todos los costos y gastos (tanto los costos fijos de personal como los costos variables) de los ingresos totales por ventas.
    </p>
    <ul>
        <li><strong>Ganancia Bruta:</strong> Resultado de restar los costos directos de producción a las ventas totales.
            <div class="formula-tech-sm">GB = Ventas Totales - Costos de Producción</div>
        </li>
        <li><strong>Ganancia Neta:</strong> Dinero final que le queda al negocio tras descontar todos los costos y gastos.
            <div class="formula-tech-sm">GN = Ventas Totales - Total de Costos y Gastos</div>
        </li>
        <li><strong>Margen de Ganancia:</strong> Porcentaje que representa la ganancia sobre el precio de venta.
            <div class="formula-tech-sm">Margen = (GN ÷ Ventas Totales) × 100</div>
        </li>
    </ul>
`;