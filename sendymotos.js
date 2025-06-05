// Carga las dependencias necesarias en variables
// Importacion de librerias 
const fs = require('fs');
const mjml = require('mjml');
const nodemailer = require('nodemailer');    
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuracion del transportador de email
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.O365_USER,
    pass: process.env.O365_PASS,
  },
  tls: {
    ciphers: 'SSLv3'
  }
});
// Sincronizamos la conexión con el usuario que envia a la base de datos
(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  // Buscamos los usuarios a los que nos vamos a enfocar
  const [usuarios] = await connection.execute(
    'SELECT Id_Usuario, Nombre, Email, Idioma FROM USUARIO WHERE Edad >= 20'
  );

  for (const user of usuarios) {
    const fechaEnvio = new Date();

    let mjmlPath = `Practic2.mjml`;
    if (!fs.existsSync(mjmlPath)) {
      console.warn(`Plantilla no encontrada.`);
    }

    // Procesamienrto de plantilla
    let mjmlTemplate = fs.readFileSync(mjmlPath, 'utf8');
    mjmlTemplate = mjmlTemplate.replace('{{nombre}}', user.Nombre);
    mjmlTemplate = mjmlTemplate.replace('{{email}}', user.Email);
    const htmlOutput = mjml(mjmlTemplate).html;

    let id_mensaje = null;
    let asunto = '🏍️EL GANGAZO';
    try {
      // Gestion de mensaje en la base de datos
      const [mensajeRows] = await connection.execute(
        'SELECT Id_Mensaje FROM MENSAJE WHERE Nom_Mensaje = ?',
        [asunto]
      );

      if (mensajeRows.length === 0) {
        const [insertResult] = await connection.execute(
          'INSERT INTO MENSAJE (Nom_Mensaje, tipo) VALUES (?, ?)',
          [asunto, 'Promoción']
        );
        Id_Mensaje = insertResult.insertId;
        console.log(`Mensaje insertado con ID ${id_mensaje}`);
      } else {
        Id_Mensaje = mensajeRows[0].Id_Mensaje;
      }
    } catch (err) {
      console.error('Error al procesar la tabla mensaje:', err);
      continue;
    }

    if (!user.Id_Usuario || !Id_Mensaje || !fechaEnvio) {
      console.error('Datos incompletos para registrar envío:', {
        Id_Usuario: user.Id_Usuario,
        Id_Mensaje,
        fechaEnvio
      });
      continue;
    }

    // Envio del email
    const mailOptions = {
      from: process.env.O365_USER,
      to: user.Email,
      subject: asunto,
      html: htmlOutput
    };

    // Registro en la base de datos 
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Correo enviado a ${user.Email}:`, info.response);

      await connection.execute(
        'INSERT INTO ENVIO (Id_Usuario, Id_Mensaje, Fecha) VALUES (?, ?, ?)',
        [user.Id_Usuario, Id_Mensaje, fechaEnvio]
      );
    } catch (err) {
      console.error(`Error al enviar a ${user.Email}:`, err);
    }
  }

  await connection.end();
})();
