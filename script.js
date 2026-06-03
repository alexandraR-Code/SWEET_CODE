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

    // --- Sección Materia Prima ---
    let elMPD = document.getElementById("total_materia_directa");
    let elMPI = document.getElementById("total_materia_indirecta");
    let elMPGeneral = document.getElementById("total_materia_general");
    if (elMPD) elMPD.innerText = convertirMoneda(mpd);
    if (elMPI) elMPI.innerText = convertirMoneda(mpi);
    if (elMPGeneral) elMPGeneral.innerText = convertirMoneda(combinado);

    // --- Sección Variables ---
    let elVarMPD = document.getElementById("var_total_mpd");
    let elVarMPI = document.getElementById("var_total_mpi");
    let elVarCombinado = document.getElementById("var_total_mp_combinado");
    let elVarResumenMP = document.getElementById("var_resumen_mp");
    if (elVarMPD) elVarMPD.innerText = convertirMoneda(mpd);
    if (elVarMPI) elVarMPI.innerText = convertirMoneda(mpi);
    if (elVarCombinado) elVarCombinado.innerText = convertirMoneda(combinado);
    if (elVarResumenMP) elVarResumenMP.innerText = convertirMoneda(combinado);

    // --- Sección Directos e Indirectos ---
    let elDirectosMPD = document.getElementById("directos_mpd");
    let elDirectosMPI = document.getElementById("directos_mpi");
    
    let totalFijos = 0;
    for (let i = 0; i < costosFijos.length; i++) {
        totalFijos = totalFijos + costosFijos[i].montoMensual;
    }
    if (elDirectosMPD) elDirectosMPD.innerText = convertirMoneda(mpd);
    if (elDirectosMPI) elDirectosMPI.innerText = convertirMoneda(mpi + totalFijos);
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
// RENDERIZADO TABLA MATERIA PRIMA (CSS CLEAN)
// ==========================================
function actualizarTablaMateria() {
    let tablaBody = document.getElementById("tabla_materia_prima");
    if (!tablaBody) return;

    // Limpiamos de forma segura el contenido previo de la tabla
    tablaBody.innerHTML = "";

    materiasPrimas.forEach(function(item, index) {
        // Calculamos el costo neto considerando la merma
        let costoNetoUnidad = obtenerCostoNetoUnitarioInsumo(item);
        
        // Asignamos la clase de color correspondiente según el tipo de materia prima
        let claseTipo = item.tipo === "DIRECTA" ? "tipo-directa" : "tipo-indirecta";

        // Estructura de la fila utilizando las clases semánticas de tu archivo CSS
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
        
        // Inyectamos la fila armada en el DOM
        tablaBody.innerHTML += fila;
    });

    // Ejecutamos las funciones de sincronización y actualización del sistema
    sincronizarTotalesMateriaPrima();
    actualizarPantallaRecetas();
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
    let nombre   = recuperaraTexto("mat_nombre");
    let unidad   = recuperaraTexto("mat_unidad");
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