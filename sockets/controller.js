import { TicketControl } from "../models/ticket-control.js";

const ticketControl = new TicketControl();

const socketController = (socket) => {
  /**
   *  Cada uno de los socket se ejecutan cuando un cliente se conecta
   */

  // Enviamos el ultimo ticket a la persona que llega
  socket.emit("ultimo-ticket", ticketControl.ultimo);

  // Creamos el evento para saber ucantos tickets hay pendientes de atender
  socket.emit("tickets-pendients", ticketControl.tickets.length);

  // Ni bien se conecta el socket mostramos el estado actual de los tickets en cola si hay
  socket.emit("estado-actual", ticketControl.ultimos4);

  // Mostrmos los tickets que hay en espera
  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);

    // TODO: Notificar que hay un ticket petndiente de asignar
    socket.broadcast.emit("tickets-pendients", ticketControl.tickets.length);
  });

  // Esuchamos el evento de atender ticket en el backend y ya desestructuro el escritorio del payload
  socket.on("atender-ticket", ({ escritorio }, callback) => {
    // tenemos que retonar un aviso si el escritorio no viene
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es obligatorio!",
      });
    }

    // Le enviamos el ticket al atenderTicket de la clase TicketControl
    const ticket = ticketControl.atenderTicket(escritorio);

    // Notificar cambio en los ultimos4 porque ya se atendio a una persona y otra nueva debe aparecer si hay
    socket.broadcast.emit("estado-actual", ticketControl.ultimos4);

    // TODO: Notificar que hay un ticket petndiente de asignar
    socket.broadcast.emit("tickets-pendients", ticketControl.tickets.length);// TODO: Notificar que hay un ticket petndiente de asignar a todos
    socket.emit("tickets-pendients", ticketControl.tickets.length); // Al emisor

    // tommos acciones si el ticket n existe y damos avisa que no hya nada por atender
    if (!ticket) {
      callback({
        ok: false,
        msg: "Ya no hay tickets pendientes!",
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

export { socketController };
