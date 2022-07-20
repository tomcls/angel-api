const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class SideEffectDescription {
    constructor() { }

    async add(o) {
        let sql = "INSERT INTO side_effect_descriptions SET ? ";
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
        let sql = "UPDATE side_effect_descriptions  ";

        const params = [];
        if (o.side_effect_id) {
            sql += " SET side_effect_id = ?";
            params.push(o.side_effect_id);
        } else {
            throw { error: 'No sideEffect id provided' }
        }
        if (o.lang_id) {
            sql += ",  lang_id = ?"
            params.push(o.lang_id);
        }
        if (o.name) {
            sql += ",  name = ?"
            params.push(o.name);
        }
        if (o.description) {
            sql += ",  description = ?"
            params.push(o.description);
        }
        sql += ",   date_updated = ?"
        params.push(new Date());
        sql += " where side_effect_id=" + o.side_effect_id + " and lang_id='" + o.lang_id+"'";
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
