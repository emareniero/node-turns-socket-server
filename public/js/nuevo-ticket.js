// Referncias HTML
const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnCrear = document.querySelector("button"); // Aca no voy por id por que es el unico boton que hay!

const socket = io();

socket.on("connect", () => {
  // Si el servidor esta conectado dejo el boton activo
  btnCrear.disabled = false;
});

socket.on("disconnect", () => {
  // Si el servidor esta desconectado desactivo el boton
  btnCrear.disabled = true;
});

// Creamos un listener aca para escuchar el ultimo ticket y ya estamos hechos unos campeones
socket.on("ultimo-ticket", (ultimoTicket) => {
  // Se lo agregamos donde corresponde en nuestro html
  lblNuevoTicket.innerText = "Ticket " + ultimoTicket;
});

btnCrear.addEventListener("click", () => {
  // Como no tengo payload envio null. Aca enviamos el tiket al html de neuvo ticket
  socket.emit("siguiente-ticket", null, (ticket) => {
    lblNuevoTicket.innerText = ticket;
  });
});
