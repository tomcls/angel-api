const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Drug {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT drugs.id as drug_id, drug_descriptions.id as drug_description_id, " +
            "drugs.laboratory_id, " +
            "drugs.name drug_name, " +
            "drugs.code drug_code, " +
            "drugs.date_created, " +
            "drugs.date_updated, " +
            "drug_descriptions.description, " +
            "laboratories.name laboratory_name " + 
            "FROM drugs "  +
            "LEFT JOIN drug_descriptions on drugs.id = drug_descriptions.drug_id " + 
            "LEFT JOIN laboratories on drugs.laboratory_id = laboratories.id " + 
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
        if (filters.lang_id) {
            sql += " and drug_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        let sqlSearch = '';
        if (filters.name) {
            sqlSearch +=  " drugs.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.code) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" drugs.code like ?"
            params.push(filters.code + '%');
        }
        if(sqlSearch !=='') {
            sql += ' AND (' + sqlSearch + ') ';
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
        if (filters.lang_id) {
            sql += " and drug_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        let sqlSearch = '';
        if (filters.name) {
            sqlSearch +=  " drugs.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.code) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" drugs.code like ?"
            params.push(filters.code + '%');
        }
        if(sqlSearch !=='') {
            sql += ' AND (' + sqlSearch + ') ';
        }
        console.log(sql)
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
            "drug_descriptions.description, " +
            "laboratories.name laboratory_name " + 
            "FROM drugs "  +
            "LEFT JOIN drug_descriptions on drugs.id = drug_descriptions.drug_id " + 
            "LEFT JOIN laboratories on drugs.laboratory_id = laboratories.id " + 
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
    async getPatients(filters) {
        let sql = "SELECT patients.id as patient_id,"+
        "users.id as user_id,"+
        "users.id as id,"+
        "users.firstname,"+
        "users.lastname,"+
        "users.phone,"+
        "users.email,"+
        "users.sex,"+
        "users.lang,"+
        "users.active,"+
        "users.role,"+
        "users.password,"+
        "users.address,"+
        "users.street_number,"+
        "users.zip,"+
        "users.city,"+
        "users.country,"+
        "users.date_created,"+
        "users.date_updated,"+
        "users.birthday,"+
        "users.avatar,"+
        "patients.emergency_contact_relationship," +
        "patients.emergency_contact_name," +
        "patients.emergency_contact_phone," +
        "patients.close_monitoring " +
        "FROM drug_patients "+
        "LEFT JOIN patients ON drug_patients.patient_id = patients.id "+
        "LEFT JOIN users on patients.user_id = users.id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.drug_id) {
            sql += " and drug_patients.drug_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and drug_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        sql += " order by drug_patients.id desc";
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

    async countPatients(filters) {
        let sql = "SELECT count(*) as total " +
        "FROM drug_patients "+
        "LEFT JOIN patients ON drug_patients.patient_id = patients.id "+
        "LEFT JOIN users on patients.user_id = users.id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.treatment_id) {
            sql += " and drug_patients.treatment_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and drug_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
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

    async addPatient(o) {
        let sql = "INSERT INTO drug_patients SET ? ";
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
    async getUserDrugs(filters) {
        let sql = "SELECT drugs.id as drug_id, drug_patients.id id, " +
        "users.avatar, " +
        "users.firstname, " +
        "users.lastname, " +
        "drugs.name, " +
        "drugs.code, " +
        "drug_patients.patient_id, "+
        "drug_patients.posology, " +
        "drug_patients.start_date, " +
        "drug_patients.end_date, " +
        "drugs.date_created, " +
        "drugs.date_updated " +
        "FROM drug_patients "+
        "LEFT JOIN patients ON drug_patients.patient_id = patients.id "+
        "LEFT JOIN users ON users.id = patients.user_id "+
        "LEFT JOIN drugs on drugs.id = drug_patients.drug_id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.drug_id) {
            sql += " and drug_patients.drug_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and drug_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and patients.user_id = ?"
            params.push(filters.user_id);
        }
        sql += " order by drug_patients.id desc";
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

    async countUserDrugs(filters) {
        let sql = "SELECT count(*) as total " +
        "FROM drug_patients "+
        "LEFT JOIN patients ON drug_patients.patient_id = patients.id "+
        "LEFT JOIN drugs on drugs.id = drug_patients.drug_id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.drug_id) {
            sql += " and drug_patients.drug_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and drug_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and patients.user_id = ?"
            params.push(filters.user_id);
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
}