const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class sideEffect {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT side_effects.id as side_effect_id, side_effect_descriptions.id as side_effect_description_id, " +
            "side_effects.date_created, " +
            "side_effects.date_updated, " +
            "side_effect_descriptions.name, " +
            "side_effect_descriptions.description, " +
            "side_effect_descriptions.lang_id " +
            "FROM side_effects " +
            "LEFT JOIN side_effect_descriptions on side_effects.id = side_effect_descriptions.side_effect_id "
            "WHERE 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.side_effect_id) {
            sql += " and side_effects.id = ?"
            params.push(filters.side_effect_id);
        }
        if (filters.name) {
            sql += " and side_effect_descriptions.name like ?"
            params.push(filters.name+'%');
        }
        if (filters.lang_id) {
            sql += " and side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by side_effects.id desc " + filterClause;
        try {
            let rows = await db.query(sql, params);
            if (rows && rows.length > 0) {
                return rows;
            }
            return null;
        } catch (error) {
            return error
        }
    }
    async count(filters) {
        let sql = "SELECT count(*) as total FROM side_effects LEFT JOIN side_effect_descriptions on side_effects.id = side_effect_descriptions.side_effect_id where 1=1  ";
       
        let params = [];
        if (filters.side_effect_id) {
            sql += " and side_effects.id = ?"
            params.push(filters.id);
        }
        if (filters.name) {
            sql += " and side_effect_descriptions.name like ?"
            params.push(filters.name+'%');
        }
        if (filters.lang_id) {
            sql += " and side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        try {
            let rows = await db.query(sql, params);
            if (rows && rows.length > 0) {
                return rows[0].total;
            }
            return null;
        } catch (error) {
            return error
        }
    }
    async find(filters) {
        let sql = "SELECT side_effects.id as side_effect_id, side_effect_descriptions.id as side_effect_description_id, " +
            "side_effects.date_created," +
            "side_effects.date_updated, "  +
            "side_effect_descriptions.name, " +
            "side_effect_descriptions.description, " +
            "side_effect_descriptions.lang_id " +
            "FROM side_effects "  +
            "LEFT JOIN side_effect_descriptions on side_effects.id = side_effect_descriptions.side_effect_id " + 
            "WHERE 1 = 1 ";
        let params = [];
        if (filters.side_effect_id) {
            sql += " and side_effects.id = ?"
            params.push(filters.side_effect_id);
        }
        if (filters.name) {
            sql += " and side_effect_descriptions.name = ?"
            params.push(filters.name);
        }
        if (filters.lang_id) {
            sql += " and side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        sql += " order by side_effects.date_created desc limit 1"
        try {
            let rows = await db.query(sql, params);
            if (rows && rows.length > 0) {
                return rows[0];
            }
            return null;
        } catch (error) {
            return error
        }
    }
    async add(o) {
        let sql = "INSERT INTO side_effects ()  VALUES()";

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
        let sql = "UPDATE side_effects  ";

        const params = [];
        if (o.id) {
            sql += " SET id = ?";
            params.push(o.id);
        } else {
            throw { error: 'No pk provided' }
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
    async search(filters) {

        let sql = "SELECT side_effects.id as side_effect_id," +
            "side_effects.id as id," +
            "side_effect_descriptions.name," +
            "side_effect_descriptions.description, " +
            "side_effects.date_created," +
            "side_effects.date_updated " +
            "FROM side_effects " +
            "LEFT JOIN side_effect_descriptions on side_effects.id = side_effect_descriptions.side_effect_id " + 
            "WHERE  ";
        let params = [];
        let filterClause = '';
        if (filters.side_effect_id) {
            sql += "  side_effects.id = ?"
            params.push(filters.side_effect_id);
        }
        if (filters.name) {
            sql += ((params.length)?' OR ': '')+"  side_effect_descriptions.name like ?"
            params.push('%'+filters.name + '%');
        }
        if (filters.lang_id) {
            sql += " AND side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id );
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by side_effects.date_created desc " + filterClause;
        try {
            let rows = await db.query(sql, params);
            if (rows && rows.length > 0) {
                return rows;
            }
            return null;
        } catch (error) {
            return error
        }
    }
    async delete(o) {
        if(o && o.ids) {

            let sql = "delete from side_effects where id in (?) ";
            try {
                const del = await db.query(sql, o.ids);
                return {
                    saved: del.affectedRows,
                    inserted_id: del.insertId
                };
            }
            catch (err) {
                return err;
            }
        } else {
            throw {error: 'No ids provided'}
        }
    }
}
