var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/', async (req, res, next) => {
  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var direccion = req.body.direccion;
  var ciudad = req.body.ciudad;
  var provincia = req.body.provincia;
  var codpostal = req.body.codpostal;

  var obj = {
    to: 'eekeiner@gmail.com',
    subject: 'Contacto desde la web',
    html: nombre + apellido + " se contacto a traves de la web de la pagina de la optica. Su email es " + email + ". <br> Su direccion es " + direccion + " en la ciudad de " + ciudad + " de la provincia de " + provincia + ". Codigo postal " + codpostal + "<br> Enviado a traves de nodemailer."
  } // cierra var de objeto

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }); //cierra trasporter

  var info = await transport.sendMail(obj);

  res.render('index', {
    message: 'Mensaje enviado correctamente! Pronto nos comunicaremos con ud ',
  });
});



module.exports = router;
