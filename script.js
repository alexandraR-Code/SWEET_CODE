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
   
    // Calcular total de merma en dinero
    let totalMerma = 0;
    for (let i = 0; i < materiasPrimas.length; i++) {
        totalMerma += materiasPrimas[i].precio * (materiasPrimas[i].merma / 100);
    }
    let elMerma = document.getElementById("total_merma_dinero");
    if (elMerma) elMerma.innerText = convertirMoneda(totalMerma);

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

// RECETAS Y COSTOS 
// ==========================================
// ESTRUCTURA BASE DE RECETAS
// ==========================================
let recetasBase = [
    {
        idReceta: 0,
        nombreReceta: "ESPRESSO",
        tiempoPreparacion: 3,
        numeroPorciones: 1,
        ingredientes: [
            { buscarNombre: "Café molido espresso",  cantidadReceta: 7.00,  unidadReceta: "gramos",  esConversion: true  },
            { buscarNombre: "Agua purificada",        cantidadReceta: 30.00, unidadReceta: "ml",      esConversion: true  },
            { buscarNombre: "Vasos desechables 6 oz", cantidadReceta: 1.00,  unidadReceta: "unidad",  esConversion: false },
            { buscarNombre: "Tapas para vasos",       cantidadReceta: 1.00,  unidadReceta: "unidad",  esConversion: false },
            { buscarNombre: "Paletas agitadoras",     cantidadReceta: 1.00,  unidadReceta: "unidad",  esConversion: false },
            { buscarNombre: "Servilletas",            cantidadReceta: 1.00,  unidadReceta: "unidad",  esConversion: false }
        ]
    },
    {
        idReceta: 1,
        nombreReceta: "CAFÉ AMERICANO",
        tiempoPreparacion: 4,
        numeroPorciones: 1,
        ingredientes: [
            { buscarNombre: "Café molido espresso",  cantidadReceta: 7.00,   unidadReceta: "gramos", esConversion: true  },
            { buscarNombre: "Agua purificada",        cantidadReceta: 150.00, unidadReceta: "ml",     esConversion: true  },
            { buscarNombre: "Vasos desechables 6 oz", cantidadReceta: 1.00,   unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Tapas para vasos",       cantidadReceta: 1.00,   unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Paletas agitadoras",     cantidadReceta: 1.00,   unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Servilletas",            cantidadReceta: 1.00,   unidadReceta: "unidad", esConversion: false }
        ]
    },
    {
        idReceta: 2,
        nombreReceta: "CAFÉ CON LECHE",
        tiempoPreparacion: 5,
        numeroPorciones: 1,
        ingredientes: [
            { buscarNombre: "Café molido espresso",  cantidadReceta: 7.00,   unidadReceta: "gramos", esConversion: true  },
            { buscarNombre: "Leche entera",           cantidadReceta: 150.00, unidadReceta: "ml",     esConversion: true  },
            { buscarNombre: "Azúcar blanca",         cantidadReceta: 10.00,  unidadReceta: "gramos", esConversion: true  },
            { buscarNombre: "Vasos desechables 6 oz", cantidadReceta: 1.00,   unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Tapas para vasos",       cantidadReceta: 1.00,   unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Paletas agitadoras",     cantidadReceta: 1.00,   unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Servilletas",            cantidadReceta: 1.00,   unidadReceta: "unidad", esConversion: false }
        ]
    },
    {
        idReceta: 3,
        nombreReceta: "CAPPUCCINO",
        tiempoPreparacion: 6,
        numeroPorciones: 1,
        ingredientes: [
            { buscarNombre: "Café molido espresso",        cantidadReceta: 7.00,  unidadReceta: "gramos", esConversion: true  },
            { buscarNombre: "Leche entera",                cantidadReceta: 120.00, unidadReceta: "ml",    esConversion: true  },
            { buscarNombre: "Crema de leche",              cantidadReceta: 30.00, unidadReceta: "ml",     esConversion: true  },
            { buscarNombre: "Azúcar blanca",              cantidadReceta: 10.00, unidadReceta: "gramos",  esConversion: true  },
            { buscarNombre: "Chocolate en polvo / cacao",  cantidadReceta: 2.00,  unidadReceta: "gramos", esConversion: true  },
            { buscarNombre: "Vasos desechables 6 oz",      cantidadReceta: 1.00,  unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Tapas para vasos",            cantidadReceta: 1.00,  unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Paletas agitadoras",          cantidadReceta: 1.00,  unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Servilletas",                 cantidadReceta: 1.00,  unidadReceta: "unidad", esConversion: false }
        ]
    },
    {
        idReceta: 4,
        nombreReceta: "MOCACHINO",
        tiempoPreparacion: 7,
        numeroPorciones: 1,
        ingredientes: [
            { buscarNombre: "Café molido espresso",  cantidadReceta: 7.00,  unidadReceta: "gramos", esConversion: true  },
            { buscarNombre: "Leche entera",           cantidadReceta: 120.00, unidadReceta: "ml",   esConversion: true  },
            { buscarNombre: "Sirope de chocolate",    cantidadReceta: 20.00, unidadReceta: "ml",     esConversion: true  },
            { buscarNombre: "Crema de leche",         cantidadReceta: 30.00, unidadReceta: "ml",     esConversion: true  },
            { buscarNombre: "Azúcar blanca",         cantidadReceta: 10.00, unidadReceta: "gramos",  esConversion: true  },
            { buscarNombre: "Vasos desechables 6 oz", cantidadReceta: 1.00,  unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Tapas para vasos",       cantidadReceta: 1.00,  unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Paletas agitadoras",     cantidadReceta: 1.00,  unidadReceta: "unidad", esConversion: false },
            { buscarNombre: "Servilletas",            cantidadReceta: 1.00,  unidadReceta: "unidad", esConversion: false }
        ]
    }
];
// ==========================================
// RENDERIZADO DE LAS TABLAS DE RECETAS
// ==========================================
function actualizarPantallaRecetas() {
    let contenedor = document.getElementById("contenedor_recetas_dinamicas");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    recetasBase.forEach(function(receta, rIndex) {
        let tablaHTML = `
            <div class="receta-card" style="background: var(--bg-tarjetas); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                    <h3 style="color: var(--rosa-marca); font-size: 1.3rem; text-transform: uppercase; margin: 0;">${receta.nombreReceta}</h3>
                    <div style="background: rgba(56, 189, 248, 0.1); padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.85rem; color: var(--celeste-tech);">
                        <strong>Tiempo prep.:</strong> ${receta.tiempoPreparacion} min | <strong>Porciones (Tazas):</strong> ${receta.numeroPorciones}
                    </div>
                </div>
                <table style="width: 100%; border-collapse: collapse; text-align: left; margin-top: 1rem;">
                    <thead style="background: rgba(56, 189, 248, 0.1); color: var(--celeste-tech);">
                        <tr>
                            <th style="padding: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.1); width: 40px;">#</th>
                            <th style="padding: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.1);">Ingrediente / Insumo Base</th>
                            <th style="padding: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.1); width: 110px; text-align: center;">Cantidad</th>
                            <th style="padding: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.1); width: 110px;">Unidad</th>
                            <th style="padding: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.1); width: 130px; text-align: right;">Costo/Ud ($)</th>
                            <th style="padding: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.1); width: 130px; text-align: right;">Subtotal ($)</th>
                            <th style="padding: 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.1); width: 90px; text-align: center;">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        let totalMateriaPrimaReceta = 0;

        receta.ingredientes.forEach(function(ingrediente, iIndex) {
            let insumoEncontrado = materiasPrimas.find(function(m) {
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
                totalMateriaPrimaReceta += subtotalCalculado;
            }

            tablaHTML += `
                <tr>
                    <td style="padding: 0.5rem 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--texto-gris);">${iIndex + 1}</td>
                    <td style="padding: 0.5rem 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: white; font-weight: 500;">${ingrediente.buscarNombre}</td>
                    <td style="padding: 0.5rem 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: center; color: var(--celeste-tech); font-weight: bold;">${ingrediente.cantidadReceta.toFixed(2)}</td>
                    <td style="padding: 0.5rem 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--texto-gris); font-style: italic;">${ingrediente.unidadReceta}</td>
                    <td style="padding: 0.5rem 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: right; color: var(--texto-gris);">$${costoUnitarioCalculado.toFixed(4)}</td>
                    <td style="padding: 0.5rem 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: right; color: white; font-weight: 500;">$${subtotalCalculado.toFixed(4)}</td>
                    <td style="padding: 0.5rem 0.6rem; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: center;">
                        <button onclick="cargarIngredienteParaEditar(${rIndex}, ${iIndex})" style="background: transparent; border: 1px solid var(--rosa-marca); color: var(--rosa-marca); padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.75rem; font-weight: bold;">Editar</button>
                    </td>
                </tr>
            `;
        });

        tablaHTML += `
                    </tbody>
                    <tfoot>
                        <tr style="background: rgba(16, 185, 129, 0.05);">
                            <td colspan="5" style="padding: 0.8rem; text-align: right; font-weight: bold; color: #10b981; text-transform: uppercase;">Total Costo por Taza:</td>
                            <td colspan="2" style="padding: 0.8rem; text-align: left; padding-left: 2.5rem; font-weight: bold; color: #10b981; font-size: 1.1rem;">$${totalMateriaPrimaReceta.toFixed(4)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;

        contenedor.innerHTML += tablaHTML;
    });
}

// ==========================================
// EDICIÓN DE INGREDIENTE EN RECETA
// ==========================================
function cargarIngredienteParaEditar(recetaIndex, ingredienteIndex) {
    let receta = recetasBase[recetaIndex];
    let ingrediente = receta.ingredientes[ingredienteIndex];

    mostrarTextoEnCaja("receta_ingrediente_nombre", ingrediente.buscarNombre);
    mostrarTextoEnCaja("receta_ingrediente_cantidad", ingrediente.cantidadReceta);
    mostrarTextoEnCaja("receta_ingrediente_unidad", ingrediente.unidadReceta);
    mostrarTextoEnCaja("receta_tiempo", receta.tiempoPreparacion);
    mostrarTextoEnCaja("receta_porciones", receta.numeroPorciones);

    document.getElementById("receta_id_editar").value = recetaIndex;
    document.getElementById("ingrediente_id_editar").value = ingredienteIndex;

    document.getElementById("formulario_edicion_receta").style.display = "block";
    document.getElementById("receta_formulario_titulo").innerText = "Modificando Insumo de la Receta: " + receta.nombreReceta;
    document.getElementById("formulario_edicion_receta").scrollIntoView({ behavior: 'smooth' });
}

function guardarCambiosParametrosReceta() {
    let rIndex = parseInt(document.getElementById("receta_id_editar").value);
    let iIndex = parseInt(document.getElementById("ingrediente_id_editar").value);

    let nuevaCantidad = recuperarFloat("receta_ingrediente_cantidad");
    let nuevaUnidad = recuperarTexto("receta_ingrediente_unidad");
    let nuevoTiempo = recuperarInt("receta_tiempo");
    let nuevasPorciones = recuperarInt("receta_porciones");

    if (isNaN(nuevaCantidad) || nuevaUnidad === "" || isNaN(nuevoTiempo) || isNaN(nuevasPorciones)) {
        alert("Por favor, rellene todos los campos con valores válidos.");
        return;
    }

    recetasBase[rIndex].tiempoPreparacion = nuevoTiempo;
    recetasBase[rIndex].numeroPorciones = nuevasPorciones;
    recetasBase[rIndex].ingredientes[iIndex].cantidadReceta = nuevaCantidad;
    recetasBase[rIndex].ingredientes[iIndex].unidadReceta = nuevaUnidad;

    cancelarEdicionParametrosReceta();
    actualizarPantallaRecetas();
}

function cancelarEdicionParametrosReceta() {
    document.getElementById("receta_id_editar").value = "-1";
    document.getElementById("ingrediente_id_editar").value = "-1";
    document.getElementById("formulario_edicion_receta").style.display = "none";
    mostrarTextoEnCaja("receta_ingrediente_nombre", "");
    mostrarTextoEnCaja("receta_ingrediente_cantidad", "");
    mostrarTextoEnCaja("receta_ingrediente_unidad", "");
    mostrarTextoEnCaja("receta_tiempo", "");
    mostrarTextoEnCaja("receta_porciones", "");
}

// ==========================================================
// ARREGLO DE COSTOS FIJOS (Sin la propiedad de notas)
// ==========================================================
let costosFijos = [
    { concepto: "Sueldo barista",          categoria: "Personal",                frecuencia: "Mensual", montoMensual: 0.00,  inputId: "fijo_barista" },
    { concepto: "Sueldo cajera",           categoria: "Personal",                frecuencia: "Mensual", montoMensual: 0.00,  inputId: "fijo_cajera" },
    { concepto: "Arriendo del local",      categoria: "Infraestructura",         frecuencia: "Mensual", montoMensual: 350.00,  inputId: "fijo_arriendo" },
    { concepto: "Sueldo administrador",    categoria: "Personal",                frecuencia: "Mensual", montoMensual: 0.00, inputId: "fijo_admin" },
    { concepto: "Depreciación maquinaria", categoria: "Activos fijos",           frecuencia: "Mensual", montoMensual: 50.00,   inputId: "fijo_depreciacion" },
    { concepto: "Electricidad",            categoria: "Servicios básicos",       frecuencia: "Mensual", montoMensual: 10.00,   inputId: "fijo_electricidad" },
    { concepto: "Agua potable",            categoria: "Servicios básicos",       frecuencia: "Mensual", montoMensual: 15.00,   inputId: "fijo_agua" },
    { concepto: "Internet y teléfono",     categoria: "Servicios básicos",       frecuencia: "Mensual", montoMensual: 35.00,   inputId: "fijo_internet" },
    { concepto: "Honorarios contabilidad", categoria: "Servicios profesionales", frecuencia: "Mensual", montoMensual: 50.00,   inputId: "fijo_contabilidad" },
    { concepto: "Seguros",                 categoria: "Gastos legales",          frecuencia: "Mensual", montoMensual: 30.00,   inputId: "fijo_seguro" },
    { concepto: "Licencias y permisos",    categoria: "Gastos legales",          frecuencia: "Mensual", montoMensual: 12.00,   inputId: "fijo_licencias" },
    { concepto: "Publicidad fija",         categoria: "Marketing",               frecuencia: "Mensual", montoMensual: 30.00,   inputId: "fijo_publicidad" }
];

// ==========================================================
// FUNCIÓN AUXILIAR: Sumar el costo total por cargo desde Mano de Obra
// ==========================================================
function obtenerCostoTotalPorCargo(cargo) {
    let total = 0;
    for (let j = 0; j < listaEmpleados.length; j++) {
        // Validación flexible por si se registra como "Cajero" o "Cajera"
        if (listaEmpleados[j].cargo.toLowerCase() === cargo.toLowerCase() || 
            (cargo.toLowerCase() === "cajera" && listaEmpleados[j].cargo.toLowerCase() === "cajero")) {
            total += listaEmpleados[j].costoTotal;
        }
    }
    return total;
}

// ==========================================================
// RENDERIZADO TABLA COSTOS FIJOS
// ==========================================================
function actualizarTablaCostosFijos() {
    let tablaBody = document.getElementById("tabla_costos_fijos");
    if (!tablaBody) return;

    let tfootViejo = tablaBody.parentElement.querySelector("tfoot");
    if (tfootViejo) { tfootViejo.remove(); }

    // DINÁMICO: Antes de calcular, actualiza los montos desde la lista de mano de obra
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

        // Se removió por completo el TD de las notas
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
// Se eliminó un TD vacío del final para equilibrar el total de columnas (ahora son 8 en total)
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

// ==========================================================
// GUARDAR / EDITAR COSTOS FIJO (Sin leer ni procesar notas)
// ==========================================================
function guardarCostosFijo() {
    let nombre    = recuperarTexto("fijo_nombre");
    let categoria = recuperarTexto("fijo_categoria");
    let valor     = recuperarFloatSeguro("fijo_valor");
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

function cargarFijoParaEditar(index) {
    let item = costosFijos[index];
    mostrarTextoEnCaja("fijo_nombre",    item.concepto);
    mostrarTextoEnCaja("fijo_categoria", item.categoria);
    mostrarTextoEnCaja("fijo_valor",     item.montoMensual);
    
    document.getElementById("fijo_index_editar").value = index;
    document.getElementById("fijo_formulario_titulo").innerText = "Modificar Gasto Fijo";
    
    let btnGuardar = document.getElementById("btn_guardar_fijo");
    btnGuardar.innerText = "Guardar Cambios";
    btnGuardar.style.backgroundColor = "#10b981"; 
    
    document.getElementById("btn_cancelar_fijo").style.display = "inline-block";
    document.getElementById("fijo_formulario_titulo").scrollIntoView({ behavior: "smooth" });
}

function cancelarEdicionFijo() {
    document.getElementById("fijo_index_editar").value = "-1";
    document.getElementById("fijo_formulario_titulo").innerText = "Agregar Nuevo Gasto Fijo";
    
    let btnGuardar = document.getElementById("btn_guardar_fijo");
    btnGuardar.innerText = "Guardar Gasto Fijo";
    btnGuardar.style.backgroundColor = "var(--rosa-marca)";
    
    document.getElementById("btn_cancelar_fijo").style.display = "none";
    limpiarFormularioFijo();
}

function limpiarFormularioFijo() {
    mostrarTextoEnCaja("fijo_nombre",    "");
    mostrarTextoEnCaja("fijo_categoria", "");
    mostrarTextoEnCaja("fijo_valor",     "");
}

// ============================================================
// ARREGLO DE COSTOS VARIABLES OPERATIVOS
// ============================================================
let costosVariables = [
    { concepto: "Materia Prima Directa (MPD)", monto: 0, esAutomatico: true },
    { concepto: "Materia Prima Indirecta (MPI)", monto: 0, esAutomatico: true },
    { concepto: "Merma en Dinero", monto: 0, esAutomatico: true },
    // Los manuales inician aquí abajo:
    { concepto: "Servicio de electricidad", monto: 45.00, esAutomatico: false },
    { concepto: "Suministros de limpieza", monto: 18.00, esAutomatico: false }
];

// Helper inteligente para extraer números limpios desde el DOM de Materia Prima
function obtenerValorDeMateria(idsPosibles) {
    for (let id of idsPosibles) {
        let el = document.getElementById(id);
        if (el) {
            let texto = el.innerText || el.value || "0";
            let valor = parseFloat(texto.replace(/[^0-9.-]/g, ""));
            if (!isNaN(valor)) return valor;
        }
    }
    return 0; // Fallback seguro por si no encuentra el elemento
}

// ============================================================
// RENDERIZAR TABLA DE COSTOS VARIABLES
// ============================================================
function actualizarTablaCostosVariables() {
    let tablaBody = document.getElementById("tabla_costos_variables");
    if (!tablaBody) return;

    // Sincronización con los IDs corregidos de Materia Prima
    costosVariables[0].monto = obtenerValorDeMateria(["total_mpd", "total_materia_directa", "mpd_total"]);
    costosVariables[1].monto = obtenerValorDeMateria(["total_mpi", "total_materia_indirecta", "mpi_total"]);
    costosVariables[2].monto = obtenerValorDeMateria(["total_merma_dinero", "total_merma", "merma_total"]);

    tablaBody.innerHTML = "";
    let totalMensualVariables = 0;

    // Iteración sobre los rubros (Ahora renderiza 3 columnas)
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

    // Actualización del tfoot (Ajustado a la nueva estructura de 3 columnas)
    let tfootViejo = tablaBody.parentElement.querySelector("tfoot");
    if (tfootViejo) { tfootViejo.remove(); }

    let tfoot = document.createElement("tfoot");
    tfoot.className = "bg-total-row";
    tfoot.innerHTML = `
        <tr>
            <td class="font-bold" style="padding: 1rem;">TOTAL COSTOS VARIABLES MENSUALES</td>
            <td class="text-center font-bold text-verde" style="padding: 1rem;">$${totalMensualVariables.toFixed(2)}</td>
            <td></td>
        </tr>
    `;
    tablaBody.parentElement.appendChild(tfoot);

    // Indicador visual del total en la interfaz
    let resumenCV = document.getElementById("var_resumen_total");
    if (resumenCV) {
        resumenCV.innerText = `$${totalMensualVariables.toFixed(2)}`;
    }
}

// ============================================================
// FUNCIONES DE EDICIÓN PARA RUBROS MANUALES
// ============================================================
function cargarVariableParaEditar(index) {
    let item = costosVariables[index];
    if (item.esAutomatico) return; // Validación de seguridad

    document.getElementById("variable_index_editar").value = index;
    mostrarTextoEnCaja("variable_nombre", item.concepto);
    mostrarTextoEnCaja("variable_valor", item.monto);
    mostrarTextoEnCaja("variable_notas", item.notas);

    document.getElementById("contenedor_formulario_variable").style.display = "block";
    document.getElementById("contenedor_formulario_variable").scrollIntoView({ behavior: "smooth" });
}

function guardarCambiosVariable() {
    let index = parseInt(document.getElementById("variable_index_editar").value);
    if (index === -1) return;

    let nuevoMonto = recuperarFloatSeguro("variable_valor");
    let nuevasNotas = recuperarTexto("variable_notas");

    costosVariables[index].monto = nuevoMonto;
    costosVariables[index].notas = nuevasNotas;

    cancelarEdicionVariable();
    actualizarTablaCostosVariables();
}

function cancelarEdicionVariable() {
    document.getElementById("variable_index_editar").value = "-1";
    document.getElementById("contenedor_formulario_variable").style.display = "none";
}

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
        // AGREGAR NUEVO GASTO VARIABLE MANUAL
        costosVariables.push({
            concepto: nombre,
            monto: valor,
            esAutomatico: false
        });
    } else {
        // MODIFICAR EXISTENTE
        if (costosVariables[indexEditar].esAutomatico) {
            alert("Este rubro es automático y no se puede modificar manualmente.");
            cancelarEdicionVariable();
            return;
        }
        costosVariables[indexEditar].concepto = nombre;
        costosVariables[indexEditar].monto = valor;
    }

    cancelarEdicionVariable(); // Limpia y restablece el formulario
    actualizarTablaCostosVariables(); // Recarga la tabla con los nuevos datos
}

function cargarVariableParaEditar(index) {
    let item = costosVariables[index];
    
    // Control de seguridad por si intentan forzar la edición de un automático
    if (item.esAutomatico) {
        alert("Este rubro se calcula automáticamente desde la sección de Materia Prima.");
        return;
    }

    // Inyectar datos en el formulario
    mostrarTextoEnCaja("variable_nombre", item.concepto);
    mostrarTextoEnCaja("variable_valor", item.monto);
    
    document.getElementById("variable_index_editar").value = index;
    document.getElementById("variable_formulario_titulo").innerText = "Modificar Costo Variable";
    
    // Cambiar aspecto del botón a modo edición (Verde)
    let btnGuardar = document.getElementById("btn_guardar_variable");
    if (btnGuardar) {
        btnGuardar.innerText = "Guardar Cambios";
        btnGuardar.style.backgroundColor = "#10b981"; 
    }
    
    // Mostrar botón cancelar
    let btnCancelar = document.getElementById("btn_cancelar_variable");
    if (btnCancelar) btnCancelar.style.display = "inline-block";
    
    // Scroll suave al formulario
    document.getElementById("variable_formulario_titulo").scrollIntoView({ behavior: "smooth" });
}

function cancelarEdicionVariable() {
    // Restablecer valores de control
    document.getElementById("variable_index_editar").value = "-1";
    document.getElementById("variable_formulario_titulo").innerText = "Agregar Nuevo Costo Variable";
    
    // Cambiar aspecto del botón a modo registrar (Rosa de tu marca)
    let btnGuardar = document.getElementById("btn_guardar_variable");
    if (btnGuardar) {
        btnGuardar.innerText = "Guardar Costo Variable";
        btnGuardar.style.backgroundColor = "var(--rosa-marca)";
    }
    
    // Ocultar botón cancelar
    let btnCancelar = document.getElementById("btn_cancelar_variable");
    if (btnCancelar) btnCancelar.style.display = "none";
    
    // Limpiar cajas de texto
    mostrarTextoEnCaja("variable_nombre", "");
    mostrarTextoEnCaja("variable_valor", "");
}