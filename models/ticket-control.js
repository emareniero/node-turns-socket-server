// Importamos url y path para crear los directorios a donde guardar los archivos
import { fileURLToPath } from "url";
import path from "path";

// Importamos FileSystems para guardar arhivos en eel sistema
import fs from "fs";

// Creamos una constante para el directorio principal
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Importamos la info de la database
import * as data from "../db/data.json" assert { type: "json" };

// Creamos una clase ticket
class Ticket {
  // Creamos su constructor
  constructor(numero, escritorio) {
    // Este sera el numero que tendra cada ticket
    this.numero = numero;
    // Este sera el escritorio donde sera atendido
    this.escritorio = escritorio;
  }
}

// En esta clase vamos a gestionar los tickest
class TicketControl {
  // Ahora vamos a definir su contructor
  constructor() {
    // Este es el ultimo ticket que estoy atendiendo. Por el momento es 0 porque no esta almacenado en ningun lado aun
    this.ultimo = 0;

    // Ahora leemos la fecha de hoy. Esto es para sabr si lo que tenemos en la base de datos corresponde al dia de hoy
    this.hoy = new Date().getDate();

    // Con la siguiene variable vamos a manejar los tickets que estan pendientes
    this.tickets = [];

    // Ahora vamos a construir los ultimos 4 tickets que son los que se van a mostrar en la pantalla
    this.ultimos4 = [];

    // Iniciamos el constructor
    this.init();
  }

  // Aca definimos el get json de la bd
  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4
    };
  }

  // Con el siguiente metodo iniciamos el servidor
  init() {
    // Desestructuramos la data
    const { ultimo, hoy, tickets, ultimos4 } = data.default;

    // Revisamos que la fecha de los datos guardados coinciada con la fecha de hoy
    if (hoy === this.hoy) {
      // Si es asi cargamos los archivos que tenemos en la base de datos
      this.tickets = tickets;
      this.ultimo = ultimo;
      this.ultimos4 = ultimos4;
    } else {
      // En caso que no sea el mismo dia tomamos la instancia inicial del servidor del dia de hoy
      this.guardarDB();
    }
  }

  // Ahora vamos a grabar en la bd
  guardarDB() {
    // Creamos un directorio con la ubicacion donde queremos guardar los archivos
    const dbPath = path.join(__dirname, '../db/data.json');

    // Guardamos los archivos
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  siguiente() {
    // Sumamos un ticket al ultimo
    this.ultimo += 1;
    // creamos un nuevo ticket
    const ticket = new Ticket(this.ultimo, null);
    // Insertamos el ticke a nuestros tickets
    this.tickets.push(ticket);

    // Guardamos en la base de datos
    this.guardarDB();

    // devovlemos la info
    return "Ticket " + ticket.numero;
  }

  atenderTicket(escritorio) {
    // Vamos a suponer primero que no tenemos tikcts por atender
    if (this.tickets.length === 0) {
      return null;
    }

    // Si hay ticktes extraemos el que sigue en la fila
    const ticket = this.tickets[0];

    // Ahora borramos ese que trajimos
    this.tickets.shift();

    // Ahora le asignamos el escritorio a este ticket
    ticket.escritorio = escritorio;

    // Lo agregamos a los utlimos 4 tickets pero al inicio
    this.ultimos4.unshift(ticket);

    // validamos que esos tickets sean 4 realmente sino lo cortamos
    if (this.ultimos4.length > 4) {
      //en caso de duda ver documentacion del splice
      this.ultimos4.splice(-1, 1);
    }

    // giardamos
    this.guardarDB();

    // devolvemos el ticket atendiendo
    return ticket;
  }
}

export { TicketControl };
