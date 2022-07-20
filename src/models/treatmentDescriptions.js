const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class TreatmentDescription {
    constructor() { }

    async add(o) {
        let sql = "INSERT INTO treatment_descriptions SET ? ";
        try {
            const add = await db.query(sql, o);
            return {
                saved: add.affectedRows,
                inserted_id: add.insertId
            };
        }
        catch (err) {
            return err;
        }
    }
    async update(o) {
        let sql = "UPDATE treatment_descriptions  ";

        const params = [];
        if (o.treatment_id) {
            sql += " SET treatment_id = ?";
            params.push(o.treatment_id);
        } else {
            throw { error: 'No treatment id provided' }
        }
        if (o.lang_id) {
            sql += ",  lang_id = ?"
            params.push(o.lang_id);
        }
        if (o.description) {
            sql += ",  description = ?"
            params.push(o.description);
        }
        sql += ",   date_updated = ?"
        params.push(new Date());
        sql += " where id=" + o.id
        try {
            const updated = await db.query(sql, params);
            return {
                saved: updated
            };
        }
        catch (err) {
            return err;
        }
    }

}
