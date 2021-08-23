var express = require('express');
const { get } = require('http');
var router = express.Router();
var nodemailer = require("nodemailer");
const { getMaxListeners } = require('process');
var novedadesModel = require('../models/novedadesModel');
var cloudinary = require('cloudinary').v2;


/* GET home page. */
router.get('/', async function (req, res, next) {
  var novedades = await novedadesModel.getNovedades();
  novedades = novedades.splice(0, 5); //seleccionamos los primeros 5 elementos del array
  novedades = novedades.map(novedad => {
    if (novedad.img_id) {
      const imagen = cloudinary.url(novedad.img_id, {
        width: 460,
        crop: 'fill'
      });
      return {
        ...novedad,
        imagen
      }
    } else {
      return {
        ...novedad,
        imagen: '/images/anteojos3.png'
      }
    }
  });

   res.render('index',{
    novedades
  });
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
    html: "La persona " + nombre + " de apellido " + apellido + " se contacto a traves de la web de la pagina de la optica y pide que le envien mas info a esta direccion de email " + email + ". <br> Su direccion es " + direccion + " en la ciudad de " + ciudad + " de la provincia de " + provincia + ". Codigo postal " + codpostal
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
    message: 'Mensaje enviado correctamente',
  });
});
module.exports = router;
