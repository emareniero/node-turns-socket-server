// Dejo aca las referencias al HTMl
const lvlEscritorio = document.querySelector("h1"); // No le pongo id porque se que es el primer h1 que encuentre
const btnAtender = document.querySelector("button"); // Lo mismo que arriba sin ide por ser el unico que hay
const lblTicket = document.querySelector('small'); // mimas logica de arriba
const divAlerta = document.querySelector('.alert'); // primera clase que aparece con alert!
const lblPendientes = document.querySelector('#lblPendientes'); // Este es l contadora de pendientes

// Vamos primero a definir una constante para ubicar los parametros. Esto solo funciona en chrome y firefox
const searchParams = new URLSearchParams(window.location.search);

// Ahora vamos a verificar si en los parametros del url existe la palabra escritorio
if (!searchParams.has("escritorio")) {
  // Si estamos aca, es porque no existe y debemos lanzar un error y ademas regreas al usuario al index.html
  window.location = "index.html";
  throw new Error("El escritorio es obligatorio!");
}

// Ahora vamos a identificar en que escritorio me encuentro
const escritorio = searchParams.get("escritorio");

// Le mandamos el escritorio al titulo del html
lvlEscritorio.innerText = escritorio;

// Ocultamos la alerta que dice que ya no hay mas tickest
divAlerta.style.display = 'none'

const socket = io();

socket.on("connect", () => {
  // Si el servidor esta conectado dejo el boton activo
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  // Si el servidor esta desconectado desactivo el boton
  btnAtender.disabled = true;
});

// Creamos el listener para los tickets pendientes y se lo pasamos al html
socket.on('tickets-pendients', (ticketsPendients) => {

  // Si no hay pendientos mandamos la alerta
  if (lblPendientes === 0 ){
    lblPendientes.style.display = 'none'
  } else {
    lblPendientes.style.display = ''
    lblPendientes.innerText = ticketsPendients;
  }

})

btnAtender.addEventListener("click", () => {
 
    // Definimos ahora la informacion que queremos enviar al backend a traves de un socket 
    // y ya dessetructuro el payloaddd
    socket.emit( 'atender-ticket', { escritorio }, ( { ok, ticket, msg }) => {

        // Si no hay mas tickets mostramos la alerta que no hay mas tickets por atender
        if ( !ok ) {
            lblTicket.innerText = ' nadie!'
            return divAlerta.style.display = '';
        }

        // Si llegamos aca es porque hay tickets por atender y avisamos cual estaamos atendiendo
        lblTicket.innerText = 'Ticket ' + ticket.numero;

        

    })


});
