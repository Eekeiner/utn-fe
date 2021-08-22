var pool = require('./bd');
async function getNovedades() {

    var query = "SELECT * from NOVEDADES order by id desc";
    var rows = await pool.query(query);
    return rows;
}

module.exports = { getNovedades }
