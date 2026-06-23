// SECCIÃ“N: COSTOS FIJOS
// ============================================================

// Arreglo con todos los gastos fijos mensuales del negocio
let costosFijos = [
    { concepto: "Sueldo barista", categoria: "Personal", frecuencia: "Mensual", montoMensual: 0.00, inputId: "fijo_barista" },
    { concepto: "Sueldo cajera", categoria: "Personal", frecuencia: "Mensual", montoMensual: 0.00, inputId: "fijo_cajera" },
    { concepto: "Arriendo del local", categoria: "Infraestructura", frecuencia: "Mensual", montoMensual: 350.00, inputId: "fijo_arriendo" },
    { concepto: "Sueldo administrador", categoria: "Personal", frecuencia: "Mensual", montoMensual: 0.00, inputId: "fijo_admin" },
    { concepto: "Depreciación maquinaria", categoria: "Activos fijos", frecuencia: "Mensual", montoMensual: 50.00, inputId: "fijo_depreciacion" },
    { concepto: "Electricidad", categoria: "Servicios básicos", frecuencia: "Mensual", montoMensual: 10.00, inputId: "fijo_electricidad" },
    { concepto: "Agua potable", categoria: "Servicios básicos", frecuencia: "Mensual", montoMensual: 15.00, inputId: "fijo_agua" },
    { concepto: "Internet y teléfono", categoria: "Servicios básicos", frecuencia: "Mensual", montoMensual: 35.00, inputId: "fijo_internet" },
    { concepto: "Honorarios contabilidad", categoria: "Servicios profesionales", frecuencia: "Mensual", montoMensual: 50.00, inputId: "fijo_contabilidad" },
    { concepto: "Seguros", categoria: "Gastos legales", frecuencia: "Mensual", montoMensual: 30.00, inputId: "fijo_seguro" },
    { concepto: "Licencias y permisos", categoria: "Gastos legales", frecuencia: "Mensual", montoMensual: 12.00, inputId: "fijo_licencias" },
    { concepto: "Publicidad fija", categoria: "Marketing", frecuencia: "Mensual", montoMensual: 30.00, inputId: "fijo_publicidad" }
];

// Suma el costoTotal de todos los empleados que tienen el cargo indicado
/**\n * Calcula el costo total de todos los empleados con el cargo dado.\n * Itera sobre `listaEmpleados` y suma `costoTotal` cuando el cargo coincide,\n * incluyendo la lógica de equivalencia entre "Cajera" y "Cajero".\n * @param {string} cargo - Cargo a filtrar (por ejemplo, "Barista").\n * @returns {number} Total acumulado de los costos de ese cargo.\n */
function obtenerCostoTotalPorCargo(cargo) {
    let total = 0;
    for (let j = 0; j < listaEmpleados.length; j++) {
        if (listaEmpleados[j].cargo.toLowerCase() === cargo.toLowerCase() ||
            (cargo.toLowerCase() === "cajera" && listaEmpleados[j].cargo.toLowerCase() === "cajero")) {
            total += listaEmpleados[j].costoTotal;
        }
    }
    return total;
}

// Sincroniza los sueldos desde mano de obra, dibuja la tabla y actualiza el total mensual
/**\n * Sincroniza los costos fijos con los valores actuales de mano de obra,\n * recalcula totales y renderiza la tabla HTML de costos fijos.\n * @returns {void}\n */
function actualizarTablaCostosFijos() {
    let tablaBody = document.getElementById("tabla_costos_fijos");
    if (!tablaBody) return;

    let tfootViejo = tablaBody.parentElement.querySelector("tfoot");
    if (tfootViejo) { tfootViejo.remove(); }

    // Actualiza automáticamente los montos de personal desde mano de obra
    for (let i = 0; i < costosFijos.length; i++) {
        if (costosFijos[i].inputId === "fijo_barista") {
            costosFijos[i].montoMensual = obtenerCostoTotalPorCargo("Barista");
        } else if (costosFijos[i].inputId === "fijo_cajera") {
            costosFijos[i].montoMensual = obtenerCostoTotalPorCargo("Cajero");
        } else if (costosFijos[i].inputId === "fijo_admin") {
            costosFijos[i].montoMensual = obtenerCostoTotalPorCargo("Administrador");
        }
    }

    let totalMensual = 0;
    for (let i = 0; i < costosFijos.length; i++) {
        totalMensual = totalMensual + costosFijos[i].montoMensual;
    }

    tablaBody.innerHTML = "";
    for (let i = 0; i < costosFijos.length; i++) {
        let item = costosFijos[i];
        let montoAnual = item.montoMensual * 12;
        let porcentaje = totalMensual > 0 ? (item.montoMensual / totalMensual) * 100 : 0;

        let fila = `
        <tr>
            <td class="text-gris text-center">${i + 1}</td>
            <td class="text-blanco font-semibold">${item.concepto}</td>
            <td class="text-celeste font-semibold">${item.categoria}</td>
            <td class="text-gris">${item.frecuencia}</td>
            <td class="text-verde font-bold text-center">$${item.montoMensual.toFixed(2)}</td>
            <td class="text-gris text-center">$${montoAnual.toFixed(2)}</td>
            <td class="text-rosa font-medium text-center">${porcentaje.toFixed(2)}%</td>
            <td class="text-center">
                <button onclick="cargarFijoParaEditar(${i})" class="btn-editar-tech">Editar</button>
            </td>
        </tr>
        `;
        tablaBody.innerHTML += fila;
    }

    let totalAnual = totalMensual * 12;
    let tfoot = document.createElement("tfoot");
    tfoot.innerHTML = `
    <tr class="bg-total-row">
        <td colspan="4" class="text-verde font-bold uppercase">Total</td>
        <td class="text-verde font-bold text-center">$${convertirMoneda(totalMensual)}</td>
        <td class="text-verde font-bold text-center">$${convertirMoneda(totalAnual)}</td>
        <td class="text-verde font-bold text-center">100%</td>
        <td></td>
    </tr>
    `;
    tablaBody.parentElement.appendChild(tfoot);

    let elTotal = document.getElementById("total_fijos_calculado");
    if (elTotal) { elTotal.innerText = convertirMoneda(totalMensual); }

    sincronizarTotalesMateriaPrima();
}

// Valida el formulario y guarda o actualiza el gasto fijo según el modo activo
/**\n * Valida y guarda un costo fijo nuevo o editado.\n * Si está en modo edición, actualiza el registro existente; si no, inserta uno nuevo.\n * @returns {void}\n */
function guardarCostosFijo() {
    let nombre = recuperarTexto("fijo_nombre");
    let categoria = recuperarTexto("fijo_categoria");
    let valor = recuperarFloatSeguro("fijo_valor");
    let indexEditar = parseInt(document.getElementById("fijo_index_editar").value);

    if (nombre === "" || valor <= 0) {
        alert("Por favor ingresa un nombre y un valor mayor a cero.");
        return;
    }

    let datosFijo = {
        concepto: nombre,
        categoria: categoria !== "" ? categoria : "Otros",
        frecuencia: "Mensual",
        montoMensual: valor,
        inputId: indexEditar !== -1 ? costosFijos[indexEditar].inputId : ""
    };

    if (indexEditar === -1) {
        costosFijos.push(datosFijo);
    } else {
        costosFijos[indexEditar] = datosFijo;
        cancelarEdicionFijo();
        actualizarTablaCostosFijos();
        return;
    }

    limpiarFormularioFijo();
    actualizarTablaCostosFijos();
}

// Inyecta los datos del gasto fijo seleccionado en el formulario para editarlo
/**\n * Carga los valores de un costo fijo en el formulario para edición.\n * Actualiza el título, el botón y muestra el botón cancelar.\n * @param {number} index - Índice del costo fijo en el arreglo `costosFijos`.\n * @returns {void}\n */
function cargarFijoParaEditar(index) {
    let item = costosFijos[index];
    mostrarTextoEnCaja("fijo_nombre", item.concepto);
    mostrarTextoEnCaja("fijo_categoria", item.categoria);
    mostrarTextoEnCaja("fijo_valor", item.montoMensual);

    document.getElementById("fijo_index_editar").value = index;
    document.getElementById("fijo_formulario_titulo").innerText = "Modificar Gasto Fijo";

    let btnGuardar = document.getElementById("btn_guardar_fijo");
    btnGuardar.innerText = "Guardar Cambios";
    btnGuardar.style.backgroundColor = "#10b981";

    document.getElementById("btn_cancelar_fijo").style.display = "inline-block";
    document.getElementById("fijo_formulario_titulo").scrollIntoView({ behavior: "smooth" });
}

// Restablece el formulario de costos fijos al estado de agregar nuevo gasto
/**\n * Restablece el formulario de costos fijos al estado de creación.\n * Vuelve a ocultar el botón cancelar y limpia los campos.\n * @returns {void}\n */
function cancelarEdicionFijo() {
    document.getElementById("fijo_index_editar").value = "-1";
    document.getElementById("fijo_formulario_titulo").innerText = "Agregar Nuevo Gasto Fijo";

    let btnGuardar = document.getElementById("btn_guardar_fijo");
    btnGuardar.innerText = "Guardar Gasto Fijo";
    btnGuardar.style.backgroundColor = "var(--rosa-marca)";

    document.getElementById("btn_cancelar_fijo").style.display = "none";
    limpiarFormularioFijo();
}

// Vacía todos los campos del formulario de costos fijos
/**\n * Limpia los campos del formulario de costo fijo estableciendo valores vacíos.\n * @returns {void}\n */
function limpiarFormularioFijo() {
    mostrarTextoEnCaja("fijo_nombre", "");
    mostrarTextoEnCaja("fijo_categoria", "");
    mostrarTextoEnCaja("fijo_valor", "");
}


// ============================================================
// SECCIÃ“N: COSTOS VARIABLES
// ============================================================

// Arreglo con los rubros variables: los 3 primeros son automáticos desde materia prima
let costosVariables = [
    { concepto: "Materia Prima Directa (MPD)", monto: 0, esAutomatico: true },
    { concepto: "Materia Prima Indirecta (MPI)", monto: 0, esAutomatico: true },
    { concepto: "Merma en Dinero", monto: 0, esAutomatico: true },
    { concepto: "Servicio de electricidad", monto: 45.00, esAutomatico: false },
    { concepto: "Suministros de limpieza", monto: 18.00, esAutomatico: false }
];

// Extrae un número limpio del DOM intentando varios IDs posibles
/**\n * Devuelve el primer valor numérico encontrado en uno de los elementos DOM dados.\n * Intenta cada id y parsea el texto o valor eliminando caracteres no numéricos.\n * @param {string[]} idsPosibles - Lista de IDs de elementos a consultar.\n * @returns {number} Valor numérico extraído o 0 si no hay dato válido.\n */
function obtenerValorDeMateria(idsPosibles) {
    for (let id of idsPosibles) {
        let el = document.getElementById(id);
        if (el) {
            let texto = el.innerText || el.value || "0";
            let valor = parseFloat(texto.replace(/[^0-9.-]/g, ""));
            if (!isNaN(valor)) return valor;
        }
    }
    return 0;
}

// Sincroniza los automáticos desde materia prima, dibuja la tabla y actualiza el total
/**\n * Sincroniza los costos variables automáticos desde materia prima,\n * construye la tabla de costos variables y actualiza el total mensual.\n * @returns {void}\n */
function actualizarTablaCostosVariables() {
    let tablaBody = document.getElementById("tabla_costos_variables");
    if (!tablaBody) return;

    let totalesMP = calcularTotalesMateriaPrima();
    let totalMerma = 0;
    for (let i = 0; i < materiasPrimas.length; i++) {
        totalMerma += materiasPrimas[i].precio * (materiasPrimas[i].merma / 100);
    }
    costosVariables[0].monto = totalesMP.totalDirecta;
    costosVariables[1].monto = totalesMP.totalIndirecta;
    costosVariables[2].monto = totalMerma;

    tablaBody.innerHTML = "";
    let totalMensualVariables = 0;

    for (let i = 0; i < costosVariables.length; i++) {
        let item = costosVariables[i];
        totalMensualVariables += item.monto;

        let botonAccion = item.esAutomatico
            ? `<span class="text-gris italic text-sm">Dinámico</span>`
            : `<button onclick="cargarVariableParaEditar(${i})" class="btn-editar-tech">Editar</button>`;

        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.concepto}</td>
            <td class="text-center font-semibold text-verde">$${item.monto.toFixed(2)}</td>
            <td class="text-center">${botonAccion}</td>
        `;
        tablaBody.appendChild(fila);
    }

    let tfootViejo = tablaBody.parentElement.querySelector("tfoot");
    if (tfootViejo) { tfootViejo.remove(); }

    let tfoot = document.createElement("tfoot");
    tfoot.className = "bg-total-row";
    tfoot.innerHTML = `
        <tr>
            <td class="font-bold td-pad-1">TOTAL COSTOS VARIABLES MENSUALES</td>
            <td class="text-center font-bold text-verde td-pad-1">$${totalMensualVariables.toFixed(2)}</td>
            <td></td>
        </tr>
    `;
    tablaBody.parentElement.appendChild(tfoot);

    let resumenCV = document.getElementById("var_resumen_total");
    if (resumenCV) {
        resumenCV.innerText = `$${totalMensualVariables.toFixed(2)}`;
    }
}

// Inyecta los datos del rubro variable en el formulario para editarlo; bloquea los automáticos
/**\n * Carga un costo variable en el formulario para edición.\n * Evita editar rubros automáticos que se calculan desde materia prima.\n * @param {number} index - Índice del rubro en `costosVariables`.\n * @returns {void}\n */
function cargarVariableParaEditar(index) {
    let item = costosVariables[index];

    if (item.esAutomatico) {
        alert("Este rubro se calcula automáticamente desde la sección de Materia Prima.");
        return;
    }

    mostrarTextoEnCaja("variable_nombre", item.concepto);
    mostrarTextoEnCaja("variable_valor", item.monto);

    document.getElementById("variable_index_editar").value = index;
    document.getElementById("variable_formulario_titulo").innerText = "Modificar Costo Variable";

    let btnGuardar = document.getElementById("btn_guardar_variable");
    if (btnGuardar) {
        btnGuardar.innerText = "Guardar Cambios";
        btnGuardar.style.backgroundColor = "#10b981";
    }

    let btnCancelar = document.getElementById("btn_cancelar_variable");
    if (btnCancelar) btnCancelar.style.display = "inline-block";

    document.getElementById("variable_formulario_titulo").scrollIntoView({ behavior: "smooth" });
}

// Valida el formulario y agrega o actualiza el costo variable manual según el modo activo
/**\n * Valida y guarda un costo variable manual.\n * Actualiza el arreglo si el índice está en modo edición o agrega un nuevo rubro.\n * @returns {void}\n */
function guardarCostoVariable() {
    let nombre = recuperarTexto("variable_nombre").trim();
    let valor = recuperarFloatSeguro("variable_valor");
    let indexEditar = parseInt(document.getElementById("variable_index_editar").value);

    if (nombre === "") {
        alert("Por favor, ingrese el concepto del costo variable.");
        return;
    }
    if (valor <= 0 || isNaN(valor)) {
        alert("Por favor, ingrese un monto mensual válido mayor a 0.");
        return;
    }

    if (indexEditar === -1) {
        costosVariables.push({ concepto: nombre, monto: valor, esAutomatico: false });
    } else {
        if (costosVariables[indexEditar].esAutomatico) {
            alert("Este rubro es automático y no se puede modificar manualmente.");
            cancelarEdicionVariable();
            return;
        }
        costosVariables[indexEditar].concepto = nombre;
        costosVariables[indexEditar].monto = valor;
    }

    cancelarEdicionVariable();
    actualizarTablaCostosVariables();
}

// Restablece el formulario de costos variables al estado de agregar nuevo rubro
/**\n * Restablece el formulario de costo variable al estado de alta.\n * Limpia los campos y oculta el botón de cancelar.\n * @returns {void}\n */
function cancelarEdicionVariable() {
    document.getElementById("variable_index_editar").value = "-1";
    document.getElementById("variable_formulario_titulo").innerText = "Agregar Nuevo Costo Variable";

    let btnGuardar = document.getElementById("btn_guardar_variable");
    if (btnGuardar) {
        btnGuardar.innerText = "Guardar Costo Variable";
        btnGuardar.style.backgroundColor = "var(--rosa-marca)";
    }

    let btnCancelar = document.getElementById("btn_cancelar_variable");
    if (btnCancelar) btnCancelar.style.display = "none";

    mostrarTextoEnCaja("variable_nombre", "");
    mostrarTextoEnCaja("variable_valor", "");
}


// ============================================================
// SECCIÃ“N: COSTOS DIRECTOS E INDIRECTOS
// ============================================================

// Clasifica materia prima, mano de obra y costos fijos en directos e indirectos y actualiza las tarjetas
/**\n * Calcula y muestra los costos directos e indirectos en tablas separadas.\n * Suma materia prima, mano de obra y costos fijos según su clasificación.\n * @returns {void}\n */
function actualizarTablaDirectos() {
    let cuerpoDirectos = document.getElementById("tabla_costos_directos");
    let cuerpoIndirectos = document.getElementById("tabla_costos_indirectos");
    if (!cuerpoDirectos || !cuerpoIndirectos) return;

    cuerpoDirectos.innerHTML = "";
    cuerpoIndirectos.innerHTML = "";

    let totalDirectos = 0;
    let totalIndirectos = 0;
    let contD = 1;
    let contI = 1;

    // --- Materia Prima ---
    let totalesMP = calcularTotalesMateriaPrima();

    cuerpoDirectos.innerHTML += `
        <tr>
            <td class="text-gris text-center">${contD++}</td>
            <td class="text-blanco font-semibold">Materia Prima Directa</td>
            <td class="text-celeste">Insumos de producción</td>
            <td class="text-verde font-bold text-center">${convertirMoneda(totalesMP.totalDirecta)}</td>
        </tr>`;
    totalDirectos += totalesMP.totalDirecta;

    cuerpoIndirectos.innerHTML += `
        <tr>
            <td class="text-gris text-center">${contI++}</td>
            <td class="text-blanco font-semibold">Materia Prima Indirecta</td>
            <td class="text-violeta">Insumos de presentación</td>
            <td class="text-verde font-bold text-center">${convertirMoneda(totalesMP.totalIndirecta)}</td>
        </tr>`;
    totalIndirectos += totalesMP.totalIndirecta;

    // --- Mano de Obra: directos al primer bloque, indirectos al segundo ---
    for (let i = 0; i < listaEmpleados.length; i++) {
        let emp = listaEmpleados[i];
        if (emp.tipo === "Directo") {
            cuerpoDirectos.innerHTML += `
                <tr>
                    <td class="text-gris text-center">${contD++}</td>
                    <td class="text-blanco font-semibold">Mano de Obra â€” ${emp.nombre} (${emp.cargo})</td>
                    <td class="text-celeste">Personal directo</td>
                    <td class="text-verde font-bold text-center">${convertirMoneda(emp.costoTotal)}</td>
                </tr>`;
            totalDirectos += emp.costoTotal;
        } else {
            cuerpoIndirectos.innerHTML += `
                <tr>
                    <td class="text-gris text-center">${contI++}</td>
                    <td class="text-blanco font-semibold">Mano de Obra â€” ${emp.nombre} (${emp.cargo})</td>
                    <td class="text-violeta">Personal indirecto</td>
                    <td class="text-verde font-bold text-center">${convertirMoneda(emp.costoTotal)}</td>
                </tr>`;
            totalIndirectos += emp.costoTotal;
        }
    }

    // --- Costos fijos generales van a indirectos (se excluyen los de personal) ---
    let idsPersonal = ["fijo_barista", "fijo_cajera", "fijo_admin"];
    for (let i = 0; i < costosFijos.length; i++) {
        let fijo = costosFijos[i];
        if (idsPersonal.indexOf(fijo.inputId) !== -1) continue;
        if (fijo.montoMensual <= 0) continue;
        cuerpoIndirectos.innerHTML += `
            <tr>
                <td class="text-gris text-center">${contI++}</td>
                <td class="text-blanco font-semibold">${fijo.concepto}</td>
                <td class="text-violeta">${fijo.categoria}</td>
                <td class="text-verde font-bold text-center">${convertirMoneda(fijo.montoMensual)}</td>
            </tr>`;
        totalIndirectos += fijo.montoMensual;
    }

    // Actualiza las tarjetas de resumen con los totales calculados
    let elD = document.getElementById("directos_total_directos");
    let elI = document.getElementById("directos_total_indirectos");
    let elG = document.getElementById("directos_total_general");
    if (elD) elD.innerText = convertirMoneda(totalDirectos);
    if (elI) elI.innerText = convertirMoneda(totalIndirectos);
    if (elG) elG.innerText = convertirMoneda(totalDirectos + totalIndirectos);
}


// ============================================================
// SECCIÃ“N: MATERIA PRIMA
// ============================================================

// Arreglo principal con todos los insumos directos e indirectos del negocio
let materiasPrimas = [
    { nombre: "Café molido espresso", unidad: "kg", cantidad: 1.00, precio: 10.00, merma: 5.00, tipo: "DIRECTA" },
    { nombre: "Café en grano (moler)", unidad: "kg", cantidad: 1.00, precio: 12.00, merma: 8.00, tipo: "DIRECTA" },
    { nombre: "Leche entera", unidad: "litro", cantidad: 1.00, precio: 1.50, merma: 3.00, tipo: "DIRECTA" },
    { nombre: "Leche en polvo", unidad: "kg", cantidad: 1.00, precio: 5.20, merma: 2.00, tipo: "DIRECTA" },
    { nombre: "Crema de leche", unidad: "litro", cantidad: 1.00, precio: 2.80, merma: 5.00, tipo: "DIRECTA" },
    { nombre: "Chocolate en polvo / cacao", unidad: "kg", cantidad: 1.00, precio: 6.50, merma: 3.00, tipo: "DIRECTA" },
    { nombre: "Sirope de chocolate", unidad: "litro", cantidad: 1.00, precio: 4.80, merma: 5.00, tipo: "DIRECTA" },
    { nombre: "Agua purificada", unidad: "litro", cantidad: 1.00, precio: 0.75, merma: 0.00, tipo: "DIRECTA" },
    { nombre: "Azúcar blanca", unidad: "kg", cantidad: 1.00, precio: 1.50, merma: 1.00, tipo: "INDIRECTA" },
    { nombre: "Vasos desechables 8 oz", unidad: "paquete x100", cantidad: 100.00, precio: 4.00, merma: 2.00, tipo: "INDIRECTA" },
    { nombre: "Vasos desechables 12 oz", unidad: "paquete x100", cantidad: 100.00, precio: 5.00, merma: 2.00, tipo: "INDIRECTA" },
    { nombre: "Vasos desechables 6 oz", unidad: "paquete x100", cantidad: 100.00, precio: 3.00, merma: 1.00, tipo: "INDIRECTA" },
    { nombre: "Tapas para vasos", unidad: "paquete x100", cantidad: 100.00, precio: 2.00, merma: 1.00, tipo: "INDIRECTA" },
    { nombre: "Servilletas", unidad: "paquete x200", cantidad: 200.00, precio: 2.00, merma: 2.00, tipo: "INDIRECTA" },
    { nombre: "Paletas agitadoras", unidad: "paquete x100", cantidad: 100.00, precio: 1.00, merma: 1.00, tipo: "INDIRECTA" }
];

// Suma los precios separando materia prima directa e indirecta
/**\n * Suma los precios de materia prima directa e indirecta por separado.\n * Utiliza la propiedad `tipo` para separar los valores.\n * @returns {{totalDirecta:number, totalIndirecta:number}} Totales por tipo.\n */
function calcularTotalesMateriaPrima() {
    let totalDirecta = 0;
    let totalIndirecta = 0;
    for (let i = 0; i < materiasPrimas.length; i++) {
        if (materiasPrimas[i].tipo === "DIRECTA") {
            totalDirecta = totalDirecta + materiasPrimas[i].precio;
        } else {
            totalIndirecta = totalIndirecta + materiasPrimas[i].precio;
        }
    }
    return { totalDirecta, totalIndirecta };
}

// Actualiza todos los elementos del DOM que muestran totales de materia prima y merma
/**\n * Actualiza todos los elementos del DOM que muestran totales de materia prima y merma.\n * Calcula el total combinado y también el monto de pérdida por merma.\n * @returns {void}\n */
function sincronizarTotalesMateriaPrima() {
    let totales = calcularTotalesMateriaPrima();
    let mpd = totales.totalDirecta;
    let mpi = totales.totalIndirecta;
    let combinado = mpd + mpi;

    let elMPD = document.getElementById("total_materia_directa");
    let elMPI = document.getElementById("total_materia_indirecta");
    let elMPGeneral = document.getElementById("total_materia_general");
    if (elMPD) elMPD.innerText = convertirMoneda(mpd);
    if (elMPI) elMPI.innerText = convertirMoneda(mpi);
    if (elMPGeneral) elMPGeneral.innerText = convertirMoneda(combinado);

    let elVarMPD = document.getElementById("var_total_mpd");
    let elVarMPI = document.getElementById("var_total_mpi");
    let elVarCombinado = document.getElementById("var_total_mp_combinado");
    let elVarResumenMP = document.getElementById("var_resumen_mp");
    if (elVarMPD) elVarMPD.innerText = convertirMoneda(mpd);
    if (elVarMPI) elVarMPI.innerText = convertirMoneda(mpi);
    if (elVarCombinado) elVarCombinado.innerText = convertirMoneda(combinado);
    if (elVarResumenMP) elVarResumenMP.innerText = convertirMoneda(combinado);

    let elDirectosMPD = document.getElementById("directos_mpd");
    let elDirectosMPI = document.getElementById("directos_mpi");
    if (elDirectosMPD) elDirectosMPD.innerText = convertirMoneda(mpd);
    if (elDirectosMPI) elDirectosMPI.innerText = convertirMoneda(mpi);

    // Calcula el total de pérdida por merma en dinero
    let totalMerma = 0;
    for (let i = 0; i < materiasPrimas.length; i++) {
        totalMerma += materiasPrimas[i].precio * (materiasPrimas[i].merma / 100);
    }
    let elMerma = document.getElementById("total_merma_dinero");
    if (elMerma) elMerma.innerText = convertirMoneda(totalMerma);
}
// Calcula el costo real por unidad de un insumo descontando la merma
/**\n * Calcula el costo neto por unidad utilizable de un insumo descontando la merma.\n * Si la cantidad utilizable es 0 o negativa retorna 0 para evitar división por cero.\n * @param {object} item - Insumo con propiedades `cantidad`, `precio` y `merma`.\n * @returns {number} Costo neto por unidad utilizable.\n */
function obtenerCostoNetoUnitarioInsumo(item) {
    let cantidadUtilizable = item.cantidad * (1 - (item.merma / 100));
    if (cantidadUtilizable > 0) {
        return item.precio / cantidadUtilizable;
    }
    return 0;
}

// Dibuja todas las filas de la tabla de insumos y sincroniza los totales
/**\n * Renderiza la tabla de materia prima y recalcula los totales asociados.\n * Utiliza el costo neto descontando merma para cada insumo.\n * @returns {void}\n */
function actualizarTablaMateria() {
    let tablaBody = document.getElementById("tabla_materia_prima");
    if (!tablaBody) return;

    tablaBody.innerHTML = "";

    materiasPrimas.forEach(function (item, index) {
        let costoNetoUnidad = obtenerCostoNetoUnitarioInsumo(item);
        let claseTipo = item.tipo === "DIRECTA" ? "tipo-directa" : "tipo-indirecta";

        let fila = `
            <tr>
                <td class="col-id">${index + 1}</td>
                <td class="col-nombre">${item.nombre}</td>
                <td class="col-unidad">${item.unidad}</td>
                <td class="col-cantidad">${item.cantidad.toFixed(2)}</td>
                <td class="col-precio">${item.precio.toFixed(2)}</td>
                <td class="col-merma">${item.merma.toFixed(2)}%</td>
                <td class="col-merma">$${(item.cantidad*item.precio*(1-(item.merma/100))).toFixed(2)}</td>

                <td class="col-tipo ${claseTipo}">${item.tipo}</td>
                <td class="col-acciones">
                    <button onclick="cargarMateriaParaEditar(${index})" class="btn-editar-tech">Editar</button>
                </td>
            </tr>
        `;
        tablaBody.innerHTML += fila;
    });

    sincronizarTotalesMateriaPrima();
    if (typeof actualizarPantallaRecetas === "function") {
        actualizarPantallaRecetas();
    }
}

// Inyecta los datos del insumo seleccionado en el formulario para editarlo
/**\n * Carga un insumo de materia prima en el formulario para edición.\n * Ajusta el título y el botón de guardado, y habilita el formulario.\n * @param {number} index - Índice del insumo en `materiasPrimas`.\n * @returns {void}\n */
function cargarMateriaParaEditar(index) {
    let item = materiasPrimas[index];
    mostrarTextoEnCaja("mat_nombre", item.nombre);
    mostrarTextoEnCaja("mat_unidad", item.unidad);
    mostrarTextoEnCaja("mat_cantidad", item.cantidad);
    mostrarTextoEnCaja("mat_precio", item.precio);
    mostrarTextoEnCaja("mat_merma", item.merma);
    document.getElementById("mat_tipo").value = item.tipo;
    document.getElementById("mat_index_editar").value = index;

    document.getElementById("formulario_titulo").innerText = "Modificar Datos del Insumo";
    document.getElementById("btn_guardar_materia").innerText = "Guardar Cambios";
    document.getElementById("btn_guardar_materia").style.background = "#10b981";
    document.getElementById("btn_cancelar_edicion").style.display = "inline-block";
    document.getElementById("formulario_titulo").scrollIntoView({ behavior: 'smooth' });
}

// Valida el formulario y guarda o actualiza el insumo según el modo activo (nuevo o edición)
/**\n * Valida el formulario de materia prima y guarda o actualiza el insumo.\n * Inserta directos después del último directo existente y reordena indirectos.\n * @returns {void}\n */
function procesarFormularioMateria() {
    let nombre = recuperarTexto("mat_nombre");
    let unidad = recuperarTexto("mat_unidad");
    let cantidad = recuperarFloat("mat_cantidad");
    let precio = recuperarFloat("mat_precio");
    let merma = recuperarFloat("mat_merma");
    let tipo = document.getElementById("mat_tipo").value;
    let indexEditar = parseInt(document.getElementById("mat_index_editar").value);

    if (nombre === "" || unidad === "" || isNaN(cantidad) || isNaN(precio) || isNaN(merma)) {
        alert("Por favor, complete todos los campos requeridos.");
        return;
    }

    let datosInsumo = { nombre, unidad, cantidad, precio, merma, tipo };

    if (indexEditar === -1) {
        // Inserta el nuevo insumo directo después del último directo existente
        if (tipo === "DIRECTA") {
            let ultimoIndiceDirecta = -1;
            for (let i = materiasPrimas.length - 1; i >= 0; i--) {
                if (materiasPrimas[i].tipo === "DIRECTA") { ultimoIndiceDirecta = i; break; }
            }
            if (ultimoIndiceDirecta !== -1) {
                materiasPrimas.splice(ultimoIndiceDirecta + 1, 0, datosInsumo);
            } else {
                materiasPrimas.unshift(datosInsumo);
            }
        } else {
            materiasPrimas.push(datosInsumo);
        }
    } else {
        // Actualiza el insumo existente y reordena: directos primero, indirectos al final
        materiasPrimas[indexEditar] = datosInsumo;
        materiasPrimas.sort(function (a, b) {
            if (a.tipo === "DIRECTA" && b.tipo === "INDIRECTA") return -1;
            if (a.tipo === "INDIRECTA" && b.tipo === "DIRECTA") return 1;
            return 0;
        });
        cancelarEdicionMateria();
    }

    limpiarFormularioMateria();
    actualizarTablaMateria();
}

// Restablece el formulario de materia prima al estado de agregar nuevo insumo
/**\n * Restablece el formulario de materia prima al modo de nuevo insumo.\n * Restaura el texto del título y oculta el botón cancelar.\n * @returns {void}\n */
function cancelarEdicionMateria() {
    document.getElementById("mat_index_editar").value = "-1";
    document.getElementById("formulario_titulo").innerText = "Agregar Nuevo Insumo";
    document.getElementById("btn_guardar_materia").innerText = "Guardar Insumo";
    document.getElementById("btn_guardar_materia").style.background = "var(--rosa-marca)";
    document.getElementById("btn_cancelar_edicion").style.display = "none";
    limpiarFormularioMateria();
}

// Vacía todos los campos del formulario de materia prima
/**\n * Limpia todos los campos del formulario de materia prima.\n * @returns {void}\n */
function limpiarFormularioMateria() {
    mostrarTextoEnCaja("mat_nombre", "");
    mostrarTextoEnCaja("mat_unidad", "");
    mostrarTextoEnCaja("mat_cantidad", "");
    mostrarTextoEnCaja("mat_precio", "");
    mostrarTextoEnCaja("mat_merma", "");
}


// ============================================================
// ============================================================
// SECCIÃ“N: MANO DE OBRA
// ============================================================

// Arreglo con los cargos predefinidos del negocio
let cargos = [
    { nombre: "Barista", sueldo: 460.00, tipo: "Directo" },
    { nombre: "Cajero", sueldo: 460.00, tipo: "Directo" },
    { nombre: "Administrador", sueldo: 800.00, tipo: "Indirecto" }
];

// Arreglo principal de empleados con todos sus valores calculados
let listaEmpleados = [
    { nombre: "John", cargo: "Barista", tipo: "Directo", sueldo: 460.00, ingresoTotal: 460.00, iess: 55.89, decimoTercero: 38.33, decimoCuarto: 40.17, vacaciones: 19.17, fondosReserva: 38.32, costoTotal: 651.88 },
    { nombre: "Juan", cargo: "Cajero", tipo: "Directo", sueldo: 460.00, ingresoTotal: 460.00, iess: 55.89, decimoTercero: 38.33, decimoCuarto: 40.17, vacaciones: 19.17, fondosReserva: 38.32, costoTotal: 651.88 },
    { nombre: "Danna", cargo: "Administrador", tipo: "Indirecto", sueldo: 800.00, ingresoTotal: 800.00, iess: 97.20, decimoTercero: 66.67, decimoCuarto: 40.17, vacaciones: 33.33, fondosReserva: 66.64, costoTotal: 1104.01 }
];

// Llena el select de cargos con las opciones del arreglo cargos
/**\n * Llena el select de cargos con opciones definidas en el arreglo `cargos`.\n * Agrega una opción extra para permitir la creación de un cargo nuevo.\n * @returns {void}\n */
function cargarOpcionesCargos() {
    let selectCargo = recuperarElemento("inputCargo");
    selectCargo.innerHTML = "";
    for (let i = 0; i < cargos.length; i++) {
        selectCargo.innerHTML += "<option>" + cargos[i].nombre + "</option>";
    }
    selectCargo.innerHTML += "<option value='__nuevo__'>+ Nuevo cargo...</option>";
}

// Detecta el cargo seleccionado y autocompleta el sueldo y tipo correspondiente
/**\n * Ajusta el formulario de mano de obra según el cargo seleccionado.\n * Muestra el campo para un nuevo cargo o autocompleta sueldo y tipo.\n * @returns {void}\n */
function manejarCargo() {
    let cargoSeleccionado = recuperarTexto("inputCargo");
    let divNuevoCargo = recuperarElemento("divNuevoCargo");
    let inputTipo = recuperarElemento("inputTipo");

    if (cargoSeleccionado === "__nuevo__") {
        divNuevoCargo.style.display = "block";
        mostrarTextoEnCaja("inputSueldo", "");
        mostrarTextoEnCaja("inputTipo", "");
        inputTipo.removeAttribute("readonly");
    } else {
        divNuevoCargo.style.display = "none";
        mostrarTextoEnCaja("inputNuevoCargo", "");
        for (let i = 0; i < cargos.length; i++) {
            if (cargos[i].nombre === cargoSeleccionado) {
                mostrarTextoEnCaja("inputSueldo", cargos[i].sueldo);
                mostrarTextoEnCaja("inputTipo", cargos[i].tipo);
                inputTipo.setAttribute("readonly", true);
            }
        }
    }
}

// Lee el formulario, calcula beneficios de ley y agrega el empleado al arreglo
/**\n * Crea un empleado con su sueldo, horas extras y beneficios de ley.\n * Calcula IESS, décimo tercero, décimo cuarto, vacaciones y fondo de reserva.\n * @returns {void}\n */
function agregarEmpleado() {
    let nombre = recuperarTexto("inputNombre");
    let cargoSelect = recuperarTexto("inputCargo");
    let nuevoCargo = recuperarTexto("inputNuevoCargo").trim();
    let cargo = cargoSelect === "__nuevo__" ? nuevoCargo : cargoSelect;
    let tipo = recuperarTexto("inputTipo").trim();
    let sueldo = recuperarFloatSeguro("inputSueldo");
    let horas50 = recuperarFloatSeguro("inputHoras50");
    let horas100 = recuperarFloatSeguro("inputHoras100");

    if (nombre === "") { alert("Debe ingresar un nombre"); return; }
    if (cargo === "") { alert("Debe ingresar el nombre del nuevo cargo"); return; }
    if (tipo === "") { alert("Debe ingresar el tipo: Directo o Indirecto"); return; }
    if (sueldo === 0) { alert("Ingrese un monto"); return; }

    // Si es un cargo nuevo, lo guarda para usarlo en futuros registros
    if (cargoSelect === "__nuevo__") {
        cargos.push({ nombre: cargo, sueldo: sueldo, tipo: tipo });
        cargarOpcionesCargos();
    }

    let horaNormal = sueldo / 240;
    let totalHorasExtras = (horas50 * horaNormal * 1.5) + (horas100 * horaNormal * 2);
    let ingresoTotal = sueldo + totalHorasExtras;

    let iess = ingresoTotal * 0.1215;
    let decimoTercero = ingresoTotal / 12;
    let decimoCuarto = 40.17;
    let vacaciones = ingresoTotal / 24;
    let fondosReserva = ingresoTotal * 0.0833;
    let costoTotal = ingresoTotal + iess + decimoTercero + decimoCuarto + vacaciones + fondosReserva;

    let nuevoEmpleado = { nombre, cargo, tipo, sueldo, ingresoTotal, iess, decimoTercero, decimoCuarto, vacaciones, fondosReserva, costoTotal };
    listaEmpleados.push(nuevoEmpleado);
    mostrarTabla();
}

// Elimina al empleado en la posición indicada usando splice
/**\n * Elimina un empleado de `listaEmpleados` según su índice.\n * @param {number} indice - Posición del empleado a eliminar.\n * @returns {void}\n */
function eliminarEmpleado(indice) {
    listaEmpleados.splice(indice, 1);
    mostrarTabla();
}

// Recorre listaEmpleados y construye las filas HTML de la tabla de mano de obra
/**\n * Construye la tabla de mano de obra en el DOM a partir de `listaEmpleados`.\n * Itera la lista y formatea los valores monetarios con `convertirMoneda`.\n * @returns {void}\n */
function mostrarTabla() {
    let cuerpo = recuperarElemento("tablaEmpleados");
    if (!cuerpo) return;

    cuerpo.innerHTML = "";

    for (let i = 0; i < listaEmpleados.length; i++) {
        let e = listaEmpleados[i];

        cuerpo.innerHTML += `
            <tr class="fila-tabla">
                <td class="td-num">${i + 1}</td>
                <td class="td-nombre">${e.nombre}</td>
                <td class="td-cargo">${e.cargo}</td>
                <td class="td-celeste">${e.tipo}</td>
                <td class="td-celeste">${convertirMoneda(e.sueldo)}</td>
                <td class="td-celeste">${convertirMoneda(e.ingresoTotal)}</td>
                <td class="td-rosa">${convertirMoneda(e.iess)}</td>
                <td class="td-rosa">${convertirMoneda(e.decimoTercero)}</td>
                <td class="td-rosa">${convertirMoneda(e.decimoCuarto)}</td>
                <td class="td-rosa">${convertirMoneda(e.vacaciones)}</td>
                <td class="td-rosa">${convertirMoneda(e.fondosReserva)}</td>
                <td class="td-verde">${convertirMoneda(e.costoTotal)}</td>
                <td class="text-center">
                    <button class="btn-eliminar-tabla" onclick="eliminarEmpleado(${i})">Eliminar</button>
                </td>
            </tr>`;
    }
}


// ============================================================
// SECCIÃ“N: RECETAS Y COSTOS
// ============================================================

// Arreglo con las recetas base del menú, cada una con sus ingredientes e insumos
let recetasBase = [
    {
        idReceta: 0,
        nombreReceta: "ESPRESSO",
        tiempoPreparacion: 3,
        numeroPorciones: 1,
        ingredientes: [
            { buscarNombre: "Café molido espresso", cantidadReceta: 7.00, unidadReceta: "gramos", esConversion: true },
            { buscarNombre: "Agua purificada", cantidadReceta: 30.00, unidadReceta: "ml", esConversion: true },
            { buscarNombre: "Vasos desechables 6 oz", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Tapas para vasos", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Paletas agitadoras", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Servilletas", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false }
        ]
    },
    {
        idReceta: 1,
        nombreReceta: "CAFÃ‰ AMERICANO",
        tiempoPreparacion: 4,
        numeroPorciones: 1,
        ingredientes: [
            { buscarNombre: "Café molido espresso", cantidadReceta: 7.00, unidadReceta: "gramos", esConversion: true },
            { buscarNombre: "Agua purificada", cantidadReceta: 150.00, unidadReceta: "ml", esConversion: true },
            { buscarNombre: "Vasos desechables 6 oz", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Tapas para vasos", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Paletas agitadoras", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Servilletas", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false }
        ]
    },
    {
        idReceta: 2,
        nombreReceta: "CAFÃ‰ CON LECHE",
        tiempoPreparacion: 5,
        numeroPorciones: 1,
        ingredientes: [
            { buscarNombre: "Café molido espresso", cantidadReceta: 7.00, unidadReceta: "gramos", esConversion: true },
            { buscarNombre: "Leche entera", cantidadReceta: 150.00, unidadReceta: "ml", esConversion: true },
            { buscarNombre: "Azúcar blanca", cantidadReceta: 10.00, unidadReceta: "gramos", esConversion: true },
            { buscarNombre: "Vasos desechables 6 oz", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Tapas para vasos", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Paletas agitadoras", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Servilletas", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false }
        ]
    },
    {
        idReceta: 3,
        nombreReceta: "CAPPUCCINO",
        tiempoPreparacion: 6,
        numeroPorciones: 1,
        ingredientes: [
            { buscarNombre: "Café molido espresso", cantidadReceta: 7.00, unidadReceta: "gramos", esConversion: true },
            { buscarNombre: "Leche entera", cantidadReceta: 120.00, unidadReceta: "ml", esConversion: true },
            { buscarNombre: "Crema de leche", cantidadReceta: 30.00, unidadReceta: "ml", esConversion: true },
            { buscarNombre: "Azúcar blanca", cantidadReceta: 10.00, unidadReceta: "gramos", esConversion: true },
            { buscarNombre: "Chocolate en polvo / cacao", cantidadReceta: 2.00, unidadReceta: "gramos", esConversion: true },
            { buscarNombre: "Vasos desechables 6 oz", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Tapas para vasos", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Paletas agitadoras", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Servilletas", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false }
        ]
    },
    {
        idReceta: 4,
        nombreReceta: "MOCACHINO",
        tiempoPreparacion: 7,
        numeroPorciones: 1,
        ingredientes: [
            { buscarNombre: "Café molido espresso", cantidadReceta: 7.00, unidadReceta: "gramos", esConversion: true },
            { buscarNombre: "Leche entera", cantidadReceta: 120.00, unidadReceta: "ml", esConversion: true },
            { buscarNombre: "Sirope de chocolate", cantidadReceta: 20.00, unidadReceta: "ml", esConversion: true },
            { buscarNombre: "Crema de leche", cantidadReceta: 30.00, unidadReceta: "ml", esConversion: true },
            { buscarNombre: "Azúcar blanca", cantidadReceta: 10.00, unidadReceta: "gramos", esConversion: true },
            { buscarNombre: "Vasos desechables 6 oz", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Tapas para vasos", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Paletas agitadoras", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Servilletas", cantidadReceta: 1.00, unidadReceta: "unidad", esConversion: false }
        ]
    }
];

// Registro de qué recetas están en modo edición (por índice)
let recetasEnModoEdicion = {};

/**\n * Calcula el costo total de los ingredientes de una receta.\n * Busca cada insumo en `materiasPrimas`, obtiene su costo neto y aplica conversión si es necesario.\n * @param {object} receta - Objeto de receta con arreglo `ingredientes`.\n * @returns {number} Costo total de materia prima de la receta.\n */

function calcularCostoIngredientesReceta(receta) {
    let totalMateriaPrimaReceta = 0;
    receta.ingredientes.forEach(function (ingrediente) {
        let insumoEncontrado = materiasPrimas.find(function (m) {
            return m.nombre.toLowerCase().trim() === ingrediente.buscarNombre.toLowerCase().trim();
        });
        if (insumoEncontrado) {
            let costoNetoInsumoCompleto = obtenerCostoNetoUnitarioInsumo(insumoEncontrado);
            let costoUnitarioCalculado = 0;
            if (ingrediente.esConversion) {
                costoUnitarioCalculado = costoNetoInsumoCompleto / 1000;
            } else {
                costoUnitarioCalculado = costoNetoInsumoCompleto / insumoEncontrado.cantidad;
            }
            totalMateriaPrimaReceta += costoUnitarioCalculado * ingrediente.cantidadReceta;
        }
    });
    return totalMateriaPrimaReceta;
}

/**\n * Calcula el costo de mano de obra directo por minuto.\n * Suma `costoTotal` de empleados directos y divide por minutos laborales mensuales.\n * @returns {number} Costo de mano de obra por minuto.\n */

function obtenerCostoManoObraPorMinuto() {
    let totalCostoDirecto = 0;
    for (let i = 0; i < listaEmpleados.length; i++) {
        if (listaEmpleados[i].tipo === "Directo") {
            totalCostoDirecto += listaEmpleados[i].costoTotal;
        }
    }
    let minutosLaboralesMes = 240 * 60;
    return totalCostoDirecto / minutosLaboralesMes;
}

/**\n * Calcula el costo de mano de obra para una receta específica.\n * Multiplica el costo por minuto por el tiempo de preparación de la receta.\n * @param {object} receta - Objeto de receta con `tiempoPreparacion`.\n * @returns {number} Costo de mano de obra de la receta.\n */

function calcularCostoManoObraReceta(receta) {
    let costoPorMinuto = obtenerCostoManoObraPorMinuto();
    return costoPorMinuto * receta.tiempoPreparacion;
}

// Activa o desactiva el modo edición de una receta y redibuja
/**\n * Alterna el modo de edición para una receta en pantalla.\n * Activa o desactiva el estado de edición y vuelve a renderizar la vista.\n * @param {number} rIndex - Índice de la receta en `recetasBase`.\n * @returns {void}\n */
function toggleModoEdicionReceta(rIndex) {
    if (recetasEnModoEdicion[rIndex]) {
        delete recetasEnModoEdicion[rIndex];
    } else {
        recetasEnModoEdicion[rIndex] = true;
    }
    actualizarPantallaRecetas();
}

// Guarda todos los cambios editados en la tabla de una receta y sale del modo edición
/**\n * Guarda los cambios de edición masiva de una receta.\n * Actualiza tiempo, porciones y cada ingrediente editado antes de recargar la vista.\n * @param {number} rIndex - Índice de la receta editada.\n * @returns {void}\n */
function guardarCambiosMasivosReceta(rIndex) {
    let receta = recetasBase[rIndex];

    // Guardar tiempo y porciones del encabezado
    let inputTiempo = document.getElementById("edit_tiempo_" + rIndex);
    let inputPorciones = document.getElementById("edit_porciones_" + rIndex);

    if (inputTiempo) {
        let nuevoTiempo = parseInt(inputTiempo.value);
        if (!isNaN(nuevoTiempo) && nuevoTiempo > 0) receta.tiempoPreparacion = nuevoTiempo;
    }
    if (inputPorciones) {
        let nuevasPorciones = parseInt(inputPorciones.value);
        if (!isNaN(nuevasPorciones) && nuevasPorciones > 0) receta.numeroPorciones = nuevasPorciones;
    }

    // Guardar cantidad y unidad de cada ingrediente
    receta.ingredientes.forEach(function (ingrediente, iIndex) {
        let inputCantidad = document.getElementById("edit_cantidad_" + rIndex + "_" + iIndex);
        let inputUnidad = document.getElementById("edit_unidad_" + rIndex + "_" + iIndex);

        if (inputCantidad) {
            let nuevaCantidad = parseFloat(inputCantidad.value);
            if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) ingrediente.cantidadReceta = nuevaCantidad;
        }
        if (inputUnidad) {
            let nuevaUnidad = inputUnidad.value.trim();
            if (nuevaUnidad !== "") ingrediente.unidadReceta = nuevaUnidad;
        }
    });

    delete recetasEnModoEdicion[rIndex];
    actualizarPantallaRecetas();
}

/**\n * Renderiza todas las recetas dinámicamente en el DOM.\n * Muestra inputs e información de costos dependiendo del modo edición.\n * @returns {void}\n */

function actualizarPantallaRecetas() {
    let contenedor = document.getElementById("contenedor_recetas_dinamicas");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    recetasBase.forEach(function (receta, rIndex) {
        let enEdicion = !!recetasEnModoEdicion[rIndex];

        // Cabecera: tiempo y porciones â€” texto o input según modo
        let campoCabecera = enEdicion
            ? `<strong>Tiempo prep.:</strong> 
               <input type="number" id="edit_tiempo_${rIndex}" value="${receta.tiempoPreparacion}" class="campo-control input-50 input-center"> min 
               &nbsp;|&nbsp; <strong>Porciones:</strong> 
               <input type="number" id="edit_porciones_${rIndex}" value="${receta.numeroPorciones}" class="campo-control input-45 input-center">`
            : `<strong>Tiempo prep.:</strong> ${receta.tiempoPreparacion} min | <strong>Porciones (Tazas):</strong> ${receta.numeroPorciones}`;

        let tablaHTML = `
            <div class="receta-card">
                <div class="receta-card-header">
                    <h3 class="receta-card-title">${receta.nombreReceta}</h3>
                    <div class="receta-card-badge">
                        ${campoCabecera}
                    </div>
                </div>
                <table class="tabla-receta">
                    <thead>
                        <tr>
                            <th class="th-num">#</th>
                            <th>Ingrediente / Insumo Base</th>
                            <th class="text-center">Cantidad</th>
                            <th>Unidad</th>
                            <th class="text-right">Costo/Ud ($)</th>
                            <th class="text-right">Subtotal ($)</th>
                            ${enEdicion ? `<th class="text-center">Quitar</th>` : ""}
                        </tr>
                    </thead>
                    <tbody>
        `;

        receta.ingredientes.forEach(function (ingrediente, iIndex) {
            let insumoEncontrado = materiasPrimas.find(function (m) {
                return m.nombre.toLowerCase().trim() === ingrediente.buscarNombre.toLowerCase().trim();
            });
            let costoUnitarioCalculado = 0;
            let subtotalCalculado = 0;

            if (insumoEncontrado) {
                let costoNetoInsumoCompleto = obtenerCostoNetoUnitarioInsumo(insumoEncontrado);
                if (ingrediente.esConversion) {
                    costoUnitarioCalculado = costoNetoInsumoCompleto / 1000;
                } else {
                    costoUnitarioCalculado = costoNetoInsumoCompleto / insumoEncontrado.cantidad;
                }
                subtotalCalculado = costoUnitarioCalculado * ingrediente.cantidadReceta;
            }

            // Celdas de cantidad y unidad: inputs en edición, texto en vista normal
            let celdaCantidad = enEdicion
                ? `<input type="number" step="0.01" id="edit_cantidad_${rIndex}_${iIndex}" value="${ingrediente.cantidadReceta}" class="campo-control input-80 input-center input-bold">`
                : `${ingrediente.cantidadReceta.toFixed(2)}`;

            let celdaUnidad = enEdicion
                ? `<input type="text" id="edit_unidad_${rIndex}_${iIndex}" value="${ingrediente.unidadReceta}" class="campo-control input-90 input-italic">`
                : `${ingrediente.unidadReceta}`;

            let celdaEliminar = enEdicion
                ? `<td class="text-center">
                       <button onclick="eliminarIngredienteDeReceta(${rIndex}, ${iIndex})" 
                               title="Quitar ingrediente" class="btn-eliminar-receta">âœ•</button>
                   </td>`
                : "";

            tablaHTML += `
                <tr>
                    <td class="td-muted text-center">${iIndex + 1}</td>
                    <td class="td-strong">${ingrediente.buscarNombre}</td>
                    <td class="td-highlight text-center">${celdaCantidad}</td>
                    <td class="td-muted text-right">${celdaUnidad}</td>
                    <td class="td-muted text-right">$${costoUnitarioCalculado.toFixed(4)}</td>
                    <td class="td-strong text-right">$${subtotalCalculado.toFixed(4)}</td>
                    ${celdaEliminar}
                </tr>
            `;
        });

        let totalMateriaPrimaReceta = calcularCostoIngredientesReceta(receta);
        let costoManoObraReceta = calcularCostoManoObraReceta(receta);
        let costoTotalProduccionReceta = totalMateriaPrimaReceta + costoManoObraReceta;

        // Colspan dinámico: 7 columnas en edición, 6 en vista normal
        let colspanTotales = enEdicion ? 6 : 5;

        tablaHTML += `
                    </tbody>
                    <tfoot>
                        <tr class="row-total-receta">
                            <td colspan="${colspanTotales}" class="td-footer-label">Total Costo Ingredientes:</td>
                            <td class="td-footer-value">$${totalMateriaPrimaReceta.toFixed(4)}</td>
                        </tr>
                        <tr class="row-mano-obra">
                            <td colspan="${colspanTotales}" class="td-footer-label">Costo Mano de Obra (${receta.tiempoPreparacion} min):</td>
                            <td class="td-footer-value">$${costoManoObraReceta.toFixed(4)}</td>
                        </tr>
                        <tr class="row-total-produccion">
                            <td colspan="${colspanTotales}" class="td-footer-label">Costo Total de Producción:</td>
                            <td class="td-footer-value">$${costoTotalProduccionReceta.toFixed(4)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div class="acciones-receta">
                    ${enEdicion
                        ? `<button onclick="guardarCambiosMasivosReceta(${rIndex})" class="btn-receta btn-receta-primary">
                               ðŸ’¾ Guardar Cambios
                           </button>
                           <button onclick="toggleModoEdicionReceta(${rIndex})" class="btn-receta btn-receta-danger">
                               âœ• Cancelar
                           </button>`
                        : `<button onclick="toggleModoEdicionReceta(${rIndex})" class="btn-receta btn-receta-outline">
                               âœï¸ Editar Lista
                           </button>`
                    }
                    <button onclick="mostrarFormAgregarIngrediente(${rIndex})" class="btn-dashed">
                        + Agregar Ingrediente a esta receta
                    </button>
                </div>

                <div id="form_agregar_ing_${rIndex}" class="form-agregar-ing hidden">
                    <div class="grid-formulario">
                        <div>
                            <label class="form-label">Insumo:</label>
                            <select id="nuevo_ing_nombre_${rIndex}" class="campo-control">
                                ${generarOpcionesInsumosHTML()}
                            </select>
                        </div>
                        <div>
                            <label class="form-label">Cantidad en la receta:</label>
                            <input type="number" step="0.01" id="nuevo_ing_cantidad_${rIndex}" placeholder="Ej: 15" class="campo-control">
                        </div>
                        <div>
                            <label class="form-label">Unidad en la receta:</label>
                            <input type="text" id="nuevo_ing_unidad_${rIndex}" placeholder="gramos, ml, unidad" class="campo-control">
                        </div>
                        <div>
                            <label class="form-label">Â¿Requiere conversión?</label>
                            <select id="nuevo_ing_conversion_${rIndex}" class="campo-control">
                                <option value="true">Sí (insumo en kg o litros)</option>
                                <option value="false">No (insumo por unidad)</option>
                            </select>
                        </div>
                    </div>
                    <div class="botonera-formulario mt-1">
                        <button onclick="ocultarFormAgregarIngrediente(${rIndex})" class="btn-formulario cancelar">Cancelar</button>
                        <button onclick="confirmarAgregarIngrediente(${rIndex})" class="btn-formulario guardar">Agregar a la Receta</button>
                    </div>
                </div>
            </div>
        `;

        contenedor.innerHTML += tablaHTML;
    });
}

// â”€â”€ Helpers del formulario de agregar ingrediente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**\n * Genera el HTML de opciones para el select de insumos disponibles.\n * Recorre `materiasPrimas` y construye un listado de `<option>`.\n * @returns {string} HTML para usar dentro de un elemento <select>.\n */

function generarOpcionesInsumosHTML() {
    if (typeof materiasPrimas === "undefined" || materiasPrimas.length === 0) {
        return `<option value="">-- No hay insumos registrados --</option>`;
    }
    let opciones = `<option value="">-- Selecciona un insumo --</option>`;
    materiasPrimas.forEach(function (insumo) {
        opciones += `<option value="${insumo.nombre}">${insumo.nombre}</option>`;
    });
    return opciones;
}

/**\n * Muestra el formulario para agregar un nuevo ingrediente a una receta.\n * @param {number} rIndex - Índice de receta a la que se agrega el ingrediente.\n * @returns {void}\n */

function mostrarFormAgregarIngrediente(rIndex) {
    let formulario = document.getElementById("form_agregar_ing_" + rIndex);
    if (formulario) formulario.style.display = "block";
}

/**\n * Oculta el formulario de nuevo ingrediente para una receta.\n * @param {number} rIndex - Índice de la receta correspondiente.\n * @returns {void}\n */

function ocultarFormAgregarIngrediente(rIndex) {
    let formulario = document.getElementById("form_agregar_ing_" + rIndex);
    if (formulario) formulario.style.display = "none";
}

/**\n * Valida y agrega un nuevo ingrediente a la receta seleccionada.\n * Inserta un objeto con `buscarNombre`, cantidad, unidad y conversión.\n * @param {number} rIndex - Índice de la receta destino.\n * @returns {void}\n */

function confirmarAgregarIngrediente(rIndex) {
    let nombreInsumo = recuperarTexto("nuevo_ing_nombre_" + rIndex);
    let cantidad = recuperarFloat("nuevo_ing_cantidad_" + rIndex);
    let unidad = recuperarTexto("nuevo_ing_unidad_" + rIndex);
    let esConversionTexto = recuperarTexto("nuevo_ing_conversion_" + rIndex);

    if (nombreInsumo === "" || isNaN(cantidad) || cantidad <= 0 || unidad === "") {
        alert("Por favor, selecciona el insumo y completa la cantidad y la unidad correctamente.");
        return;
    }

    recetasBase[rIndex].ingredientes.push({
        buscarNombre: nombreInsumo,
        cantidadReceta: cantidad,
        unidadReceta: unidad,
        esConversion: esConversionTexto === "true"
    });

    actualizarPantallaRecetas();
}

/**\n * Elimina un ingrediente de una receta tras confirmar la acción.\n * @param {number} rIndex - Índice de la receta.\n * @param {number} iIndex - Índice del ingrediente dentro de la receta.\n * @returns {void}\n */

function eliminarIngredienteDeReceta(rIndex, iIndex) {
    let receta = recetasBase[rIndex];
    let nombreIngrediente = receta.ingredientes[iIndex].buscarNombre;
    let confirmado = confirm("Â¿Seguro que deseas quitar \"" + nombreIngrediente + "\" de la receta \"" + receta.nombreReceta + "\"?");
    if (!confirmado) return;
    receta.ingredientes.splice(iIndex, 1);
    actualizarPantallaRecetas();
}

// â”€â”€ Crear receta nueva desde cero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**\n * Muestra el formulario para crear una receta desde cero.\n * Inicializa una fila de ingrediente vacía y hace scroll al formulario.\n * @returns {void}\n */

function mostrarFormularioNuevaReceta() {
    let formulario = document.getElementById("formulario_nueva_receta");
    if (!formulario) return;
    formulario.style.display = "block";
    document.getElementById("contenedor_filas_nueva_receta").innerHTML = "";
    agregarFilaIngredienteNuevaReceta();
    formulario.scrollIntoView({ behavior: "smooth" });
}

/**\n * Cancela la creación de una receta nueva y limpia el formulario.\n * @returns {void}\n */

function cancelarNuevaReceta() {
    mostrarTextoEnCaja("nueva_receta_nombre", "");
    mostrarTextoEnCaja("nueva_receta_tiempo", "");
    mostrarTextoEnCaja("nueva_receta_porciones", "");
    document.getElementById("contenedor_filas_nueva_receta").innerHTML = "";
    document.getElementById("formulario_nueva_receta").style.display = "none";
}

/**\n * Agrega una nueva fila al formulario de creación de receta.\n * Inserta campos para seleccionar insumo, cantidad, unidad y conversión.\n * @returns {void}\n */

function agregarFilaIngredienteNuevaReceta() {
    let contenedorFilas = document.getElementById("contenedor_filas_nueva_receta");
    if (!contenedorFilas) return;
    let filaHTML = `
        <div class="fila-ingrediente-nueva-receta">
            <div>
                <label class="form-label-small">Insumo:</label>
                <select class="campo-control fila-ing-select">${generarOpcionesInsumosHTML()}</select>
            </div>
            <div>
                <label class="form-label-small">Cantidad:</label>
                <input type="number" step="0.01" class="campo-control fila-ing-cantidad" placeholder="Ej: 10">
            </div>
            <div>
                <label class="form-label-small">Unidad:</label>
                <input type="text" class="campo-control fila-ing-unidad" placeholder="gramos, ml, unidad">
            </div>
            <div>
                <label class="form-label-small">Â¿Conversión?</label>
                <select class="campo-control fila-ing-conversion">
                    <option value="true">Sí (kg/L â†’ g/ml)</option>
                    <option value="false">No (unidad directa)</option>
                </select>
            </div>
            <button onclick="eliminarFilaIngredienteNuevaReceta(this)" title="Quitar esta fila" class="btn-eliminar-receta">âœ•</button>
        </div>
    `;
    contenedorFilas.insertAdjacentHTML("beforeend", filaHTML);
}

/**\n * Elimina una fila de ingrediente del formulario de nueva receta.\n * Evita eliminar la última fila para mantener al menos un ingrediente.\n * @param {HTMLElement} boton - Botón que dispara la eliminación.\n * @returns {void}\n */

function eliminarFilaIngredienteNuevaReceta(boton) {
    let contenedorFilas = document.getElementById("contenedor_filas_nueva_receta");
    let totalFilas = contenedorFilas.querySelectorAll(".fila-ingrediente-nueva-receta").length;
    if (totalFilas <= 1) {
        alert("La receta debe tener al menos un ingrediente.");
        return;
    }
    boton.closest(".fila-ingrediente-nueva-receta").remove();
}

/**\n * Valida y guarda una nueva receta creada desde cero.\n * Construye el objeto de receta con sus ingredientes y lo agrega a `recetasBase`.\n * @returns {void}\n */

function guardarNuevaRecetaDesdeCero() {
    let nombre = recuperarTexto("nueva_receta_nombre").trim();
    let tiempo = recuperarInt("nueva_receta_tiempo");
    let porciones = recuperarInt("nueva_receta_porciones");

    if (nombre === "" || isNaN(tiempo) || tiempo <= 0 || isNaN(porciones) || porciones <= 0) {
        alert("Por favor, completa el nombre, el tiempo de preparación y el número de porciones correctamente.");
        return;
    }

    let filas = document.querySelectorAll("#contenedor_filas_nueva_receta .fila-ingrediente-nueva-receta");
    let nuevosIngredientes = [];

    for (let i = 0; i < filas.length; i++) {
        let fila = filas[i];
        let nombreInsumo = fila.querySelector(".fila-ing-select").value;
        let cantidad = parseFloat(fila.querySelector(".fila-ing-cantidad").value);
        let unidad = fila.querySelector(".fila-ing-unidad").value.trim();
        let esConversion = fila.querySelector(".fila-ing-conversion").value === "true";

        if (nombreInsumo === "" || isNaN(cantidad) || cantidad <= 0 || unidad === "") {
            alert("Revisa la fila de ingrediente #" + (i + 1) + ": selecciona el insumo y completa cantidad y unidad.");
            return;
        }
        nuevosIngredientes.push({ buscarNombre: nombreInsumo, cantidadReceta: cantidad, unidadReceta: unidad, esConversion: esConversion });
    }

    if (nuevosIngredientes.length === 0) {
        alert("Agrega al menos un ingrediente a la receta.");
        return;
    }

    let nuevoId = recetasBase.length > 0
        ? Math.max(...recetasBase.map(function (r) { return r.idReceta; })) + 1
        : 0;

    recetasBase.push({
        idReceta: nuevoId,
        nombreReceta: nombre.toUpperCase(),
        tiempoPreparacion: tiempo,
        numeroPorciones: porciones,
        ingredientes: nuevosIngredientes
    });

    cancelarNuevaReceta();
    actualizarPantallaRecetas();
}

// ============================================================
// SECCIÃ“N: GANANCIAS
// ============================================================

// Arreglo donde se almacenan los escenarios de ganancia creados por el usuario
let escenariosganancias = [];

// Sincroniza los sueldos de personal y retorna la suma total de todos los costos fijos
/**\n * Actualiza los costos fijos de personal y devuelve el total mensual.\n * Sincroniza los valores automáticos de barista, cajera y administrador.\n * @returns {number} Total mensual de costos fijos.\n */
function obtenerTotalCostosFijosActual() {
    let total = 0;
    for (let i = 0; i < costosFijos.length; i++) {
        if (costosFijos[i].inputId === "fijo_barista") {
            costosFijos[i].montoMensual = obtenerCostoTotalPorCargo("Barista");
        } else if (costosFijos[i].inputId === "fijo_cajera") {
            costosFijos[i].montoMensual = obtenerCostoTotalPorCargo("Cajero");
        } else if (costosFijos[i].inputId === "fijo_admin") {
            costosFijos[i].montoMensual = obtenerCostoTotalPorCargo("Administrador");
        }
        total += costosFijos[i].montoMensual;
    }
    return total;
}

// Sincroniza los rubros automáticos y retorna la suma total de todos los costos variables
/**\n * Actualiza los rubros variables basados en materia prima y devuelve el total.\n * Calcula materia prima directa, indirecta y merma en dinero.\n * @returns {number} Total mensual de costos variables.\n */
function obtenerTotalCostosVariablesActual() {
    let totalesMP = calcularTotalesMateriaPrima();
    let totalMerma = 0;
    for (let i = 0; i < materiasPrimas.length; i++) {
        totalMerma += materiasPrimas[i].precio * (materiasPrimas[i].merma / 100);
    }
    costosVariables[0].monto = totalesMP.totalDirecta;
    costosVariables[1].monto = totalesMP.totalIndirecta;
    costosVariables[2].monto = totalMerma;

    let total = 0;
    for (let i = 0; i < costosVariables.length; i++) {
        total += costosVariables[i].monto;
    }
    return total;
}

// Calcula el precio sugerido de venta a partir de un costo de producción y un margen deseado (%)
/**\n * Calcula el precio de venta sugerido según costo de producción y margen.\n * Aplica la fórmula `precio = costo / (1 - margen/100)`.\n * @param {number} costoProduccion - Costo de producción total.\n * @param {number} margenPorcentaje - Margen deseado en porcentaje.\n * @returns {number} Precio sugerido o 0 si el margen no es válido.\n */
function calcularPrecioSugerido(costoProduccion, margenPorcentaje) {
    if (margenPorcentaje >= 100 || margenPorcentaje < 0) return 0;
    return costoProduccion / (1 - (margenPorcentaje / 100));
}

// Guarda el % de margen elegido para cada receta (clave: idReceta), para que no se pierda al repintar la tabla.
// Empieza en 30% por defecto para toda receta que aún no tenga un margen guardado.
let margenesPorReceta = {};

// Devuelve el % de margen guardado para una receta, o 30% si todavía no se ha definido uno
/**\n * Devuelve el margen guardado para una receta o 30% por defecto.\n * @param {number} idReceta - Identificador de la receta.\n * @returns {number} Margen almacenado o valor por defecto.\n */
function obtenerMargenGuardado(idReceta) {
    if (margenesPorReceta.hasOwnProperty(idReceta)) {
        return margenesPorReceta[idReceta];
    }
    return 30;
}

// Se llama al editar el input de % Margen de una fila de la tabla: guarda el nuevo valor y recalcula esa fila
/**\n * Actualiza el margen de una receta y recalcula su precio sugerido.\n * Guarda el valor ingresado y vuelve a renderizar el precio en la tabla.\n * @param {number} idReceta - Identificador de la receta.\n * @returns {void}\n */
function actualizarMargenRecetaEnTabla(idReceta) {
    let inputMargen = document.getElementById("margen_receta_" + idReceta);
    let margenIngresado = recuperarFloatSeguro("margen_receta_" + idReceta);
    margenesPorReceta[idReceta] = margenIngresado;

    let receta = recetasBase.find(function (r) { return r.idReceta === idReceta; });
    if (!receta) return;

    let costoIngredientes = calcularCostoIngredientesReceta(receta);
    let costoManoObra = calcularCostoManoObraReceta(receta);
    let costoProduccion = costoIngredientes + costoManoObra;
    let precioSugerido = calcularPrecioSugerido(costoProduccion, margenIngresado);

    let elPrecio = document.getElementById("precio_sugerido_" + idReceta);
    if (elPrecio) elPrecio.innerText = convertirMoneda(precioSugerido);
}

// Dibuja la tabla de precio sugerido con una fila automática por cada receta de recetasBase
/**\n * Renderiza la tabla con el precio sugerido de cada receta.\n * Para cada receta calcula costo de ingredientes, mano de obra y margen.\n * @returns {void}\n */
function renderizarTablaPrecioSugerido() {
    let cuerpo = document.getElementById("tabla_precio_sugerido_recetas");
    if (!cuerpo) return;

    cuerpo.innerHTML = "";

    if (recetasBase.length === 0) {
        cuerpo.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-gris table-empty-cell">
                    Aún no hay recetas registradas en "Recetas y Costos".
                </td>
            </tr>`;
        return;
    }

    recetasBase.forEach(function (receta) {
        let costoIngredientes = calcularCostoIngredientesReceta(receta);
        let costoManoObra = calcularCostoManoObraReceta(receta);
        let costoProduccion = costoIngredientes + costoManoObra;
        let margenActual = obtenerMargenGuardado(receta.idReceta);
        let precioSugerido = calcularPrecioSugerido(costoProduccion, margenActual);

        cuerpo.innerHTML += `
            <tr>
                <td class="text-gris text-center">${receta.idReceta + 1}</td>
                <td class="text-blanco font-semibold">${receta.nombreReceta}</td>
                <td class="text-center text-gris">${convertirMoneda(costoIngredientes)}</td>
                <td class="text-center text-gris">${convertirMoneda(costoManoObra)}</td>
                <td class="text-center font-semibold text-success">${convertirMoneda(costoProduccion)}</td>
                <td class="text-center">
                    <input type="number" step="0.01" id="margen_receta_${receta.idReceta}" value="${margenActual}"
                        class="campo-control input-small-center"
                        oninput="actualizarMargenRecetaEnTabla(${receta.idReceta})">
                    %
                </td>
                <td id="precio_sugerido_${receta.idReceta}" class="text-center font-bold text-rosa">${convertirMoneda(precioSugerido)}</td>
            </tr>`;
    });
}

// Actualiza las tarjetas de resumen de costos y recarga las tablas de la sección Ganancias
/**\n * Actualiza las tarjetas de costos de la sección Ganancias y recarga tablas.\n * Obtiene totales fijos y variables, y renderiza precios sugeridos y escenarios.\n * @returns {void}\n */
function actualizarSeccionGanancias() {
    let totalFijos = obtenerTotalCostosFijosActual();
    let totalVariables = obtenerTotalCostosVariablesActual();
    let totalGeneral = totalFijos + totalVariables;

    let elF = document.getElementById("gan_total_fijos");
    let elV = document.getElementById("gan_total_variables");
    let elT = document.getElementById("gan_total_costos");
    if (elF) elF.innerText = convertirMoneda(totalFijos);
    if (elV) elV.innerText = convertirMoneda(totalVariables);
    if (elT) elT.innerText = convertirMoneda(totalGeneral);

    renderizarTablaPrecioSugerido();
    renderizarTablaEscenarios();
}

// Calcula en tiempo real los indicadores del escenario mientras el usuario escribe
/**\n * Calcula indicadores de ganancias en tiempo real mientras el usuario escribe.\n * Determina ingresos, ganancia bruta, ganancia neta y margen porcentual.\n * @returns {void}\n */
function previsualizarGanancia() {
    let precio = recuperarFloatSeguro("gan_precio");
    let tazas = recuperarFloatSeguro("gan_tazas");
    let preview = document.getElementById("gan_preview");

    if (precio <= 0 || tazas <= 0) {
        if (preview) preview.style.display = "none";
        return;
    }

    let totalFijos = obtenerTotalCostosFijosActual();
    let totalVariables = obtenerTotalCostosVariablesActual();
    let totalCostos = totalFijos + totalVariables;
    let ingresos = precio * tazas;
    let gananciaBruta = ingresos - totalVariables;
    let gananciaNeta = ingresos - totalCostos;
    let margen = ingresos > 0 ? (gananciaNeta / ingresos) * 100 : 0;

    if (preview) preview.style.display = "block";

    let colorNeta = gananciaNeta >= 0 ? "#10b981" : "var(--rosa-marca)";

    let elI = document.getElementById("prev_ingresos");
    let elB = document.getElementById("prev_bruta");
    let elN = document.getElementById("prev_neta");
    let elM = document.getElementById("prev_margen");

    if (elI) elI.innerText = convertirMoneda(ingresos);
    if (elB) elB.innerText = convertirMoneda(gananciaBruta);
    if (elN) { elN.innerText = convertirMoneda(gananciaNeta); elN.style.color = colorNeta; }
    if (elM) elM.innerText = margen.toFixed(2) + "%";
}

// Valida el formulario, calcula los indicadores y guarda el escenario en el arreglo
/**\n * Guarda un escenario de ganancia con los valores calculados actuales.\n * Calcula ingresos, ganancia bruta, neta y margen antes de almacenar el escenario.\n * @returns {void}\n */
function guardarEscenarioGanancia() {
    let nombre = recuperarTexto("gan_nombre").trim();
    let precio = recuperarFloatSeguro("gan_precio");
    let tazas = recuperarFloatSeguro("gan_tazas");

    if (nombre === "") { alert("Por favor ingresa un nombre para el escenario."); return; }
    if (precio <= 0) { alert("Por favor ingresa un precio de venta válido."); return; }
    if (tazas <= 0) { alert("Por favor ingresa la cantidad de tazas vendidas."); return; }

    let totalFijos = obtenerTotalCostosFijosActual();
    let totalVariables = obtenerTotalCostosVariablesActual();
    let totalCostos = totalFijos + totalVariables;
    let ingresos = precio * tazas;
    let gananciaBruta = ingresos - totalVariables;
    let gananciaNeta = ingresos - totalCostos;
    let margen = ingresos > 0 ? (gananciaNeta / ingresos) * 100 : 0;

    escenariosganancias.push({ nombre, precio, tazas, ingresos, gananciaBruta, gananciaNeta, margen });

    mostrarTextoEnCaja("gan_nombre", "");
    mostrarTextoEnCaja("gan_precio", "");
    mostrarTextoEnCaja("gan_tazas", "");
    let preview = document.getElementById("gan_preview");
    if (preview) preview.style.display = "none";

    renderizarTablaEscenarios();
}

// Elimina el escenario de ganancia en la posición indicada
/**\n * Elimina un escenario de la lista de ganancias por su índice.\n * @param {number} indice - Índice del escenario a eliminar.\n * @returns {void}\n */
function eliminarEscenario(indice) {
    escenariosganancias.splice(indice, 1);
    renderizarTablaEscenarios();
}

// Dibuja la tabla con todos los escenarios de ganancia guardados
/**\n * Renderiza la tabla de escenarios de ganancia guardados.\n * Muestra valores con clases de estilo según resultado positivo o negativo.\n * @returns {void}\n */
function renderizarTablaEscenarios() {
    let cuerpo = document.getElementById("tabla_escenarios_ganancias");
    if (!cuerpo) return;

    cuerpo.innerHTML = "";

    if (escenariosganancias.length === 0) {
        cuerpo.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-gris table-empty-cell">
                    Aún no hay escenarios guardados. Completa el formulario de arriba.
                </td>
            </tr>`;
        return;
    }

    for (let i = 0; i < escenariosganancias.length; i++) {
        let e = escenariosganancias[i];
        let claseNeta = e.gananciaNeta >= 0 ? "text-success" : "text-danger";
        let claseMargen = e.margen >= 0 ? "text-success" : "text-danger";

        cuerpo.innerHTML += `
            <tr>
                <td class="text-gris text-center">${i + 1}</td>
                <td class="text-blanco font-semibold">${e.nombre}</td>
                <td class="text-center text-celeste font-semibold">${convertirMoneda(e.precio)}</td>
                <td class="text-center">${e.tazas}</td>
                <td class="text-center font-semibold">${convertirMoneda(e.ingresos)}</td>
                <td class="text-center text-success font-semibold">${convertirMoneda(e.gananciaBruta)}</td>
                <td class="text-center font-bold ${claseNeta}">${convertirMoneda(e.gananciaNeta)}</td>
                <td class="text-center font-bold ${claseMargen}">${e.margen.toFixed(2)}%</td>
                <td class="text-center">
                    <button onclick="eliminarEscenario(${i})" class="btn-eliminar-tabla">Eliminar</button>
                </td>
            </tr>`;
    }
}


// ============================================================
// SECCIÃ“N: PUNTO DE EQUILIBRIO
// ============================================================

// Arreglo donde se almacenan los escenarios de equilibrio creados por el usuario
let escenariosEquilibrio = [];

// Actualiza las tarjetas de costos actuales y recarga la tabla de escenarios de equilibrio
/**\n * Actualiza los totales de la sección Punto de Equilibrio y recarga la tabla.\n * Muestra el total de costos fijos y variables actuales.\n * @returns {void}\n */
function actualizarSeccionEquilibrio() {
    let totalFijos = obtenerTotalCostosFijosActual();
    let totalVariables = obtenerTotalCostosVariablesActual();

    let elF = document.getElementById("eq_total_fijos");
    let elV = document.getElementById("eq_total_variables");
    if (elF) elF.innerText = convertirMoneda(totalFijos);
    if (elV) elV.innerText = convertirMoneda(totalVariables);

    let elCVu = document.getElementById("eq_cvu");
    if (elCVu) elCVu.innerText = "$0.00";

    renderizarTablaEquilibrio();
}

// Calcula en tiempo real el CVu, margen de contribución y punto de equilibrio mientras el usuario escribe
/**\n * Calcula el punto de equilibrio en tiempo real durante la edición.\n * Usa CVu, margen de contribución y redondea hacia arriba las tazas necesarias.\n * @returns {void}\n */
function previsualizarEquilibrio() {
    let precio = recuperarFloatSeguro("eq_precio");
    let tazas = recuperarFloatSeguro("eq_tazas_estimadas");
    let preview = document.getElementById("eq_preview");

    if (precio <= 0 || tazas <= 0) {
        if (preview) preview.style.display = "none";
        return;
    }

    let totalFijos = obtenerTotalCostosFijosActual();
    let totalVariables = obtenerTotalCostosVariablesActual();

    // CVu = costo variable total / tazas estimadas
    let cvu = totalVariables / tazas;
    // Margen de contribución = cuánto aporta cada taza a cubrir los costos fijos
    let margenContrib = precio - cvu;
    // Punto de equilibrio = costos fijos / margen de contribución (redondeado hacia arriba)
    let tazasEquilibrio = margenContrib > 0 ? Math.ceil(totalFijos / margenContrib) : Infinity;
    let ingresosEquil = tazasEquilibrio !== Infinity ? tazasEquilibrio * precio : 0;

    let elCVu = document.getElementById("eq_cvu");
    if (elCVu) elCVu.innerText = convertirMoneda(cvu);

    if (preview) preview.style.display = "block";

    let colorMargen = margenContrib >= 0 ? "#10b981" : "var(--rosa-marca)";
    let textoTazas = tazasEquilibrio === Infinity ? "No viable" : tazasEquilibrio + " tazas";

    let elC = document.getElementById("prev_eq_cvu");
    let elM = document.getElementById("prev_eq_margen");
    let elT = document.getElementById("prev_eq_tazas");
    let elI = document.getElementById("prev_eq_ingresos");

    if (elC) elC.innerText = convertirMoneda(cvu);
    if (elM) { elM.innerText = convertirMoneda(margenContrib); elM.style.color = colorMargen; }
    if (elT) elT.innerText = textoTazas;
    if (elI) elI.innerText = tazasEquilibrio === Infinity ? "â€”" : convertirMoneda(ingresosEquil);
}

// Valida el formulario, calcula el punto de equilibrio y guarda el escenario en el arreglo
/**\n * Guarda un escenario de punto de equilibrio con los datos actuales.\n * Calcula CVu, margen de contribución, tazas e ingresos de equilibrio.\n * @returns {void}\n */
function guardarEscenarioEquilibrio() {
    let nombre = recuperarTexto("eq_nombre").trim();
    let precio = recuperarFloatSeguro("eq_precio");
    let tazas = recuperarFloatSeguro("eq_tazas_estimadas");

    if (nombre === "") { alert("Por favor ingresa un nombre para el escenario."); return; }
    if (precio <= 0) { alert("Por favor ingresa un precio de venta válido."); return; }
    if (tazas <= 0) { alert("Por favor ingresa las tazas estimadas."); return; }

    let totalFijos = obtenerTotalCostosFijosActual();
    let totalVariables = obtenerTotalCostosVariablesActual();
    let cvu = totalVariables / tazas;
    let margenContrib = precio - cvu;
    let tazasEquil = margenContrib > 0 ? Math.ceil(totalFijos / margenContrib) : Infinity;
    let ingresosEquil = tazasEquil !== Infinity ? tazasEquil * precio : 0;

    escenariosEquilibrio.push({ nombre, precio, cvu, margenContrib, tazasEquil, ingresosEquil });

    mostrarTextoEnCaja("eq_nombre", "");
    mostrarTextoEnCaja("eq_precio", "");
    mostrarTextoEnCaja("eq_tazas_estimadas", "");
    let preview = document.getElementById("eq_preview");
    if (preview) preview.style.display = "none";

    renderizarTablaEquilibrio();
}

// Elimina el escenario de equilibrio en la posición indicada
/**\n * Elimina un escenario de equilibrio por índice.\n * @param {number} indice - Índice del escenario a eliminar.\n * @returns {void}\n */
function eliminarEscenarioEquilibrio(indice) {
    escenariosEquilibrio.splice(indice, 1);
    renderizarTablaEquilibrio();
}

// Dibuja la tabla con todos los escenarios de punto de equilibrio guardados
/**\n * Renderiza la tabla de escenarios de punto de equilibrio guardados.\n * Convierte valores infinitos en texto legible si el escenario no es viable.\n * @returns {void}\n */
function renderizarTablaEquilibrio() {
    let cuerpo = document.getElementById("tabla_escenarios_equilibrio");
    if (!cuerpo) return;

    cuerpo.innerHTML = "";

    if (escenariosEquilibrio.length === 0) {
        cuerpo.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-gris table-empty-cell">
                    Aún no hay escenarios guardados. Completa el formulario de arriba.
                </td>
            </tr>`;
        return;
    }

    for (let i = 0; i < escenariosEquilibrio.length; i++) {
        let e = escenariosEquilibrio[i];
        let claseMargen = e.margenContrib >= 0 ? "text-success" : "text-danger";
        let textoTazas = e.tazasEquil === Infinity ? "No viable" : e.tazasEquil + " tazas";
        let textoIngresos = e.tazasEquil === Infinity ? "â€”" : convertirMoneda(e.ingresosEquil);

        cuerpo.innerHTML += `
            <tr>
                <td class="text-gris text-center">${i + 1}</td>
                <td class="text-blanco font-semibold">${e.nombre}</td>
                <td class="text-center text-celeste font-semibold">${convertirMoneda(e.precio)}</td>
                <td class="text-center text-gris">${convertirMoneda(e.cvu)}</td>
                <td class="text-center font-bold ${claseMargen}">${convertirMoneda(e.margenContrib)}</td>
                <td class="text-center font-bold text-rosa">${textoTazas}</td>
                <td class="text-center font-semibold text-celeste">${textoIngresos}</td>
                <td class="text-center">
                    <button onclick="eliminarEscenarioEquilibrio(${i})" class="btn-eliminar-tabla">Eliminar</button>
                </td>
            </tr>`;
    }
}


