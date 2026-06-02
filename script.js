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
// FUNCIÓN: autocompletarSueldo
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
// Usa las mismas clases de color que la tabla de la imagen
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