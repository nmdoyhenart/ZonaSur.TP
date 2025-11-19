# Proyecto Final Programación III - Nicolás Doyhenart, Bautista Elena

# Nota final: 10/10

Sistema web para la compra de autos y motos.
Consta de un backend en **Node.js/Express** y un frontend estático con **HTML**, **CSS** y **JavaScript**.

---

## Concesionaria de Autos | ZonaSur Cars 🚗
![image alt](https://github.com/nmdoyhenart/ZonaSur.TP/blob/5b273233904dbcdd30276bde5677a4b1d1981da6/image.png)
![image alt](https://github.com/nmdoyhenart/ZonaSur.TP/blob/3645a1c1fe072446b9f2109cb0a2cc2897000b7b/dashboiar.png)
---

## Requisitos

- Node.js y npm
- MongoDB (para la base de datos)
- Archivo `.env` con las variables de entorno necesarias

---

## Instalación

1. Clonar el repositorio.

2. Dentro del directorio `backend` instalar las dependencias:

   ```bash
   cd backend
   npm install
   ```
---

## Ejecución

Desde la carpeta `backend`:

```bash
npm run dev  # inicia el servidor con nodemon
```

Luego el servidor quedará accesible en `http://localhost:PORT`.

---

## Estructura del proyecto

```
backend/
  server.js
  package.json
  scriptAdmin.js
  src/
      controllers/   # logica del usuario, administrador y los vehiculos de la pagina
      middlewares/   # middlewares de Node.js
      models/        # models de usuario, administrador y los vehiculos de la pagina
      routes/        # rutas de la API
frontend/
  assets/
        css/         # estilos para el front
        js/          # scripts del programa
  img/               # imagenes utilizadas en el programa
  pages/             # todos los archivos .html
```

---

## 🧾 Flujo del Usuario

### 👤 Cliente:
1. Ingresa su nombre.
2. Redirecciona a la pagina principal con el stock.
3. Filtra por Autos y Motos.
4. Selecciona el vehiculo que desea reservar.
5. Se agrega al carrito.
6. Confirma la reserva del vehiculo.
7. Obtiene un archivo PDF con los datos de la reserva.

## 🔐 Administrador:
1. Inicia sesión.
2. Redirecciona al panel de Admnistradores.
3. Agrega y elimina usuarios o administradores.
4. Agrega, modifica, activa y desacativa los vehiculos.
5. Ve el historial de reservas.

---

## 🛠️ Tecnologías Utilizadas

| Área             | Tecnologías                                     |
|------------------|--------------------------------------------------|
| 🧑‍🎨 Frontend      | HTML, CSS, JavaScript, Bootstrap         |
| ⚙️ Backend        | Node.js, Express.js, Mongoose        |
| 🗃️ Base de datos  | MongoDb                              |
| 🔒 Seguridad      | dotenv, validaciones, middlewares  |



