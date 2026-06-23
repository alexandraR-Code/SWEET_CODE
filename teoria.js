function ocultarSecciones() {
    document.getElementById("fijos").classList.remove("activa");
    document.getElementById("variables").classList.remove("activa");
    document.getElementById("directos").classList.remove("activa");
    document.getElementById("materia").classList.remove("activa");
    document.getElementById("recetas").classList.remove("activa");
    document.getElementById("ganancias").classList.remove("activa");
    document.getElementById("equilibrio").classList.remove("activa");
    document.getElementById("manoDeObra").classList.remove("activa");
}

function mostrarSeccion(id) {
    ocultarSecciones();
    document.getElementById(id).classList.add("activa");

    if (id === "fijos") {
        document.getElementById("bloque_explicacion_fijos").innerHTML = explicacionCostosFijosHTML;
        if (typeof actualizarTablaCostosFijos === "function") actualizarTablaCostosFijos();
    }
    if (id === "variables") {
        document.getElementById("bloque_explicacion_variables").innerHTML = explicacionCostosVariablesHTML;
        if (typeof actualizarTablaCostosVariables === "function") actualizarTablaCostosVariables();
    }
    if (id === "directos") {
        document.getElementById("bloque_explicacion_directos").innerHTML = explicacionDirectosHTML;
        if (typeof actualizarTablaDirectos === "function") actualizarTablaDirectos();
    }
    if (id === "materia") {
        document.getElementById("bloque_explicacion_materia").innerHTML = explicacionMateriaPrimaHTML;
        if (typeof actualizarTablaMateria === "function") actualizarTablaMateria();
    }
    if (id === "manoDeObra") {
        document.getElementById("bloque_explicacion_manoDeObra").innerHTML = explicacionManoDeObraHTML;
        cargarOpcionesCargos();
        mostrarTabla();
    }
    if (id === "recetas") {
        document.getElementById("bloque_explicacion_recetas").innerHTML = explicacionRecetasHTML;
        if (typeof actualizarPantallaRecetas === "function") actualizarPantallaRecetas();
    }
    if (id === "ganancias") {
        document.getElementById("bloque_explicacion_ganancias").innerHTML = explicacionGananciaHTML;
        if (typeof actualizarSeccionGanancias === "function") actualizarSeccionGanancias();
    }
    if (id === "equilibrio") {
        document.getElementById("bloque_explicacion_equilibrio").innerHTML = explicacionEquilibrioHTML;
        if (typeof actualizarSeccionEquilibrio === "function") actualizarSeccionEquilibrio();
    }
}

/*=============================*/
// COSTOS FIJOS
/*=============================*/
const explicacionCostosFijosHTML = `
    <p>
        <strong>¿Qué son los Costos Fijos?</strong> Son obligaciones económicas que la cafetería debe cubrir independientemente del volumen de ventas o producción del mes. No varían si se venden 10 o 500 tazas, y deben pagarse para que el negocio pueda operar.
    </p>

    <div class="mt-2">
        <h3 id="fijo_formulario_titulo" class="section-heading">Agregar Nuevo Costo Fijo</h3>
        <input type="hidden" id="fijo_index_editar" value="-1">
        <div class="grid-formulario">
            <div>
                <label class="form-label">Nombre del Costo:</label>
                <input type="text" id="fijo_nombre" placeholder="Ej: Arriendo, Internet..." class="campo-control">
            </div>
            <div>
                <label class="form-label">Categoría:</label>
                <input type="text" id="fijo_categoria" placeholder="Ej: Infraestructura..." class="campo-control">
            </div>
            <div>
                <label class="form-label">Valor Mensual ($):</label>
                <input type="number" id="fijo_valor" placeholder="Ej: 350.00" class="campo-control">
            </div>
        </div>
        <div class="botonera-formulario">
            <button id="btn_cancelar_fijo" onclick="cancelarEdicionFijo()" class="btn-formulario cancelar d-none">Cancelar Edición</button>
            <button id="btn_guardar_fijo" onclick="guardarCostosFijo()" class="btn-formulario guardar">Guardar Costo Fijo</button>
        </div>
    </div>

    <div class="contenedor-tabla mt-1-5">
        <table class="tabla-tech">
            <thead>
                <tr>
                    <th class="text-center">N°</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Frecuencia</th>
                    <th class="text-center">Monto Mensual</th>
                    <th class="text-center">Monto Anual</th>
                    <th class="text-center">% del Total</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla_costos_fijos"></tbody>
        </table>
    </div>

    <div class="total-box-contenedor">
        <span class="total-box-titulo">Total Costos Fijos Mensuales: </span>
        <strong id="total_fijos_calculado" class="total-box-monto">$0.00</strong>
    </div>
`;

/*=============================*/
// COSTOS VARIABLES
/*=============================*/
const explicacionCostosVariablesHTML = `
    <p>
        <strong>¿Qué son los Costos Variables?</strong> Son costos que cambian directamente según el volumen de producción o ventas de la cafetería. Si no se produce ni se vende nada, estos costos no se generan.
    </p>

    <div class="mt-2">
        <h3 id="variable_formulario_titulo" class="section-heading">Agregar Nuevo Costo Variable</h3>
        <input type="hidden" id="variable_index_editar" value="-1">
        <div class="grid-formulario">
            <div>
                <label class="form-label">Concepto / Rubro:</label>
                <input type="text" id="variable_nombre" placeholder="Ej. Electricidad, Envases..." class="campo-control">
            </div>
            <div>
                <label class="form-label">Monto Mensual ($):</label>
                <input type="number" id="variable_valor" step="0.01" placeholder="0.00" class="campo-control">
            </div>
        </div>
        <div class="botonera-formulario">
            <button id="btn_cancelar_variable" onclick="cancelarEdicionVariable()" class="btn-formulario cancelar d-none">Cancelar</button>
            <button id="btn_guardar_variable" onclick="guardarCostoVariable()" class="btn-formulario guardar">Guardar Costo Variable</button>
        </div>
    </div>

    <div class="contenedor-tabla mt-1-5">
        <table class="tabla-tech">
            <thead>
                <tr>
                    <th>Concepto / Rubro</th>
                    <th class="text-center">Monto Mensual ($)</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla_costos_variables"></tbody>
        </table>
    </div>
`;

/*=============================*/
// COSTOS DIRECTOS E INDIRECTOS
/*=============================*/
const explicacionDirectosHTML = `
    <p>
        <strong>¿Qué son los Costos Directos e Indirectos?</strong> Clasificación que permite identificar qué gastos se pueden asignar a un producto específico y cuáles corresponden al funcionamiento general del negocio.
    </p>
    <ul>
        <li><strong>Costos Directos:</strong> Se asocian directamente a un producto. Si ese producto deja de venderse, el costo desaparece (Ej: café en grano, leche, mano de obra del barista).</li>
        <li><strong>Costos Indirectos:</strong> Gastos compartidos que no se pueden asignar a una sola unidad vendida (Ej: alquiler, energía eléctrica, sueldo del administrador).</li>
    </ul>

    <div class="grid-totales">
        <div class="tarjeta-total mp-directa">
            <p>Total Costos Directos</p>
            <h3 id="directos_total_directos">$0.00</h3>
        </div>
        <div class="tarjeta-total mp-indirecta">
            <p>Total Costos Indirectos</p>
            <h3 id="directos_total_indirectos">$0.00</h3>
        </div>
        <div class="tarjeta-total mp-general">
            <p>TOTAL GENERAL</p>
            <h3 id="directos_total_general">$0.00</h3>
        </div>
    </div>

    <div class="mt-2">
        <h3 class="section-heading">
            Detalle de Costos Directos
        </h3>
        <div class="contenedor-tabla">
            <table class="tabla-tech">
                <thead>
                    <tr>
                        <th class="text-center">N°</th>
                        <th>Concepto</th>
                        <th>Categoría</th>
                        <th class="text-center">Monto Mensual</th>
                    </tr>
                </thead>
                <tbody id="tabla_costos_directos"></tbody>
            </table>
        </div>
    </div>

    <div class="mt-2">
        <h3 class="section-heading">
            Detalle de Costos Indirectos
        </h3>
        <div class="contenedor-tabla">
            <table class="tabla-tech">
                <thead>
                    <tr>
                        <th class="text-center">N°</th>
                        <th>Concepto</th>
                        <th>Categoría</th>
                        <th class="text-center">Monto Mensual</th>
                    </tr>
                </thead>
                <tbody id="tabla_costos_indirectos"></tbody>
            </table>
        </div>
    </div>
`;

/*=============================*/
// MATERIA PRIMA
/*=============================*/
const explicacionMateriaPrimaHTML = `
    <p>
        <strong>¿Qué es la Materia Prima?</strong> Son todos los insumos que la cafetería adquiere para elaborar sus productos. Su correcto control es fundamental para determinar la rentabilidad real del negocio.
    </p>
    <ul>
        <li><strong>Materia Prima Directa (MPD):</strong> Ingredientes que forman parte del producto terminado (Ej: café, leche, jarabes).</li>
        <li><strong>Materia Prima Indirecta (MPI):</strong> Materiales necesarios para la presentación y servicio, pero que no forman parte del contenido (Ej: vasos, tapas, pajillas, servilletas).</li>
    </ul>

    <div class="grid-totales">
        <div class="tarjeta-total mp-directa">
            <p>Total MP Directa</p>
            <h3 id="total_materia_directa">$0.00</h3>
        </div>
        <div class="tarjeta-total mp-indirecta">
            <p>Total MP Indirecta</p>
            <h3 id="total_materia_indirecta">$0.00</h3>
        </div>
        <div class="tarjeta-total mp-general">
            <p>MATERIA PRIMA TOTAL</p>
            <h3 id="total_materia_general">$0.00</h3>
        </div>
        <div class="tarjeta-total mp-merma">
            <p>Total Merma ($)</p>
            <h3 id="total_merma_dinero">$0.00</h3>
        </div>
    </div>

    <div class="mt-1-5">
        <h3 id="formulario_titulo" class="section-heading">Agregar Nuevo Insumo</h3>
        <input type="hidden" id="mat_index_editar" value="-1">
        <div class="grid-formulario">
            <div>
                <label class="form-label">Nombre del Insumo:</label>
                <input type="text" id="mat_nombre" placeholder="Ej: Café en grano" class="campo-control">
            </div>
            <div>
                <label class="form-label">Unidad de Medida:</label>
                <input type="text" id="mat_unidad" placeholder="Ej: kg, litro, paquete" class="campo-control">
            </div>
            <div>
                <label class="form-label">Cantidad Formato:</label>
                <input type="number" id="mat_cantidad" step="any" placeholder="Ej: 1.00" class="campo-control">
            </div>
            <div>
                <label class="form-label">Precio de Compra ($):</label>
                <input type="number" id="mat_precio" step="any" placeholder="Ej: 12.50" class="campo-control">
            </div>
            <div>
                <label class="form-label">% Merma Estándar:</label>
                <input type="number" id="mat_merma" step="any" placeholder="Ej: 5.00" class="campo-control">
            </div>
            <div>
                <label class="form-label">Clasificación Operativa:</label>
                <select id="mat_tipo" class="campo-control">
                    <option value="DIRECTA">DIRECTA</option>
                    <option value="INDIRECTA">INDIRECTA</option>
                </select>
            </div>
        </div>
        <div class="botonera-formulario">
            <button type="button" id="btn_cancelar_edicion" onclick="cancelarEdicionMateria()" class="btn-formulario cancelar d-none">Cancelar</button>
            <button type="button" id="btn_guardar_materia" onclick="procesarFormularioMateria()" class="btn-formulario guardar">Guardar Insumo</button>
        </div>
    </div>

    <div class="contenedor-tabla mt-1-5">
        <table class="tabla-tech">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Insumo / Descripción</th>
                    <th>U. Medida</th>
                    <th>Cantidad</th>
                    <th>Precio Compra</th>
                    <th>% Merma</th>
                    <th>Precio final</th>
                    <th>Tipo Insumo</th>
                    <th class="th-center">Acción</th>
                </tr>
            </thead>
            <tbody id="tabla_materia_prima"></tbody>
        </table>
    </div>
`;

/*=============================*/
// RECETAS
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

    <div id="contenedor_recetas_dinamicas" class="mt-1-5"></div>
    
    <div class="section-divider">
        <div class="flex-between">
            <h3 class="section-heading">Crear Receta Nueva desde Cero</h3>
            <button onclick="mostrarFormularioNuevaReceta()" class="btn-formulario guardar">+ Nueva Receta</button>
        </div>

        <div id="formulario_nueva_receta" class="d-none mt-1-2">
            <div class="grid-formulario">
                <div>
                    <label class="form-label">Nombre de la receta:</label>
                    <input type="text" id="nueva_receta_nombre" placeholder="Ej: FRAPPÉ DE VAINILLA" class="campo-control">
                </div>
                <div>
                    <label class="form-label">Tiempo de preparación (min):</label>
                    <input type="number" id="nueva_receta_tiempo" placeholder="Ej: 5" class="campo-control">
                </div>
                <div>
                    <label class="form-label">Número de porciones (tazas):</label>
                    <input type="number" id="nueva_receta_porciones" placeholder="Ej: 1" class="campo-control">
                </div>
            </div>

            <h4 class="subtitle-rosa">Ingredientes / Insumos</h4>
            <div id="contenedor_filas_nueva_receta"></div>
            <button onclick="agregarFilaIngredienteNuevaReceta()" class="btn-add">+ Agregar Ingrediente</button>

            <div class="botonera-formulario mt-1-5">
                <button onclick="cancelarNuevaReceta()" class="btn-formulario cancelar">Cancelar</button>
                <button onclick="guardarNuevaRecetaDesdeCero()" class="btn-formulario guardar">Guardar Receta Nueva</button>
            </div>
        </div>
    </div>
`;
//*=============================*/
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

    <div class="mt-1-8">
        <p class="mb-1"><strong>Registrar empleado:</strong></p>
        <div class="grid-formulario">
            <div>
                <label>Nombre del empleado</label>
                <input type="text" id="inputNombre" class="input-formulario" placeholder="Ej: John">
            </div>
            <div>
                <label>Cargo</label>
                <select id="inputCargo" class="input-formulario" onchange="manejarCargo()"></select>
            </div>
            <div id="divNuevoCargo" class="d-none">
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

    <div class="mt-2 overflow-auto">
        <table class="full-width-table">
            <thead>
                <tr>
                    <th class="encabezado-tabla th-num">#</th>
                    <th class="encabezado-tabla th-concepto">Nombre</th>
                    <th class="encabezado-tabla th-concepto">Cargo</th>
                    <th class="encabezado-tabla th-concepto th-center">Tipo</th>
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
// PUNTO DE EQUILIBRIO
/*=============================*/
const explicacionEquilibrioHTML = `
    <p>
        <strong>¿Qué es el Punto de Equilibrio?</strong> Es el límite financiero donde los ingresos totales de tu cafetería igualan exactamente a tus costos totales. En este punto el negocio ni gana ni pierde, y sirve como métrica base para saber cuántas unidades se deben vender como mínimo para ser autosustentable.
    </p>
    <ul>
        <li><strong>Fórmula del Punto de Equilibrio:</strong>
            <div class="formula-tech-sm">PE = CF ÷ (PV - CVu)</div>
        </li>
        <li><strong>CF</strong> = Costos Fijos Totales &nbsp;|&nbsp; <strong>PV</strong> = Precio de Venta por taza &nbsp;|&nbsp; <strong>CVu</strong> = Costo Variable por unidad (total variables ÷ tazas estimadas)</li>
    </ul>

    <!-- TARJETAS CONECTADAS -->
    <div class="grid-totales">
        <div class="tarjeta-total mp-directa">
            <p>Total Costos Fijos</p>
            <h3 id="eq_total_fijos">$0.00</h3>
        </div>
        <div class="tarjeta-total mp-indirecta">
            <p>Total Costos Variables</p>
            <h3 id="eq_total_variables">$0.00</h3>
        </div>
        <div class="tarjeta-total mp-merma">
            <p>Costo Variable por Taza</p>
            <h3 id="eq_cvu">$0.00</h3>
        </div>
    </div>

    <!-- FORMULARIO -->
    <div class="mt-2">
        <h3 class="section-heading">
            Calcular Punto de Equilibrio
        </h3>
        <div class="grid-formulario">
            <div>
                <label class="form-label">Nombre del escenario:</label>
                <input type="text" id="eq_nombre" placeholder="Ej: Precio estándar" class="campo-control">
            </div>
            <div>
                <label class="form-label">Precio de venta por taza ($):</label>
                <input type="number" id="eq_precio" step="0.01" placeholder="Ej: 2.50" class="campo-control" oninput="previsualizarEquilibrio()">
            </div>
            <div>
                <label class="form-label">Tazas estimadas al mes (para CVu):</label>
                <input type="number" id="eq_tazas_estimadas" placeholder="Ej: 800" class="campo-control" oninput="previsualizarEquilibrio()">
            </div>
        </div>

        <!-- PREVISUALIZACIÓN EN TIEMPO REAL -->
        <div id="eq_preview" class="preview-card d-none">
            <p class="preview-card-title">Vista previa del cálculo</p>
            <div class="preview-grid">
                <div>
                    <p class="preview-label">Costo Variable por Taza</p>
                    <p id="prev_eq_cvu" class="preview-value celeste">$0.00</p>
                </div>
                <div>
                    <p class="preview-label">Margen de Contribución</p>
                    <p id="prev_eq_margen" class="preview-value verde">$0.00</p>
                </div>
                <div>
                    <p class="preview-label">Tazas para Equilibrio</p>
                    <p id="prev_eq_tazas" class="preview-value rosa">0 tazas</p>
                </div>
                <div>
                    <p class="preview-label">Ingresos en Equilibrio</p>
                    <p id="prev_eq_ingresos" class="preview-value celeste">$0.00</p>
                </div>
            </div>
        </div>

        <div class="botonera-formulario">
            <button onclick="guardarEscenarioEquilibrio()" class="btn-formulario guardar">Guardar Escenario</button>
        </div>
    </div>

    <!-- TABLA DE ESCENARIOS -->
    <div class="mt-2">
        <h3 class="section-heading">
            Escenarios Guardados
        </h3>
        <div class="contenedor-tabla">
            <table class="tabla-tech">
                <thead>
                    <tr>
                        <th class="text-center">N°</th>
                        <th>Escenario</th>
                        <th class="text-center">Precio/Taza</th>
                        <th class="text-center">CVu</th>
                        <th class="text-center">Margen Contrib.</th>
                        <th class="text-center">Tazas p/Equilibrio</th>
                        <th class="text-center">Ingresos p/Equilibrio</th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla_escenarios_equilibrio"></tbody>
            </table>
        </div>
    </div>
`;
/*=============================*/
// GANANCIA
/*=============================*/
const explicacionGananciaHTML = `
    <p>
        <strong>¿Qué es la Ganancia y cómo se calcula?</strong> Es el beneficio económico real que obtiene el negocio una vez que se han restado todos los costos y gastos de los ingresos totales por ventas.
    </p>
    <ul>
        <li><strong>Ganancia Bruta:</strong>
            <div class="formula-tech-sm">GB = Ventas Totales - Costos de Producción</div>
        </li>
        <li><strong>Ganancia Neta:</strong>
            <div class="formula-tech-sm">GN = Ventas Totales - Total de Costos y Gastos</div>
        </li>
        <li><strong>Margen de Ganancia:</strong>
            <div class="formula-tech-sm">Margen = (GN / Ventas Totales) × 100</div>
        </li>
    </ul>

    <!-- TARJETAS DE RESUMEN CONECTADAS -->
    <div class="grid-totales">
        <div class="tarjeta-total mp-directa">
            <p>Total Costos Fijos</p>
            <h3 id="gan_total_fijos">$0.00</h3>
        </div>
        <div class="tarjeta-total mp-indirecta">
            <p>Total Costos Variables</p>
            <h3 id="gan_total_variables">$0.00</h3>
        </div>
        <div class="tarjeta-total mp-merma">
            <p>Total Costos del Negocio</p>
            <h3 id="gan_total_costos">$0.00</h3>
        </div>
    </div>

    <!-- FORMULARIO CALCULADORA -->
    <div class="mt-2">
        <h3 class="section-heading">
            Calcular Ganancia por Escenario
        </h3>
        <div class="grid-formulario">
            <div>
                <label class="form-label">Nombre del escenario:</label>
                <input type="text" id="gan_nombre" placeholder="Ej: Semana normal" class="campo-control">
            </div>
            <div>
                <label class="form-label">Precio de venta por taza ($):</label>
                <input type="number" id="gan_precio" step="0.01" placeholder="Ej: 2.50" class="campo-control" oninput="previsualizarGanancia()">
            </div>
            <div>
                <label class="form-label">Tazas vendidas al mes:</label>
                <input type="number" id="gan_tazas" placeholder="Ej: 800" class="campo-control" oninput="previsualizarGanancia()">
            </div>
        </div>

        <!-- PREVISUALIZACIÓN EN TIEMPO REAL -->
        <div id="gan_preview" class="preview-card d-none">
            <p class="preview-card-title">Vista previa del cálculo</p>
            <div class="preview-grid">
                <div>
                    <p class="preview-label">Ingresos Totales</p>
                    <p id="prev_ingresos" class="preview-value celeste">$0.00</p>
                </div>
                <div>
                    <p class="preview-label">Ganancia Bruta</p>
                    <p id="prev_bruta" class="preview-value verde">$0.00</p>
                </div>
                <div>
                    <p class="preview-label">Ganancia Neta</p>
                    <p id="prev_neta" class="preview-value verde">$0.00</p>
                </div>
                <div>
                    <p class="preview-label">Margen</p>
                    <p id="prev_margen" class="preview-value rosa">0.00%</p>
                </div>
            </div>
        </div>

        <div class="botonera-formulario">
            <button onclick="guardarEscenarioGanancia()" class="btn-formulario guardar">Guardar Escenario</button>
        </div>
    </div>

    <!-- TABLA DE PRECIO SUGERIDO POR RECETA (automática, se llena sola desde recetasBase) -->
    <div class="mt-2">
        <h3 class="section-heading">
            Precio Sugerido por Receta del Menú
        </h3>
        <p class="section-description">
            Se calcula automáticamente para cada receta: <strong>Precio Sugerido = Costo de Producción ÷ (1 − % Margen ÷ 100)</strong>. Puedes editar el % Margen de cada receta directamente en la tabla.
        </p>
        <div class="contenedor-tabla">
            <table class="tabla-tech">
                <thead>
                    <tr>
                        <th class="text-center">N°</th>
                        <th>Receta</th>
                        <th class="text-center">Costo Ingredientes</th>
                        <th class="text-center">Costo Mano de Obra</th>
                        <th class="text-center">Costo de Producción</th>
                        <th class="text-center">% Margen</th>
                        <th class="text-center">Precio Sugerido</th>
                    </tr>
                </thead>
                <tbody id="tabla_precio_sugerido_recetas"></tbody>
            </table>
        </div>
    </div>

    <!-- TABLA DE ESCENARIOS -->
    <div class="mt-2">
        <h3 class="section-heading">
            Escenarios Guardados
        </h3>
        <div class="contenedor-tabla">
            <table class="tabla-tech">
                <thead>
                    <tr>
                        <th class="text-center">N°</th>
                        <th>Escenario</th>
                        <th class="text-center">Precio/Taza</th>
                        <th class="text-center">Tazas/Mes</th>
                        <th class="text-center">Ingresos</th>
                        <th class="text-center">G. Bruta</th>
                        <th class="text-center">G. Neta</th>
                        <th class="text-center">Margen</th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla_escenarios_ganancias"></tbody>
            </table>
        </div>
    </div>
`;