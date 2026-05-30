function ocultarSecciones(){
  //Quitar la clase activa a todas las secciones por su id
  document.getElementById("fijos").classList.remove("activa");
  document.getElementById("variables").classList.remove("activa");
  document.getElementById("directos").classList.remove("activa");
  document.getElementById("materia").classList.remove("activa");
  document.getElementById("recetas").classList.remove("activa");
  document.getElementById("ganancias").classList.remove("activa");
  document.getElementById("equilibrio").classList.remove("activa");
}
//funcion que muestra solo la seccion cuyo id recibe como parametro 
function mostrarSeccion(id){
  //incovamos la funcion 
  ocultarSecciones(); 
  //Agregamos la clase activa solo a la seccion indicada
  document.getElementById(id).classList.add("activa");
}