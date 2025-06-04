const fs = require('fs');
const mjml = require('mjml');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
require('dotenv').config();

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

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const [usuarios] = await connection.execute(
    'SELECT Id_Usuario, Nombre, Email, Idioma FROM USUARIO'
  );
/*
  const subjects = {
    es: "SORTEO ENTRADAS GP CHESTE",
    en: "GP CHESTE ENTRIES GIVEAWAY",
    val: "SORTEIG ENTRADES GP XEST",
  };*/

  for (const user of usuarios) {
    const lang = user.Idioma;
    //const subject = subjects[lang] || subjects['es'];
    const subject = '💥EL GANGAZO'
    const fechaEnvio = new Date();
    let mjmlPath = `Practicom2.mjml`;
    /*let mjmlPath = `oficial_${lang}.mjml`;
    if (!fs.existsSync(mjmlPath)) {
      console.warn(`Plantilla no encontrada para idioma ${lang}, usando español por defecto.`);
      mjmlPath = 'oficial.mjml';
    }*/

    let mjmlTemplate = fs.readFileSync(mjmlPath, 'utf8');
    mjmlTemplate = mjmlTemplate.replace('{{email}}', user.Email);
    const htmlOutput = mjml(mjmlTemplate).html;

    let id_mensaje = null;
    try {
      const [mensajeRows] = await connection.execute(
        'SELECT Id_Mensaje FROM MENSAJE WHERE Nom_Mensaje = ?',
        [subject]
      );

      if (mensajeRows.length === 0) {
        const [insertResult] = await connection.execute(
          'INSERT INTO MENSAJE (Nom_Mensaje, tipo) VALUES (?, ?)',
          [subject, 'promoción']
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

    const mailOptions = {
      from: process.env.O365_USER,
      to: user.Email,
      subject: subject,
      html: htmlOutput
    };

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
