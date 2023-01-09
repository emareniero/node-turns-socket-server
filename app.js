// Importamos el servidor desde nuestro server
import { Servidor } from "./models/server.js";

// Creamos una nueva instancia del servidor
const server = new Servidor();

// ejecutamos el listen del servidor para que empiece a escuchar
server.listen();
