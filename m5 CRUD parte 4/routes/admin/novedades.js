var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel')
var util = require('util');
var cloudinary = require('cloudinary').v2;
var uploader = util.promisify(cloudinary.uploader.upload);
var destroy = util.promisify(cloudinary.uploader.destroy);


/* GET lista de novedades - buscador */
router.get('/', async function (req, res, next) {

  /* var novedades = await novedadesModel.getNovedades(); */
  var novedades
  if(req.query.q === undefined) {
    novedades = await novedadesModel.getNovedades();

  } else {
    novedades = await novedadesModel.buscarNovedades(req.query.q);
  }

  novedades = novedades.map(novedad =>{
    if (novedad.img_id) {
      const imagen = cloudinary.image(novedad.img_id, {
        width: 100,
        height: 100,
        crop: 'fill'
      });
      return {
        ...novedad,
        imagen
      }
    } else {
      return {
        ...novedad,
        imagen: ''
      }
    }
  });

  res.render('admin/novedades', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    novedades,
    is_search: req.query.q !== undefined,
    q: req.query.q
  });
});


/* para eliminar una novedad */
router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;
  let novedad = await novedadesModel.getNovedadById(id);
  if (novedad.img_id) {
    await (destroy(novedad.img_id));
}

  await novedadesModel.deleteNovedadById(id);
  res.redirect('/admin/novedades')
});

/* para agregar una novedad con el boton "nuevo"   */
router.get('/agregar', (req, res, next) => {
  res.render('admin/agregar', { // crea agregar.hbs
    layout: 'admin/layout'
  });//cierra render
});//cierra get

router.post('/agregar', async (req, res, next) => {
  try {
    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {

      imagen = req.files.imagen;

      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
      //await novedadesModel.insertNovedad(req.body);
      await novedadesModel.insertNovedad({
        ...req.body, /* traigo todo lo que hay en body (titulo, subtitulo y cuerpo, por eso los ...) */
        img_id
      });


      res.redirect('/admin/novedades')
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son requeridos'
      })
    }

  } catch (error) {
    console.log(error)
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se cargo la novedad'
    });
  }
});


/* traer una novedad para poder modificarla */
router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  var novedad = await novedadesModel.getNovedadById(id);
  res.render('admin/modificar', { //modificar.hbs
    layout: 'admin/layout',
    novedad
  });
});

//update de la novedad
router.post('/modificar', async (req, res, next) => {
  try {

    let img_id = req.body.img_original;
    let borrar_img_vieja = false;
    if (req.body.img_delete === "1") {
      img_id = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_ing_vieja = true;
      }
    }
    if (borrar_img_vieja && req.body.img_original) {
      await (destroy(req.body.ing_original));
    }

    // console.log(req.body.id) //para ver si trae el id 
    var obj = {
      titulo: req.body.titulo,
      subtitulo: req.body.subtitulo,
      cuerpo: req.body.cuerpo,
      img_id
    }
    console.log(obj) //para ver si trae los datos

    await novedadesModel.modificarNovedadById(obj, req.body.id);

    res.redirect('/admin/novedades');

  } catch (error) {
    console.log(error)
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se modifico la novedad'
    })
  }
});

module.exports = router;