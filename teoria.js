function ocultarSecciones(){
  //Quitar la clase activa a todas las secciones por su id
  document.getElementById("fijos").classList.remove("activa");
  document.getElementById("variables").classList.remove("activa");
  document.getElementById("directos").classList.remove("activa");
  document.getElementById("materia").classList.remove("activa");
  document.getElementById("recetas").classList.remove("activa");
  document.getElementById("ganancias").classList.remove("activa");
  document.getElementById("equilibrio").classList.remove("activa");
  document.getElementById("personal").classList.remove("activa");
}
//funcion que muestra solo la seccion cuyo id recibe como parametro 
function mostrarSeccion(id){
  //incovamos la funcion 
  ocultarSecciones(); 
  //Agregamos la clase activa solo a la seccion indicada
  document.getElementById(id).classList.add("activa");
  
  // SI la sección que se va a mostrar es 'materia', inyectamos su teoría
  if (id === "materia") {
      document.getElementById("bloque_explicacion_materia").innerHTML = explicacionMateriaPrimaHTML;
  }
  
  // En el futuro, aquí podrás añadir más condiciones para las otras pestañas:
  // if (id === "recetas") { ... }
}

// MATERIA PRIMA

const explicacionMateriaPrimaHTML = `
    <p>
        <strong>¿Qué es la Materia Prima?</strong> Comprende todos los recursos e insumos primarios adquiridos por la cafetería para ser sometidos a un proceso de transformación operativa o consumo directo, con el objetivo de estructurar los productos finales destinados a la venta. En la contabilidad de costos, su correcto control e inventario son fundamentales para determinar la rentabilidad real del negocio.
    </p>
    <ul>
        <li><strong>Materia Prima Directa (MPD):</strong> Representa los componentes esenciales que se integran de forma física, medible y principal en la elaboración de cada taza o producto terminado (Ej: Café en grano/molido, leche, agua filtrada, jarabes esenciales). Su costo es directamente asignable al producto unitario.</li>
        <li><strong>Materia Prima Indirecta (MPI):</strong> Constituye el conjunto de materiales y suministros complementarios que, aunque no forman parte física del contenido consumible, son indispensables para la presentación, el expendio y el servicio comercial al cliente (Ej: Vasos descartables, tapas, pajillas, servilletas). Se distribuyen como costos indirectos de fabricación.</li>
    </ul>
`;

// Aquí puedes seguir ordenando tus otros bloques teóricos en el futuro...
const explicacionRecetasHTML = `...`;
const explicacionCostosFijosHTML = `...`;