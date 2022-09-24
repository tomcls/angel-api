const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class DrugDescription {
    constructor() { }

    async add(o) {
        let sql = "INSERT INTO drug_descriptions SET ? ";
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
        let sql = "UPDATE drug_descriptions  ";

        const params = [];
        
        if (o.drug_id) {
            sql += " SET  drug_id = ?";
            params.push(o.drug_id);
        } 

        if (o.notice) {
            sql += ",  notice = ?"
            sql += ((params.length)?' SET ': ',')+"  notice = ?"
            params.push(o.notice);
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
        console.log(o,sql)
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
