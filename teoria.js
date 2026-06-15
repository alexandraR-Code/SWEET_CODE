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

    <div style="margin-top: 2rem;">
        <h3 id="fijo_formulario_titulo" style="color: var(--celeste-tech); font-size: 1.1rem; margin-bottom: 1.2rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07);">Agregar Nuevo Costo Fijo</h3>
        <input type="hidden" id="fijo_index_editar" value="-1">
        <div class="grid-formulario">
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Nombre del Costo:</label>
                <input type="text" id="fijo_nombre" placeholder="Ej: Arriendo, Internet..." class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Categoría:</label>
                <input type="text" id="fijo_categoria" placeholder="Ej: Infraestructura..." class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Valor Mensual ($):</label>
                <input type="number" id="fijo_valor" placeholder="Ej: 350.00" class="campo-control">
            </div>
        </div>
        <div class="botonera-formulario">
            <button id="btn_cancelar_fijo" onclick="cancelarEdicionFijo()" class="btn-formulario cancelar" style="display:none;">Cancelar Edición</button>
            <button id="btn_guardar_fijo" onclick="guardarCostosFijo()" class="btn-formulario guardar">Guardar Costo Fijo</button>
        </div>
    </div>

    <div class="contenedor-tabla" style="margin-top: 1.5rem;">
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

    <div style="margin-top: 2rem;">
        <h3 id="variable_formulario_titulo" style="color: var(--rosa-marca); font-size: 1.2rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.5rem;">Agregar Nuevo Costo Variable</h3>
        <input type="hidden" id="variable_index_editar" value="-1">
        <div class="grid-formulario">
            <div>
                <label style="display:block; margin-bottom:0.5rem; color:var(--texto-gris); font-size:0.9rem;">Concepto / Rubro:</label>
                <input type="text" id="variable_nombre" placeholder="Ej. Electricidad, Envases..." class="campo-control">
            </div>
            <div>
                <label style="display:block; margin-bottom:0.5rem; color:var(--texto-gris); font-size:0.9rem;">Monto Mensual ($):</label>
                <input type="number" id="variable_valor" step="0.01" placeholder="0.00" class="campo-control">
            </div>
        </div>
        <div class="botonera-formulario">
            <button id="btn_cancelar_variable" onclick="cancelarEdicionVariable()" class="btn-formulario cancelar" style="display:none;">Cancelar</button>
            <button id="btn_guardar_variable" onclick="guardarCostoVariable()" class="btn-formulario guardar">Guardar Costo Variable</button>
        </div>
    </div>

    <div class="contenedor-tabla" style="margin-top: 1.5rem;">
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

    <div style="margin-top: 2rem;">
        <h3 style="color: var(--celeste-tech); font-size: 1.1rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07);">
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

    <div style="margin-top: 2rem;">
        <h3 style="color: var(--celeste-tech); font-size: 1.1rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07);">
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

    <div style="margin-top: 1.5rem;">
        <h3 id="formulario_titulo" style="color: var(--celeste-tech); font-size: 1.1rem; margin-bottom: 1.2rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07);">Agregar Nuevo Insumo</h3>
        <input type="hidden" id="mat_index_editar" value="-1">
        <div class="grid-formulario">
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Nombre del Insumo:</label>
                <input type="text" id="mat_nombre" placeholder="Ej: Café en grano" class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Unidad de Medida:</label>
                <input type="text" id="mat_unidad" placeholder="Ej: kg, litro, paquete" class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Cantidad Formato:</label>
                <input type="number" id="mat_cantidad" step="any" placeholder="Ej: 1.00" class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Precio de Compra ($):</label>
                <input type="number" id="mat_precio" step="any" placeholder="Ej: 12.50" class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">% Merma Estándar:</label>
                <input type="number" id="mat_merma" step="any" placeholder="Ej: 5.00" class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Clasificación Operativa:</label>
                <select id="mat_tipo" class="campo-control">
                    <option value="DIRECTA">DIRECTA</option>
                    <option value="INDIRECTA">INDIRECTA</option>
                </select>
            </div>
        </div>
        <div class="botonera-formulario">
            <button type="button" id="btn_cancelar_edicion" onclick="cancelarEdicionMateria()" class="btn-formulario cancelar" style="display:none;">Cancelar</button>
            <button type="button" id="btn_guardar_materia" onclick="procesarFormularioMateria()" class="btn-formulario guardar">Guardar Insumo</button>
        </div>
    </div>

    <div class="contenedor-tabla" style="margin-top: 1.5rem;">
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
                    <th style="text-align:center;">Acción</th>
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

    <div id="formulario_edicion_receta" style="margin-top: 1.5rem; margin-bottom: 1.5rem; display: none; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 1.5rem;">
        <h3 id="receta_formulario_titulo" style="color: var(--celeste-tech); font-size: 1.1rem; margin-bottom: 1.2rem;">Modificando Insumo de Receta</h3>
        <div class="grid-formulario">
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Ingrediente (nombre):</label>
                <input type="text" id="receta_ingrediente_nombre" readonly class="campo-control" style="opacity:0.6;">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Cantidad a usar en la receta:</label>
                <input type="number" id="receta_ingrediente_cantidad" placeholder="Ej: 18" class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Unidad de la receta:</label>
                <input type="text" id="receta_ingrediente_unidad" placeholder="Ej: gramos, ml, unidad" class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Tiempo de preparación (min):</label>
                <input type="number" id="receta_tiempo" placeholder="Ej: 5" class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Número de porciones (tazas):</label>
                <input type="number" id="receta_porciones" placeholder="Ej: 1" class="campo-control">
            </div>
        </div>
        <input type="hidden" id="receta_id_editar" value="-1">
        <input type="hidden" id="ingrediente_id_editar" value="-1">
        <div class="botonera-formulario">
            <button onclick="cancelarEdicionParametrosReceta()" class="btn-formulario cancelar">Cancelar</button>
            <button onclick="guardarCambiosParametrosReceta()" class="btn-formulario guardar">Guardar Cambios</button>
        </div>
    </div>

    <div id="contenedor_recetas_dinamicas" style="margin-top: 1.5rem;"></div>
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
    <div style="margin-top: 2rem;">
        <h3 style="color: var(--celeste-tech); font-size: 1.1rem; margin-bottom: 1.2rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07);">
            Calcular Punto de Equilibrio
        </h3>
        <div class="grid-formulario">
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Nombre del escenario:</label>
                <input type="text" id="eq_nombre" placeholder="Ej: Precio estándar" class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Precio de venta por taza ($):</label>
                <input type="number" id="eq_precio" step="0.01" placeholder="Ej: 2.50" class="campo-control" oninput="previsualizarEquilibrio()">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Tazas estimadas al mes (para CVu):</label>
                <input type="number" id="eq_tazas_estimadas" placeholder="Ej: 800" class="campo-control" oninput="previsualizarEquilibrio()">
            </div>
        </div>

        <!-- PREVISUALIZACIÓN EN TIEMPO REAL -->
        <div id="eq_preview" style="display:none; background: var(--bg-principal); border: 1px solid rgba(56,189,248,0.2); border-radius: 12px; padding: 1.2rem; margin-bottom: 1.2rem;">
            <p style="color:var(--texto-gris); font-size:0.85rem; margin-bottom:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Vista previa del cálculo</p>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:0.8rem;">
                <div>
                    <p style="color:var(--texto-gris); font-size:0.8rem;">Costo Variable por Taza</p>
                    <p id="prev_eq_cvu" style="color:var(--celeste-tech); font-size:1.2rem; font-weight:700; font-family:monospace;">$0.00</p>
                </div>
                <div>
                    <p style="color:var(--texto-gris); font-size:0.8rem;">Margen de Contribución</p>
                    <p id="prev_eq_margen" style="color:#10b981; font-size:1.2rem; font-weight:700; font-family:monospace;">$0.00</p>
                </div>
                <div>
                    <p style="color:var(--texto-gris); font-size:0.8rem;">Tazas para Equilibrio</p>
                    <p id="prev_eq_tazas" style="color:var(--rosa-marca); font-size:1.2rem; font-weight:700; font-family:monospace;">0 tazas</p>
                </div>
                <div>
                    <p style="color:var(--texto-gris); font-size:0.8rem;">Ingresos en Equilibrio</p>
                    <p id="prev_eq_ingresos" style="color:var(--celeste-tech); font-size:1.2rem; font-weight:700; font-family:monospace;">$0.00</p>
                </div>
            </div>
        </div>

        <div class="botonera-formulario">
            <button onclick="guardarEscenarioEquilibrio()" class="btn-formulario guardar">Guardar Escenario</button>
        </div>
    </div>

    <!-- TABLA DE ESCENARIOS -->
    <div style="margin-top: 2rem;">
        <h3 style="color: var(--celeste-tech); font-size: 1.1rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07);">
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
    <div style="margin-top: 2rem;">
        <h3 style="color: var(--celeste-tech); font-size: 1.1rem; margin-bottom: 1.2rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07);">
            Calcular Ganancia por Escenario
        </h3>
        <div class="grid-formulario">
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Nombre del escenario:</label>
                <input type="text" id="gan_nombre" placeholder="Ej: Semana normal" class="campo-control">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Precio de venta por taza ($):</label>
                <input type="number" id="gan_precio" step="0.01" placeholder="Ej: 2.50" class="campo-control" oninput="previsualizarGanancia()">
            </div>
            <div>
                <label style="display:block; font-size:0.85rem; color:var(--texto-gris); margin-bottom:0.4rem;">Tazas vendidas al mes:</label>
                <input type="number" id="gan_tazas" placeholder="Ej: 800" class="campo-control" oninput="previsualizarGanancia()">
            </div>
        </div>

        <!-- PREVISUALIZACIÓN EN TIEMPO REAL -->
        <div id="gan_preview" style="display:none; background: var(--bg-principal); border: 1px solid rgba(56,189,248,0.2); border-radius: 12px; padding: 1.2rem; margin-bottom: 1.2rem;">
            <p style="color:var(--texto-gris); font-size:0.85rem; margin-bottom:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Vista previa del cálculo</p>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:0.8rem;">
                <div>
                    <p style="color:var(--texto-gris); font-size:0.8rem;">Ingresos Totales</p>
                    <p id="prev_ingresos" style="color:var(--celeste-tech); font-size:1.2rem; font-weight:700; font-family:monospace;">$0.00</p>
                </div>
                <div>
                    <p style="color:var(--texto-gris); font-size:0.8rem;">Ganancia Bruta</p>
                    <p id="prev_bruta" style="color:#10b981; font-size:1.2rem; font-weight:700; font-family:monospace;">$0.00</p>
                </div>
                <div>
                    <p style="color:var(--texto-gris); font-size:0.8rem;">Ganancia Neta</p>
                    <p id="prev_neta" style="color:#10b981; font-size:1.2rem; font-weight:700; font-family:monospace;">$0.00</p>
                </div>
                <div>
                    <p style="color:var(--texto-gris); font-size:0.8rem;">Margen</p>
                    <p id="prev_margen" style="color:var(--rosa-marca); font-size:1.2rem; font-weight:700; font-family:monospace;">0.00%</p>
                </div>
            </div>
        </div>

        <div class="botonera-formulario">
            <button onclick="guardarEscenarioGanancia()" class="btn-formulario guardar">Guardar Escenario</button>
        </div>
    </div>

    <!-- TABLA DE ESCENARIOS -->
    <div style="margin-top: 2rem;">
        <h3 style="color: var(--celeste-tech); font-size: 1.1rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07);">
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