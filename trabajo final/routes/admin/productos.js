var express = require('express');
var router = express.Router();
var productosModel = require('../../models/productosModel')
var util = require('util');
var cloudinary = require('cloudinary').v2;
var uploader = util.promisify(cloudinary.uploader.upload);
var destroy = util.promisify(cloudinary.uploader.destroy);


/* GET lista de productos - buscador */
router.get('/', async function (req, res, next) {

  /* var productos = await productosModel.getProductos(); */
  var productos
  if(req.query.q === undefined) {
    productos = await productosModel.getProductos();

  } else {
    productos = await productosModel.buscarProductos(req.query.q);
  }

  productos = productos.map(producto =>{
    if (producto.img_id) {
      const imagen = cloudinary.image(producto.img_id, {
        width: 100,
        height: 100,
        crop: 'fill'
      });
      return {
        ...producto,
        imagen
      }
    } else {
      return {
        ...producto,
        imagen: ''
      }
    }
  });

  res.render('admin/productos', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    productos,
    is_search: req.query.q !== undefined,
    q: req.query.q
  });
});


/* para eliminar un producto*/
router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;
  let producto = await productosModel.getProductoById(id);
  if (producto.img_id) {
    await (destroy(producto.img_id));
}

  await productosModel.deleteProductoById(id);
  res.redirect('/admin/productos')
});

/* para agregar un producto con el boton "nuevo"   */
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
     
      await productosModel.insertProducto({
        ...req.body, 
        img_id
      });


      res.redirect('/admin/productos')
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
      message: 'No se cargo el producto'
    });
  }
});


/* traer un producto para poder modificarlo */
router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  var producto = await productosModel.getProductoById(id);
  res.render('admin/modificar', { //modificar.hbs
    layout: 'admin/layout',
    producto
  });
});

//update del producto
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

    await productosModel.modificarProductoById(obj, req.body.id);

    res.redirect('/admin/productos');

  } catch (error) {
    console.log(error)
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se modifico el producto'
    })
  }
});

module.exports = router;