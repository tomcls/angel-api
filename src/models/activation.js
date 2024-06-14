const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Activation {
    constructor() { }
    async insert(o) {
        let sql = "INSERT INTO activations SET ? ";
        try {
            const add = await db.query(sql, o);
            return {
                saved: add.affectedRows,
                inserted_id: add.insertId
            };
        }
        catch (err) {
            console.log('errrrrro', err)
            return err;
        }
    }
    async delete(o) {
        if (o && o.user_id) {
            let sql = "DELETE FROM activations where user_id=" + o.user_id;
            try {
                await db.query(sql, o); 
                return true;
            }
            catch (err) {
                console.log('errrrrro', err)
                return err;
            }
        }
        return null;
    }
    async find(o) {
        let sql = "SELECT * FROM activations where 1=1 ";
        let params = [];
        if (o.user_id) {
            sql += " and user_id = ?"
            params.push(o.user_id);
        }
        if (o.code) {
            sql += " and code = ?"
            params.push(o.code);
        }
        try {
            let rows = await db.query(sql, params);
            if (rows && rows.length > 0) {
                return rows[0];
            }
            return null;
        } catch (error) {
            console.log(error);
            return error
        }
    }
}