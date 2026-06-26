1// ============================================================
// SECCIÓN: COSTOS FIJOS
// ============================================================

// Lista de todos los gastos fijos mensuales de la cafeteria
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

// Suma el costo total de los empleados que coinciden con el cargo recibido
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

// Recalcula sueldos desde mano de obra, renderiza la tabla de costos fijos y actualiza el total
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
        let clasePorcentaje = porcentaje >= 25 ? "text-rosa font-bold" : porcentaje >= 10 ? "text-rosa font-medium" : "text-gris";

        let fila = `
        <tr>
            <td class="text-gris text-center">${i + 1}</td>
            <td class="text-blanco font-semibold">${item.concepto}</td>
            <td class="text-celeste font-semibold">${item.categoria}</td>
            <td class="text-violeta">${item.frecuencia}</td>
            <td class="text-verde font-bold text-center">$${item.montoMensual.toFixed(2)}</td>
            <td class="text-celeste text-center">$${montoAnual.toFixed(2)}</td>
            <td class="${clasePorcentaje} text-center">${porcentaje.toFixed(2)}%</td>
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

// Valida el formulario y guarda un gasto fijo nuevo o actualiza uno existente
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

// Carga los datos de un gasto fijo en el formulario para poder editarlo
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

// Restaura el formulario de costos fijos al modo de agregar nuevo gasto
function cancelarEdicionFijo() {
    document.getElementById("fijo_index_editar").value = "-1";
    document.getElementById("fijo_formulario_titulo").innerText = "Agregar Nuevo Gasto Fijo";

    let btnGuardar = document.getElementById("btn_guardar_fijo");
    btnGuardar.innerText = "Guardar Gasto Fijo";
    btnGuardar.style.backgroundColor = "var(--rosa-marca)";

    document.getElementById("btn_cancelar_fijo").style.display = "none";
    limpiarFormularioFijo();
}

// Limpia todos los campos del formulario de costos fijos
function limpiarFormularioFijo() {
    mostrarTextoEnCaja("fijo_nombre", "");
    mostrarTextoEnCaja("fijo_categoria", "");
    mostrarTextoEnCaja("fijo_valor", "");
}


// ============================================================
// SECCIÓN: COSTOS VARIABLES
// ============================================================

// Lista de costos variables; los 3 primeros se calculan desde materia prima
let costosVariables = [
    { concepto: "Materia Prima Directa (MPD)", monto: 0, esAutomatico: true },
    { concepto: "Materia Prima Indirecta (MPI)", monto: 0, esAutomatico: true },
    { concepto: "Merma en Dinero", monto: 0, esAutomatico: true },
    { concepto: "Servicio de electricidad", monto: 45.00, esAutomatico: false },
    { concepto: "Suministros de limpieza", monto: 18.00, esAutomatico: false }
];

// Busca un valor numerico en el DOM probando varios IDs posibles
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

// Sincroniza rubros automaticos desde materia prima, renderiza tabla y actualiza total
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
            <td class="text-blanco font-semibold">${item.concepto}</td>
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

// Carga un costo variable en el formulario para editarlo (bloquea rubros automaticos)
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

// Valida y guarda un costo variable nuevo o actualiza uno existente
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

// Restaura el formulario de costos variables al modo de agregar nuevo rubro
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
// SECCIÓN: COSTOS DIRECTOS E INDIRECTOS
// ============================================================

// Clasifica costos en directos e indirectos y muestra los totales en tablas y tarjetas
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
                    <td class="text-blanco font-semibold">Mano de Obra — ${emp.nombre} (${emp.cargo})</td>
                    <td class="text-celeste">Personal directo</td>
                    <td class="text-verde font-bold text-center">${convertirMoneda(emp.costoTotal)}</td>
                </tr>`;
            totalDirectos += emp.costoTotal;
        } else {
            cuerpoIndirectos.innerHTML += `
                <tr>
                    <td class="text-gris text-center">${contI++}</td>
                    <td class="text-blanco font-semibold">Mano de Obra — ${emp.nombre} (${emp.cargo})</td>
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
// SECCIÓN: MATERIA PRIMA
// ============================================================

// Lista principal de insumos directos e indirectos de la cafeteria
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

// Suma los precios de materia prima separando directa e indirecta
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

// Actualiza en el DOM todos los totales de materia prima y merma
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
// Calcula el costo neto por unidad de un insumo despues de descontar la merma
function obtenerCostoNetoUnitarioInsumo(item) {
    let cantidadUtilizable = item.cantidad * (1 - (item.merma / 100));
    if (cantidadUtilizable > 0) {
        return item.precio / cantidadUtilizable;
    }
    return 0;
}

// Renderiza la tabla de insumos y sincroniza los totales de materia prima
function actualizarTablaMateria() {
    let tablaBody = document.getElementById("tabla_materia_prima");
    if (!tablaBody) return;

    tablaBody.innerHTML = "";

    materiasPrimas.forEach(function (item, index) {
        let costoNetoUnidad = obtenerCostoNetoUnitarioInsumo(item);
        let claseTipo = item.tipo === "DIRECTA" ? "tipo-directa" : "tipo-indirecta";

        let fila = `
            <tr>
                <td class="col-id text-gris text-center">${index + 1}</td>
                <td class="col-nombre text-blanco font-semibold">${item.nombre}</td>
                <td class="col-unidad text-violeta">${item.unidad}</td>
                <td class="col-cantidad text-celeste font-semibold">${item.cantidad.toFixed(2)}</td>
                <td class="col-precio text-verde font-bold">$${item.precio.toFixed(2)}</td>
                <td class="col-merma text-rosa">${item.merma.toFixed(2)}%</td>
                <td class="col-merma text-verde font-semibold">$${(item.cantidad*item.precio*(1-(item.merma/100))).toFixed(2)}</td>

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

// Carga los datos de un insumo en el formulario para poder editarlo
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

// Valida y guarda un insumo nuevo o actualiza uno existente en la tabla
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

// Restaura el formulario de materia prima al modo de agregar nuevo insumo
function cancelarEdicionMateria() {
    document.getElementById("mat_index_editar").value = "-1";
    document.getElementById("formulario_titulo").innerText = "Agregar Nuevo Insumo";
    document.getElementById("btn_guardar_materia").innerText = "Guardar Insumo";
    document.getElementById("btn_guardar_materia").style.background = "var(--rosa-marca)";
    document.getElementById("btn_cancelar_edicion").style.display = "none";
    limpiarFormularioMateria();
}

// Limpia todos los campos del formulario de materia prima
function limpiarFormularioMateria() {
    mostrarTextoEnCaja("mat_nombre", "");
    mostrarTextoEnCaja("mat_unidad", "");
    mostrarTextoEnCaja("mat_cantidad", "");
    mostrarTextoEnCaja("mat_precio", "");
    mostrarTextoEnCaja("mat_merma", "");
}


// ============================================================
// SECCIÓN: MANO DE OBRA
// ============================================================

// Lista de cargos predefinidos con sueldo y tipo
let cargos = [
    { nombre: "Barista", sueldo: 460.00, tipo: "Directo" },
    { nombre: "Cajero", sueldo: 460.00, tipo: "Directo" },
    { nombre: "Administrador", sueldo: 800.00, tipo: "Indirecto" }
];

// Lista de empleados registrados con sus sueldos y beneficios calculados
let listaEmpleados = [
    { nombre: "John", cargo: "Barista", tipo: "Directo", sueldo: 460.00, ingresoTotal: 460.00, iess: 55.89, decimoTercero: 38.33, decimoCuarto: 40.17, vacaciones: 19.17, fondosReserva: 38.32, costoTotal: 651.88 },
    { nombre: "Juan", cargo: "Cajero", tipo: "Directo", sueldo: 460.00, ingresoTotal: 460.00, iess: 55.89, decimoTercero: 38.33, decimoCuarto: 40.17, vacaciones: 19.17, fondosReserva: 38.32, costoTotal: 651.88 },
    { nombre: "Danna", cargo: "Administrador", tipo: "Indirecto", sueldo: 800.00, ingresoTotal: 800.00, iess: 97.20, decimoTercero: 66.67, decimoCuarto: 40.17, vacaciones: 33.33, fondosReserva: 66.64, costoTotal: 1104.01 }
];

// Llena el selector de cargos con las opciones disponibles
function cargarOpcionesCargos() {
    let selectCargo = recuperarElemento("inputCargo");
    selectCargo.innerHTML = "";
    for (let i = 0; i < cargos.length; i++) {
        selectCargo.innerHTML += "<option>" + cargos[i].nombre + "</option>";
    }
    selectCargo.innerHTML += "<option value='__nuevo__'>+ Nuevo cargo...</option>";
}

// Detecta el cargo seleccionado y autocompleta sueldo y tipo
function manejarCargo() {
    let cargoSeleccionado = recuperarTexto("inputCargo");
    let divNuevoCargo = recuperarElemento("divNuevoCargo");
    let inputTipo = recuperarElemento("inputTipo");

    if (cargoSeleccionado === "__nuevo__") {
        divNuevoCargo.style.display = "block";
        mostrarTextoEnCaja("inputSueldo", "");
        mostrarTextoEnCaja("inputTipo", "Directo");
    } else {
        divNuevoCargo.style.display = "none";
        mostrarTextoEnCaja("inputNuevoCargo", "");
        for (let i = 0; i < cargos.length; i++) {
            if (cargos[i].nombre === cargoSeleccionado) {
                mostrarTextoEnCaja("inputSueldo", cargos[i].sueldo);
                mostrarTextoEnCaja("inputTipo", cargos[i].tipo);
            }
        }
    }
}

// Lee el formulario, calcula beneficios de ley y agrega el empleado a la lista
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

// Elimina un empleado de la lista segun su indice
function eliminarEmpleado(indice) {
    listaEmpleados.splice(indice, 1);
    mostrarTabla();
}

// Construye y renderiza la tabla HTML de mano de obra con todos los empleados
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
// SECCIÓN: RECETAS Y COSTOS
// ============================================================

// Lista de recetas del menu con sus ingredientes e insumos
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
        nombreReceta: "CAFÉ AMERICANO",
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
        nombreReceta: "CAFÉ CON LECHE",
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

// Registro de recetas que estan actualmente en modo edicion
let recetasEnModoEdicion = {};


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


function calcularCostoManoObraReceta(receta) {
    let costoPorMinuto = obtenerCostoManoObraPorMinuto();
    return costoPorMinuto * receta.tiempoPreparacion;
}

// Alterna el modo edicion de una receta y vuelve a renderizar la vista
function toggleModoEdicionReceta(rIndex) {
    if (recetasEnModoEdicion[rIndex]) {
        delete recetasEnModoEdicion[rIndex];
    } else {
        recetasEnModoEdicion[rIndex] = true;
    }
    actualizarPantallaRecetas();
}

// Guarda los cambios editados de una receta y sale del modo edicion
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


function actualizarPantallaRecetas() {
    let contenedor = document.getElementById("contenedor_recetas_dinamicas");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    recetasBase.forEach(function (receta, rIndex) {
        let enEdicion = !!recetasEnModoEdicion[rIndex];

        let campoCabecera = `<strong>Tiempo prep.:</strong> 
               <input type="number" id="edit_tiempo_${rIndex}" value="${receta.tiempoPreparacion}" class="campo-control input-50 input-center" onchange="_guardarTiempoReceta(${rIndex})"> min 
               &nbsp;|&nbsp; <strong>Porciones:</strong> 
               <input type="number" id="edit_porciones_${rIndex}" value="${receta.numeroPorciones}" class="campo-control input-45 input-center" onchange="_guardarPorcionesReceta(${rIndex})">`; 

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
                               title="Quitar ingrediente" class="btn-eliminar-receta">✕</button>
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
        let costoTotalPorciones = costoTotalProduccionReceta * receta.numeroPorciones;

        // Colspan dinámico: 7 columnas en edición, 6 en vista normal
        let colspanTotales = enEdicion ? 6 : 5;

        tablaHTML += `
                    </tbody>
                    <tfoot>

                    <div class="acciones-receta">
                    ${enEdicion
                        ? `<button onclick="guardarCambiosMasivosReceta(${rIndex})" class="btn-receta btn-receta-primary">
                               💾 Guardar Cambios
                           </button>
                           <button onclick="toggleModoEdicionReceta(${rIndex})" class="btn-receta btn-receta-danger">
                               ✕ Cancelar
                           </button>`
                        : `<button onclick="toggleModoEdicionReceta(${rIndex})" class="btn-receta btn-receta-outline">
                               ✏️ Editar Lista
                           </button>`
                    }
                    <button onclick="mostrarFormAgregarIngrediente(${rIndex})" class="btn-dashed">
                        + Agregar Ingrediente a esta receta
                    </button>
                </div>

                <div id="form_agregar_ing_${rIndex}" class="form-agregar-ing">
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
                            <label class="form-label">¿Requiere conversión?</label>
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
                        <tr class="row-total-receta">
                            <td colspan="${colspanTotales}" class="td-footer-label">Total Costo Ingredientes:</td>
                            <td class="td-footer-value">$${totalMateriaPrimaReceta.toFixed(4)}</td>
                        </tr>
                        <tr class="row-mano-obra">
                            <td colspan="${colspanTotales}" class="td-footer-label">Costo Mano de Obra (${receta.tiempoPreparacion} min):</td>
                            <td class="td-footer-value">$${costoManoObraReceta.toFixed(4)}</td>
                        </tr>
                        <tr class="row-total-produccion">
                            <td colspan="${colspanTotales}" class="td-footer-label">Costo por Porcion (unitario):</td>
                            <td class="td-footer-value">$${costoTotalProduccionReceta.toFixed(4)}</td>
                        </tr>
                        <tr class="row-total-produccion">
                            <td colspan="${colspanTotales}" class="td-footer-label">Costo Total (x${receta.numeroPorciones} porciones):</td>
                            <td class="td-footer-value">$${costoTotalPorciones.toFixed(4)}</td>
                        </tr>
                    </tfoot>
                </table>

                
            </div>
        `;

        contenedor.innerHTML += tablaHTML;
    });
}

// Funciones auxiliares para agregar ingredientes a una receta


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


function mostrarFormAgregarIngrediente(rIndex) {
    let formulario = document.getElementById("form_agregar_ing_" + rIndex);
    if (formulario) formulario.style.display = "block";
}


function ocultarFormAgregarIngrediente(rIndex) {
    let formulario = document.getElementById("form_agregar_ing_" + rIndex);
    if (formulario) formulario.style.display = "none";
}


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


function eliminarIngredienteDeReceta(rIndex, iIndex) {
    let receta = recetasBase[rIndex];
    let nombreIngrediente = receta.ingredientes[iIndex].buscarNombre;
    let confirmado = confirm("¿Seguro que deseas quitar \"" + nombreIngrediente + "\" de la receta \"" + receta.nombreReceta + "\"?");
    if (!confirmado) return;
    receta.ingredientes.splice(iIndex, 1);
    _recetasAbiertas[rIndex] = true;
    actualizarPantallaRecetas();
}

// Funciones para crear una receta nueva desde cero


function mostrarFormularioNuevaReceta() {
    let formulario = document.getElementById("formulario_nueva_receta");
    if (!formulario) return;
    formulario.style.display = "block";
    document.getElementById("contenedor_filas_nueva_receta").innerHTML = "";
    agregarFilaIngredienteNuevaReceta();
    formulario.scrollIntoView({ behavior: "smooth" });
}


function cancelarNuevaReceta() {
    mostrarTextoEnCaja("nueva_receta_nombre", "");
    mostrarTextoEnCaja("nueva_receta_tiempo", "");
    mostrarTextoEnCaja("nueva_receta_porciones", "");
    document.getElementById("contenedor_filas_nueva_receta").innerHTML = "";
    document.getElementById("formulario_nueva_receta").style.display = "none";
}


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
                <label class="form-label-small">¿Conversión?</label>
                <select class="campo-control fila-ing-conversion">
                    <option value="true">Sí (kg/L → g/ml)</option>
                    <option value="false">No (unidad directa)</option>
                </select>
            </div>
            <button onclick="eliminarFilaIngredienteNuevaReceta(this)" title="Quitar esta fila" class="btn-eliminar-receta">✕</button>
        </div>
    `;
    contenedorFilas.insertAdjacentHTML("beforeend", filaHTML);
}


function eliminarFilaIngredienteNuevaReceta(boton) {
    let contenedorFilas = document.getElementById("contenedor_filas_nueva_receta");
    let totalFilas = contenedorFilas.querySelectorAll(".fila-ingrediente-nueva-receta").length;
    if (totalFilas <= 1) {
        alert("La receta debe tener al menos un ingrediente.");
        return;
    }
    boton.closest(".fila-ingrediente-nueva-receta").remove();
}


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
// SECCIÓN: GANANCIAS
// ============================================================

// Lista de escenarios de ganancia creados por el usuario
let escenariosganancias = [];

// Sincroniza sueldos de personal y retorna el total mensual de costos fijos
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

// Sincroniza rubros automaticos y retorna el total mensual de costos variables
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

// Calcula el precio de venta sugerido segun costo de produccion y margen deseado
function calcularPrecioSugerido(costoProduccion, margenPorcentaje) {
    if (margenPorcentaje >= 100 || margenPorcentaje < 0) return 0;
    return costoProduccion / (1 - (margenPorcentaje / 100));
}

// Guarda el porcentaje de margen elegido para cada receta (no se pierde al repintar)
// El valor por defecto es 30% si la receta aun no tiene un margen asignado
let margenesPorReceta = {};

// Retorna el margen guardado de una receta o 30% por defecto
function obtenerMargenGuardado(idReceta) {
    if (margenesPorReceta.hasOwnProperty(idReceta)) {
        return margenesPorReceta[idReceta];
    }
    return 30;
}

// Guarda el nuevo margen ingresado y recalcula el precio sugerido de esa receta
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

// Renderiza la tabla de precio sugerido con una fila por cada receta
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
                <td class="text-center text-celeste">${convertirMoneda(costoIngredientes)}</td>
                <td class="text-center text-violeta">${convertirMoneda(costoManoObra)}</td>
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

// Actualiza las tarjetas de costos y recarga las tablas de la seccion Ganancias
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

// Calcula en tiempo real los indicadores de ganancia mientras el usuario escribe
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

    let colorBruta = gananciaBruta >= 0 ? "#10b981" : "var(--rosa-marca)";
    let colorNeta = gananciaNeta >= 0 ? "#10b981" : "var(--rosa-marca)";
    let colorMargen = margen >= 0 ? "#10b981" : "var(--rosa-marca)";

    let elI = document.getElementById("prev_ingresos");
    let elB = document.getElementById("prev_bruta");
    let elN = document.getElementById("prev_neta");
    let elM = document.getElementById("prev_margen");

    if (elI) elI.innerText = convertirMoneda(ingresos);
    if (elB) { elB.innerText = convertirMoneda(gananciaBruta); elB.style.color = colorBruta; }
    if (elN) { elN.innerText = convertirMoneda(gananciaNeta); elN.style.color = colorNeta; }
    if (elM) { elM.innerText = margen.toFixed(2) + "%"; elM.style.color = colorMargen; }
}

// Valida el formulario, calcula indicadores y guarda el escenario de ganancia
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

// Elimina un escenario de ganancia segun su indice
function eliminarEscenario(indice) {
    escenariosganancias.splice(indice, 1);
    renderizarTablaEscenarios();
}

// Renderiza la tabla con todos los escenarios de ganancia guardados
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
        let claseBruta = e.gananciaBruta >= 0 ? "text-success" : "text-danger";

        cuerpo.innerHTML += `
            <tr>
                <td class="text-gris text-center">${i + 1}</td>
                <td class="text-blanco font-semibold">${e.nombre}</td>
                <td class="text-center text-celeste font-semibold">${convertirMoneda(e.precio)}</td>
                <td class="text-center text-blanco font-semibold">${e.tazas}</td>
                <td class="text-center font-semibold text-celeste">${convertirMoneda(e.ingresos)}</td>
                <td class="text-center font-semibold ${claseBruta}">${convertirMoneda(e.gananciaBruta)}</td>
                <td class="text-center font-bold ${claseNeta}">${convertirMoneda(e.gananciaNeta)}</td>
                <td class="text-center font-bold ${claseMargen}">${e.margen.toFixed(2)}%</td>
                <td class="text-center">
                    <button onclick="eliminarEscenario(${i})" class="btn-eliminar-tabla">Eliminar</button>
                </td>
            </tr>`;
    }
}


// ============================================================
// SECCIÓN: EQUILIBRIO FINANCIERO
// ============================================================

// Lista de escenarios de punto de equilibrio creados por el usuario
let escenariosEquilibrio = [];

// Actualiza tarjetas de costos y recarga la tabla de escenarios de equilibrio
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

// Calcula en tiempo real CVu, margen de contribucion y punto de equilibrio
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
    let colorTazas = tazasEquilibrio === Infinity ? "var(--rosa-marca)" : "#10b981";
    if (elT) { elT.innerText = textoTazas; elT.style.color = colorTazas; }
    if (elI) elI.innerText = tazasEquilibrio === Infinity ? "—" : convertirMoneda(ingresosEquil);
}

// Valida el formulario, calcula el punto de equilibrio y guarda el escenario
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

// Elimina un escenario de equilibrio segun su indice
function eliminarEscenarioEquilibrio(indice) {
    escenariosEquilibrio.splice(indice, 1);
    renderizarTablaEquilibrio();
}

// Renderiza la tabla con todos los escenarios de equilibrio guardados
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
        let claseTazas = e.tazasEquil === Infinity ? "text-danger" : "text-celeste";
        let textoIngresos = e.tazasEquil === Infinity ? "—" : convertirMoneda(e.ingresosEquil);

        cuerpo.innerHTML += `
            <tr>
                <td class="text-gris text-center">${i + 1}</td>
                <td class="text-blanco font-semibold">${e.nombre}</td>
                <td class="text-center text-celeste font-semibold">${convertirMoneda(e.precio)}</td>
                <td class="text-center text-rosa">${convertirMoneda(e.cvu)}</td>
                <td class="text-center font-bold ${claseMargen}">${convertirMoneda(e.margenContrib)}</td>
                <td class="text-center font-bold ${claseTazas}">${textoTazas}</td>
                <td class="text-center font-semibold text-celeste">${textoIngresos}</td>
                <td class="text-center">
                    <button onclick="eliminarEscenarioEquilibrio(${i})" class="btn-eliminar-tabla">Eliminar</button>
                </td>
            </tr>`;
    }
}




// ============================================================
// SECCIÓN: PAGINACIÓN
// ============================================================

var FILAS_POR_PAGINA = 4;
var _paginas = {};

function _paginar(tbodyId) {
    var tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    var filas = tbody.rows;
    var total = filas.length;
    if (total === 0) return;

    var totalPags = Math.ceil(total / FILAS_POR_PAGINA);
    var pag = _paginas[tbodyId] || 1;
    if (pag > totalPags) pag = totalPags;
    if (pag < 1) pag = 1;
    _paginas[tbodyId] = pag;

    var ini = (pag - 1) * FILAS_POR_PAGINA;
    var fin = ini + FILAS_POR_PAGINA;
    for (var i = 0; i < total; i++) {
        filas[i].style.display = (i >= ini && i < fin) ? "" : "none";
    }

    var idPag = "pag_" + tbodyId;
    var caja = document.getElementById(idPag);
    if (totalPags <= 1) {
        if (caja) caja.remove();
        return;
    }
    if (!caja) {
        caja = document.createElement("div");
        caja.id = idPag;
        caja.className = "paginacion-controles";
        var tabla = tbody.closest("table");
        if (tabla && tabla.parentNode) {
            tabla.parentNode.insertBefore(caja, tabla.nextSibling);
        }
    }
    var dAnt = pag <= 1 ? " disabled" : "";
    var dSig = pag >= totalPags ? " disabled" : "";
    caja.innerHTML = "<span class='paginacion-info'>Pagina " + pag + " de " + totalPags + "</span><div class='paginacion-botones'><button class='btn-paginacion'" + dAnt + " onclick=\"_irPag('" + tbodyId + "'," + (pag - 1) + ")\">Anterior</button><button class='btn-paginacion'" + dSig + " onclick=\"_irPag('" + tbodyId + "'," + (pag + 1) + ")\">Siguiente</button></div>";
}

function _irPag(tbodyId, pag) {
    _paginas[tbodyId] = pag;
    _paginar(tbodyId);
}

function _paginarSeccion(id) {
    var mapa = {
        fijos: ["tabla_costos_fijos"],
        variables: ["tabla_costos_variables"],
        directos: ["tabla_costos_directos", "tabla_costos_indirectos"],
        materia: ["tabla_materia_prima"],
        manoDeObra: ["tablaEmpleados"],
        ganancias: ["tabla_precio_sugerido_recetas", "tabla_escenarios_ganancias"],
        equilibrio: ["tabla_escenarios_equilibrio"]
    };
    var tablas = mapa[id];
    if (!tablas) return;
    for (var i = 0; i < tablas.length; i++) {
        _paginar(tablas[i]);
    }
}

// Envuelve funciones de renderizado para reaplicar paginacion tras redibujar tablas
var _orig_actualizarTablaCostosFijos = actualizarTablaCostosFijos;
actualizarTablaCostosFijos = function() { _orig_actualizarTablaCostosFijos(); _paginar("tabla_costos_fijos"); };

var _orig_actualizarTablaCostosVariables = actualizarTablaCostosVariables;
actualizarTablaCostosVariables = function() { _orig_actualizarTablaCostosVariables(); _paginar("tabla_costos_variables"); };

var _orig_actualizarTablaDirectos = actualizarTablaDirectos;
actualizarTablaDirectos = function() { _orig_actualizarTablaDirectos(); _paginar("tabla_costos_directos"); _paginar("tabla_costos_indirectos"); };

var _orig_actualizarTablaMateria = actualizarTablaMateria;
actualizarTablaMateria = function() { _orig_actualizarTablaMateria(); _paginar("tabla_materia_prima"); };

var _orig_mostrarTabla = mostrarTabla;
mostrarTabla = function() { _orig_mostrarTabla(); _paginar("tablaEmpleados"); };

var _orig_renderizarTablaPrecioSugerido = renderizarTablaPrecioSugerido;
renderizarTablaPrecioSugerido = function() { _orig_renderizarTablaPrecioSugerido(); _paginar("tabla_precio_sugerido_recetas"); };

var _orig_renderizarTablaEscenarios = renderizarTablaEscenarios;
renderizarTablaEscenarios = function() { _orig_renderizarTablaEscenarios(); _paginar("tabla_escenarios_ganancias"); };

var _orig_renderizarTablaEquilibrio = renderizarTablaEquilibrio;
renderizarTablaEquilibrio = function() { _orig_renderizarTablaEquilibrio(); _paginar("tabla_escenarios_equilibrio"); };

// ============================================================
// SECCIÓN: ACORDEÓN DE RECETAS
// ============================================================

var _recetasAbiertas = {};

function _aplicarAcordeonRecetas() {
    var cards = document.querySelectorAll(".receta-card");
    for (var c = 0; c < cards.length; c++) {
        (function(card, idx) {
            var header = card.querySelector(".receta-card-header");
            if (!header) return;
            var title = header.querySelector(".receta-card-title");
            if (!title) return;

            var icono = document.createElement("span");
            icono.className = "receta-acordeon-icono";
            title.insertBefore(icono, title.firstChild);
            title.style.cursor = "pointer";

            var enEdicion = typeof recetasEnModoEdicion !== "undefined" && !!recetasEnModoEdicion[idx];
            var abierta = enEdicion || !!_recetasAbiertas[idx];

            var hijos = card.children;
            for (var h = 0; h < hijos.length; h++) {
                if (hijos[h] !== header) {
                    hijos[h].style.display = abierta ? "" : "none";
                }
            }
            icono.innerHTML = abierta ? "&#9660;" : "&#9654;";

            title.onclick = function() {
                var vis = false;
                var hijosAct = card.children;
                for (var h = 0; h < hijosAct.length; h++) {
                    if (hijosAct[h] !== header) {
                        if (hijosAct[h].style.display !== "none") vis = true;
                    }
                }
                for (var h = 0; h < hijosAct.length; h++) {
                    if (hijosAct[h] !== header) {
                        hijosAct[h].style.display = vis ? "none" : "";
                    }
                }
                icono.innerHTML = vis ? "&#9654;" : "&#9660;";
                _recetasAbiertas[idx] = !vis;
            };
        })(cards[c], c);
    }
}

var _orig_actualizarPantallaRecetas = actualizarPantallaRecetas;
actualizarPantallaRecetas = function() {
    _orig_actualizarPantallaRecetas();
    _aplicarAcordeonRecetas();
};

// Guarda tiempo y porciones desde el encabezado sin requerir modo edicion
function _guardarTiempoReceta(rIndex) {
    var input = document.getElementById("edit_tiempo_" + rIndex);
    if (!input) return;
    var val = parseInt(input.value);
    if (!isNaN(val) && val > 0) recetasBase[rIndex].tiempoPreparacion = val;
}

function _guardarPorcionesReceta(rIndex) {
    var input = document.getElementById("edit_porciones_" + rIndex);
    if (!input) return;
    var val = parseInt(input.value);
    if (!isNaN(val) && val > 0) recetasBase[rIndex].numeroPorciones = val;
}

// Sincroniza todos los datos compartidos entre secciones
function _sincronizarTodosDatos() {
    // Sincronizar sueldos de empleados en costos fijos
    for (var i = 0; i < costosFijos.length; i++) {
        if (costosFijos[i].inputId === "fijo_barista") costosFijos[i].montoMensual = obtenerCostoTotalPorCargo("Barista");
        else if (costosFijos[i].inputId === "fijo_cajera") costosFijos[i].montoMensual = obtenerCostoTotalPorCargo("Cajero");
        else if (costosFijos[i].inputId === "fijo_admin") costosFijos[i].montoMensual = obtenerCostoTotalPorCargo("Administrador");
    }
    // Sincronizar materia prima en costos variables
    var totMP = calcularTotalesMateriaPrima();
    var mermaTotal = 0;
    for (var i = 0; i < materiasPrimas.length; i++) {
        mermaTotal += materiasPrimas[i].precio * (materiasPrimas[i].merma / 100);
    }
    costosVariables[0].monto = totMP.totalDirecta;
    costosVariables[1].monto = totMP.totalIndirecta;
    costosVariables[2].monto = mermaTotal;
}
