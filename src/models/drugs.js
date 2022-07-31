const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Drug {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT drugs.id as drug_id, drug_descriptions.id as drug_description_id, " +
            "drugs.laboratory_id, " +
            "drugs.name, " +
            "drugs.code, " +
            "drugs.date_created, " +
            "drugs.date_updated, " +
            "drug_descriptions.description " +
            "FROM drugs " +
            "LEFT JOIN drug_descriptions on drugs.id = drug_descriptions.drug_id "
            "WHERE 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and drugs.id = ?"
            params.push(filters.id);
        }
        if (filters.laboratory_id) {
            sql += " and drugs.laboratory_id = ?"
            params.push(filters.laboratory_id);
        }
        if (filters.code) {
            sql += " and drugs.code like ?"
            params.push(filters.code+'%');
        }
        if (filters.name) {
            sql += " and drugs.name like ?"
            params.push(filters.name+'%');
        }
        if (filters.lang_id) {
            sql += " and drug_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by drugs.id desc " + filterClause;
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
        let sql = "SELECT count(*) as total FROM drugs LEFT JOIN drug_descriptions on drugs.id = drug_descriptions.drug_id where 1=1  ";
       
        let params = [];
        if (filters.id) {
            sql += " and drugs.id = ?"
            params.push(filters.id);
        }
        if (filters.laboratory_id) {
            sql += " and drugs.laboratory_id = ?"
            params.push(filters.laboratory_id);
        }
        if (filters.code) {
            sql += " and drugs.code like ?"
            params.push(filters.code+'%');
        }
        if (filters.name) {
            sql += " and drugs.name like ?"
            params.push(filters.name+'%');
        }
        if (filters.lang_id) {
            sql += " and drug_descriptions.lang_id = ?"
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
        let sql = "SELECT drugs.id as drug_id, drug_descriptions.id as drug_description_id, " +
            "drugs.laboratory_id," +
            "drugs.name," +
            "drugs.code," +
            "drugs.date_created," +
            "drugs.date_updated, "  +
            "drug_descriptions.description " +
            "FROM drugs "  +
            "LEFT JOIN drug_descriptions on drugs.id = drug_descriptions.drug_id " + 
            "WHERE 1 = 1 ";
        let params = [];
        if (filters.id) {
            sql += " and drugs.id = ?"
            params.push(filters.id);
        }
        if (filters.laboratory_id) {
            sql += " and drugs.laboratory_id = ?"
            params.push(filters.laboratory_id);
        }
        if (filters.code) {
            sql += " and drugs.code code = ?"
            params.push(filters.code);
        }
        if (filters.name) {
            sql += " and drugs.name = ?"
            params.push(filters.name);
        }
        sql += " order by drugs.date_created desc limit 1"
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
        let sql = "INSERT INTO drugs SET ? ";
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
        let sql = "UPDATE drugs  ";

        const params = [];
        if (o.id) {
            sql += " SET id = ?";
            params.push(o.id);
        } else {
            throw { error: 'No pk provided' }
        }
        if (o.code) {
            sql += ",  code = ?"
            params.push(o.code);
        }
        if (o.name) {
            sql += ",  name = ?"
            params.push(o.name);
        }
        if (o.laboratory_id) {
            sql += ",   laboratory_id = ?"
            params.push(o.laboratory_id);
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

        let sql = "SELECT drugs.id as drug_id," +
            "drugs.id as id," +
            "drugs.name," +
            "drugs.code," +
            "drugs.date_created," +
            "drugs.date_updated " +
            "FROM drugs " +
            "WHERE  ";
        let params = [];
        let filterClause = '';
        if (filters.drug_id) {
            sql += "  drug_id.id = ?"
            params.push(filters.id);
        }
        if (filters.name) {
            sql += ((params.length)?' OR ': '')+"  drugs.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.code) {
            sql += ((params.length)?' OR ': '')+"  drugs.code like ?"
            params.push(filters.code + '%');
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by drugs.date_created desc " + filterClause;
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

            let sql = "delete from drugs where id in (?) ";
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
