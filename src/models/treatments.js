const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Treatment {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT treatments.id as treatment_id, treatment_descriptions.id as treatment_description_id, " +
            "treatments.name, " +
            "treatments.code, " +
            "treatments.date_created, " +
            "treatments.date_updated, " +
            "treatment_descriptions.description " +
            "FROM treatments " +
            "LEFT JOIN treatment_descriptions on treatments.id = treatment_descriptions.treatment_id " +
            "WHERE 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and treatments.id = ?"
            params.push(filters.id);
        }
        if (filters.lang_id) {
            sql += " and treatment_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        let sqlSearch = '';
        if (filters.name) {
            sqlSearch +=  " treatments.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.code) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" treatments.code like ?"
            params.push(filters.code + '%');
        }
        if(sqlSearch !=='') {
            sql += ' AND (' + sqlSearch + ') ';
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by treatments.id desc " + filterClause;
        console.log(sql)
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
        let sql = "SELECT count(*) as total FROM treatments LEFT JOIN treatment_descriptions on treatments.id = treatment_descriptions.treatment_id where 1=1  ";
       
        let params = [];
        if (filters.id) {
            sql += " and treatments.id = ?"
            params.push(filters.id);
        }
        if (filters.lang_id) {
            sql += " and treatment_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        let sqlSearch = '';
        if (filters.name) {
            sqlSearch +=  " treatments.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.code) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" treatments.code like ?"
            params.push(filters.code + '%');
        }
        if(sqlSearch !=='') {
            sql += ' AND (' + sqlSearch + ') ';
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
        let sql = "INSERT INTO treatments SET ? ";
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
        let sql = "UPDATE treatments  ";

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

    async getDrugs(filters) {
        let sql = "SELECT treatments.id as treatment_id,"+
        "drugs.id as drug_id,"+
        "drugs.id as id,"+
        "drugs.name drug_name,"+
        "drugs.date_created,"+
        "drugs.code drug_code,"+
        "treatments.name," +
        "treatments.code " +
        "FROM treatment_drugs "+
        "LEFT JOIN drugs ON treatment_drugs.drug_id = drugs.id "+
        "LEFT JOIN treatments ON treatments.id = treatment_drugs.treatment_id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.drug_id) {
            sql += " and treatment_drugs.drug_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.treatment_id) {
            sql += " and treatment_drugs.treatment_id = ?"
            params.push(filters.treatment_id);
        }
        sql += " order by treatments.id desc";
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

    async countDrugs(filters) {
        let sql = "SELECT count(*) as total "+
        "FROM treatment_drugs "+
        "LEFT JOIN drugs ON treatment_drugs.drug_id = drugs.id "+
        "LEFT JOIN treatments ON treatments.id = treatment_drugs.treatment_id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.drug_id) {
            sql += " and treatment_drugs.drug_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.treatment_id) {
            sql += " and treatment_drugs.treatment_id = ?"
            params.push(filters.treatment_id);
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
    async addDrug(o) {
        let sql = "INSERT INTO treatment_drugs SET ? ";
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
 
   
    async delete(o) {
        if(o && o.ids) {

            let sql = "delete from treatments where id in ("+o.ids+") ";
            try {
                const del = await db.query(sql);
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
