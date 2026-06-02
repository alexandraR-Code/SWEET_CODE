function recuperarTexto(idComponente) {
    let componente;
    let valorIngresado;
    componente = document.getElementById(idComponente);

    // Verificamos que el elemento realmente existe antes de leerlo
    if (componente === null) {
        console.error("No se encontró el elemento con id: " + idComponente);
        return "";  // Devolvemos texto vacío para no romper el resto del programa
    }

    valorIngresado = componente.value;
    return valorIngresado;
}

function recuperarInt(idComponente) {
    let valorCaja = recuperarTexto(idComponente);
    let valorEntero = parseInt(valorCaja);
    return valorEntero;
}
function recuperarFloat(idComponente) {
    let valorCaja = recuperarTexto(idComponente);
    let valorFlotante = parseFloat(valorCaja);
    return valorFlotante;
}
function mostrarTexto(idComponente, mensaje) {
    let componente;
    componente = document.getElementById(idComponente);
    componente.innerText = mensaje;
}
function mostrarTextoEnCaja(idComponente, mensaje) {
    let componente;
    componente = document.getElementById(idComponente);
    componente.value = mensaje;
}

function mostrarImagen(idComponente, rutaImagen) {
    let componente;
    componente = document.getElementById(idComponente);
    componente.src = rutaImagen;

}
function recuperarElemento(idComponente) {
    let componente;
    componente = document.getElementById(idComponente);
    return componente;
}
function recuperarFloatSeguro(idComponente) {
    let valor = recuperarFloat(idComponente);
    if (isNaN(valor)) { return 0; }
    return valor;
}
function convertirMoneda(valor) {
    // Verificamos que sea un número válido antes de formatear
    if (isNaN(valor) || valor === null || valor === undefined) {
        return "$0.00";  // Valor seguro por defecto
    }
    return "$" + valor.toFixed(2);
}