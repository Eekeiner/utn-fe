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
    var rows = await pool.query(query,[id]);
    return rows;
}
    module . exports = { getNovedades, deleteNovedadById }