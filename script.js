// ============================================================
// MANO DE OBRA — ARREGLO DE CARGOS PREDEFINIDOS
// ============================================================
let cargos = [
    { nombre: "Barista",        sueldo: 460.00, tipo: "Directo"   },
    { nombre: "Cajero",         sueldo: 460.00, tipo: "Directo"   },
    { nombre: "Administrador",  sueldo: 800.00, tipo: "Indirecto" }
];

// ============================================================
// ARREGLO DE EMPLEADOS — empieza con los datos del proyecto
// ============================================================
let listaEmpleados = [
    { nombre: "John",  cargo: "Barista",       tipo: "Directo",   sueldo: 460.00, ingresoTotal: 460.00, iess: 55.89, decimoTercero: 38.33, decimoCuarto: 40.17, vacaciones: 19.17, fondosReserva: 38.32, costoTotal: 651.88 },
    { nombre: "Juan",  cargo: "Cajero",        tipo: "Directo",   sueldo: 460.00, ingresoTotal: 460.00, iess: 55.89, decimoTercero: 38.33, decimoCuarto: 40.17, vacaciones: 19.17, fondosReserva: 38.32, costoTotal: 651.88 },
    { nombre: "Danna", cargo: "Administrador", tipo: "Indirecto", sueldo: 800.00, ingresoTotal: 800.00, iess: 97.20, decimoTercero: 66.67, decimoCuarto: 40.17, vacaciones: 33.33, fondosReserva: 66.64, costoTotal: 1104.01 }
];

// ============================================================
// FUNCIÓN: cargarOpcionesCargos
// Recorre el arreglo cargos y genera las opciones del select
// ============================================================
function cargarOpcionesCargos() {
    let selectCargo = recuperarElemento("inputCargo");
    selectCargo.innerHTML = "";
    for (let i = 0; i < cargos.length; i++) {
        selectCargo.innerHTML += "<option>" + cargos[i].nombre + "</option>";
    }
    selectCargo.innerHTML += "<option value='__nuevo__'>+ Nuevo cargo...</option>";
}

// ============================================================
// FUNCIÓN: manejarCargo
// Busca el sueldo del cargo seleccionado y lo pone en el input
// ============================================================
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

// ============================================================
// FUNCIÓN: agregarEmpleado
// Lee el formulario, calcula todos los valores y hace push
// ============================================================
function agregarEmpleado() {
    let nombre      = recuperarTexto("inputNombre");
    let cargoSelect = recuperarTexto("inputCargo");
    let nuevoCargo  = recuperarTexto("inputNuevoCargo").trim();
    let cargo       = cargoSelect === "__nuevo__" ? nuevoCargo : cargoSelect;
    let tipo        = recuperarTexto("inputTipo").trim();
    let sueldo      = recuperarFloatSeguro("inputSueldo");
    let horas50     = recuperarFloatSeguro("inputHoras50");
    let horas100    = recuperarFloatSeguro("inputHoras100");

    // Validaciones
    if (nombre === "") { alert("Debe ingresar un nombre"); return; }
    if (cargo  === "") { alert("Debe ingresar el nombre del nuevo cargo"); return; }
    if (tipo   === "") { alert("Debe ingresar el tipo: Directo o Indirecto"); return; }
    if (sueldo === 0)  { alert("Ingrese un monto"); return; }

    // Si es cargo nuevo, guardarlo para usarlo de nuevo después
    if (cargoSelect === "__nuevo__") {
        cargos.push({ nombre: cargo, sueldo: sueldo, tipo: tipo });
        cargarOpcionesCargos();
    }

    // Cálculos
    let horaNormal       = sueldo / 240;
    let totalHorasExtras = (horas50 * horaNormal * 1.5) + (horas100 * horaNormal * 2);
    let ingresoTotal     = sueldo + totalHorasExtras;

    let iess          = ingresoTotal * 0.1215;
    let decimoTercero = ingresoTotal / 12;
    let decimoCuarto  = 40.17;
    let vacaciones    = ingresoTotal / 24;
    let fondosReserva = ingresoTotal * 0.0833;
    let costoTotal    = ingresoTotal + iess + decimoTercero + decimoCuarto + vacaciones + fondosReserva;

    let nuevoEmpleado = { nombre, cargo, tipo, sueldo, ingresoTotal, iess, decimoTercero, decimoCuarto, vacaciones, fondosReserva, costoTotal };
    listaEmpleados.push(nuevoEmpleado);
    mostrarTabla();
}

// ============================================================
// FUNCIÓN: eliminarEmpleado
// Elimina el empleado en la posición indicada con splice
// ============================================================
function eliminarEmpleado(indice) {
    listaEmpleados.splice(indice, 1);
    mostrarTabla();
}

// ============================================================
// FUNCIÓN: mostrarTabla
// Recorre listaEmpleados y renderiza las filas con innerHTML
// ============================================================
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
                <td style="text-align:center;">
                    <button class="btn-eliminar-tabla" onclick="eliminarEmpleado(${i})">Eliminar</button>
                </td>
            </tr>`;
    }
}

// ==========================================================================
// SECCIÓN: MATERIA PRIMA
// ==========================================================================

let materiasPrimas = [
    { nombre: "Café molido espresso",        unidad: "kg",           cantidad: 1.00, precio: 10.00, merma: 5.00,  tipo: "DIRECTA"   },
    { nombre: "Café en grano (moler)",        unidad: "kg",           cantidad: 1.00, precio: 12.00, merma: 8.00,  tipo: "DIRECTA"   },
    { nombre: "Leche entera",                 unidad: "litro",        cantidad: 1.00, precio: 1.50,  merma: 3.00,  tipo: "DIRECTA"   },
    { nombre: "Leche en polvo",               unidad: "kg",           cantidad: 1.00, precio: 5.20,  merma: 2.00,  tipo: "DIRECTA"   },
    { nombre: "Crema de leche",               unidad: "litro",        cantidad: 1.00, precio: 2.80,  merma: 5.00,  tipo: "DIRECTA"   },
    { nombre: "Chocolate en polvo / cacao",   unidad: "kg",           cantidad: 1.00, precio: 6.50,  merma: 3.00,  tipo: "DIRECTA"   },
    { nombre: "Sirope de chocolate",          unidad: "litro",        cantidad: 1.00, precio: 4.80,  merma: 5.00,  tipo: "DIRECTA"   },
    { nombre: "Agua purificada",              unidad: "litro",        cantidad: 1.00, precio: 0.75,  merma: 0.00,  tipo: "DIRECTA"   },
    { nombre: "Azúcar blanca",               unidad: "kg",           cantidad: 1.00, precio: 1.50,  merma: 1.00,  tipo: "INDIRECTA" },
    { nombre: "Vasos desechables 8 oz",       unidad: "paquete x100", cantidad: 100.00, precio: 4.00, merma: 2.00, tipo: "INDIRECTA" },
    { nombre: "Vasos desechables 12 oz",      unidad: "paquete x100", cantidad: 100.00, precio: 5.00, merma: 2.00, tipo: "INDIRECTA" },
    { nombre: "Vasos desechables 6 oz",       unidad: "paquete x100", cantidad: 100.00, precio: 3.00, merma: 1.00, tipo: "INDIRECTA" },
    { nombre: "Tapas para vasos",             unidad: "paquete x100", cantidad: 100.00, precio: 2.00, merma: 1.00, tipo: "INDIRECTA" },
    { nombre: "Servilletas",                  unidad: "paquete x200", cantidad: 200.00, precio: 2.00, merma: 2.00, tipo: "INDIRECTA" },
    { nombre: "Paletas agitadoras",           unidad: "paquete x100", cantidad: 100.00, precio: 1.00, merma: 1.00, tipo: "INDIRECTA" }
];

// ==========================================
// FUNCIÓN CENTRAL: CALCULAR TOTALES MPD Y MPI
// ==========================================
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

// ==========================================
// ACTUALIZAR TODOS LOS PANELES QUE MUESTRAN TOTALES MP
// ==========================================
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
}

// ==========================================
// CALCULAR COSTOS NETOS DE INSUMOS
// ==========================================
function obtenerCostoNetoUnitarioInsumo(item) {
    let cantidadUtilizable = item.cantidad * (1 - (item.merma / 100));
    if (cantidadUtilizable > 0) {
        return item.precio / cantidadUtilizable;
    }
    return 0;
}

// ==========================================
// RENDERIZADO TABLA MATERIA PRIMA
// ==========================================
function actualizarTablaMateria() {
    let tablaBody = document.getElementById("tabla_materia_prima");
    if (!tablaBody) return;

    tablaBody.innerHTML = "";

    materiasPrimas.forEach(function(item, index) {
        let costoNetoUnidad = obtenerCostoNetoUnitarioInsumo(item);
        let claseTipo = item.tipo === "DIRECTA" ? "tipo-directa" : "tipo-indirecta";

        let fila = `
            <tr>
                <td class="col-id">${index + 1}</td>
                <td class="col-nombre">${item.nombre}</td>
                <td class="col-unidad">${item.unidad}</td>
                <td class="col-cantidad">${item.cantidad.toFixed(2)}</td>
                <td class="col-precio">$${item.precio.toFixed(2)}</td>
                <td class="col-merma">${item.merma.toFixed(2)}%</td>
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

// ==========================================
// EDICIÓN DE MATERIA PRIMA
// ==========================================
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

function procesarFormularioMateria() {
    let nombre   = recuperarTexto("mat_nombre");
    let unidad   = recuperarTexto("mat_unidad");
    let cantidad = recuperarFloat("mat_cantidad");
    let precio   = recuperarFloat("mat_precio");
    let merma    = recuperarFloat("mat_merma");
    let tipo     = document.getElementById("mat_tipo").value;
    let indexEditar = parseInt(document.getElementById("mat_index_editar").value);

    if (nombre === "" || unidad === "" || isNaN(cantidad) || isNaN(precio) || isNaN(merma)) {
        alert("Por favor, complete todos los campos requeridos.");
        return;
    }

    let datosInsumo = { nombre, unidad, cantidad, precio, merma, tipo };

    if (indexEditar === -1) {
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
        materiasPrimas[indexEditar] = datosInsumo;
        materiasPrimas.sort(function(a, b) {
            if (a.tipo === "DIRECTA" && b.tipo === "INDIRECTA") return -1;
            if (a.tipo === "INDIRECTA" && b.tipo === "DIRECTA") return 1;
            return 0;
        });
        cancelarEdicionMateria();
    }

    limpiarFormularioMateria();
    actualizarTablaMateria();
}

function cancelarEdicionMateria() {
    document.getElementById("mat_index_editar").value = "-1";
    document.getElementById("formulario_titulo").innerText = "Agregar Nuevo Insumo";
    document.getElementById("btn_guardar_materia").innerText = "Guardar Insumo";
    document.getElementById("btn_guardar_materia").style.background = "var(--rosa-marca)";
    document.getElementById("btn_cancelar_edicion").style.display = "none";
    limpiarFormularioMateria();
}

function limpiarFormularioMateria() {
    mostrarTextoEnCaja("mat_nombre", "");
    mostrarTextoEnCaja("mat_unidad", "");
    mostrarTextoEnCaja("mat_cantidad", "");
    mostrarTextoEnCaja("mat_precio", "");
    mostrarTextoEnCaja("mat_merma", "");
}
