var pool = require('./bd');

async function getNovedades() {

    var query = "SELECT * from NOVEDADES";
    var rows = await pool.query(query);
    return rows;
}

module.exports = { getNovedades }

/* esto es para borrar una novedad by el ID */
async function deleteNovedadById(id) {

    var query = 'delete from novedades where id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

/* para agregar una novedad a la tabla de novedades */
async function insertNovedad(obj) {
    try {

        var query = "insert into novedades set ? ";
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/* traigo los datos para modificar una sola novedad  */ 
async function getNovedadById(id){
    var query = "select * from novedades where id=?";
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function modificarNovedadById(obj, id){
    try {
        var query = "update novedades set ? where id=?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error){
        throw error;
    }
}

module.exports = { getNovedades, deleteNovedadById, insertNovedad, getNovedadById,  modificarNovedadById}