var pool = require('./bd');

async function getProductos() {

    var query = "SELECT * from productos";
    var rows = await pool.query(query);
    return rows;
}

module.exports = { getProductos }

/* esto es para borrar un producto by el ID */
async function deleteProductoById(id) {

    var query = 'delete from productos where id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

/* para agregar una producto a la tabla */
async function insertProducto(obj) {
    try {

        var query = "insert into productos set ? ";
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/* traigo los datos para modificar un solo producto  */ 
async function getProductoById(id){
    var query = "select * from productos where id=?";
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function modificarProductoById(obj, id){
    try {
        var query = "update productos set ? where id=?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error){
        throw error;
    }
}

//buscador
async function buscarProductos(busqueda) {
    var query = "select * from productos where marca like ? OR modelo like ?";
    var rows = await pool.query(query, ['%' + busqueda + '%', '%' + busqueda + '%']);
    return rows;
}


module.exports = { getProductos, deleteProductoById, insertProducto, getProductoById,  modificarProductoById, buscarProductos}