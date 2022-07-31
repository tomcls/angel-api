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
            "LEFT JOIN treatment_descriptions on treatments.id = treatment_descriptions.treatment_id "
            "WHERE 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and treatments.id = ?"
            params.push(filters.id);
        }
        if (filters.code) {
            sql += " and treatments.code like ?"
            params.push(filters.code+'%');
        }
        if (filters.name) {
            sql += " and treatments.name like ?"
            params.push(filters.name+'%');
        }
        if (filters.lang_id) {
            sql += " and treatment_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by treatments.id desc " + filterClause;
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
        if (filters.code) {
            sql += " and treatments.code like ?"
            params.push(filters.code+'%');
        }
        if (filters.name) {
            sql += " and treatments.name like ?"
            params.push(filters.name+'%');
        }
        if (filters.lang_id) {
            sql += " and treatment_descriptions.lang_id = ?"
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
        let sql = "SELECT treatments.id as treatment_id, treatment_descriptions.id as treatment_description_id, " +
            "treatments.name," +
            "treatments.code," +
            "treatments.date_created," +
            "treatments.date_updated, "  +
            "treatment_descriptions.description " +
            "FROM treatments "  +
            "LEFT JOIN treatment_descriptions on treatments.id = treatment_descriptions.treatment_id " + 
            "WHERE 1 = 1 ";
        let params = [];
        if (filters.id) {
            sql += " and treatments.id = ?"
            params.push(filters.id);
        }
        if (filters.code) {
            sql += " and treatments.code code = ?"
            params.push(filters.code);
        }
        if (filters.name) {
            sql += " and treatments.name = ?"
            params.push(filters.name);
        }
        sql += " order by treatments.date_created desc limit 1"
        console.log(sql)
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
    async addPatient(o) {
        let sql = "INSERT INTO treatment_patients SET ? ";
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
        "FROM treatment_patients "+
        "LEFT JOIN patients ON treatment_patients.patient_id = patients.id "+
        "LEFT JOIN users on patients.user_id = users.id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.treatment_id) {
            sql += " and treatment_patients.treatment_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and treatment_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        sql += " order by treatment_patients.id desc";
        console.log(sql,params)
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
        "FROM treatment_patients "+
        "LEFT JOIN patients ON treatment_patients.patient_id = patients.id "+
        "LEFT JOIN users on patients.user_id = users.id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.treatment_id) {
            sql += " and treatment_patients.treatment_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and treatment_patients.patient_id = ?"
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
        let sql = "INSERT INTO treatment_patients SET ? ";
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
    async getUserTreaments(filters) {
        let sql = "SELECT treatments.id as treatment_id, " +
        "treatments.name, " +
        "treatments.code, " +
        "treatments.date_created, " +
        "treatments.date_updated " +
        "FROM treatment_patients "+
        "LEFT JOIN patients ON treatment_patients.patient_id = patients.id "+
        "LEFT JOIN treatments on treatments.id = treatment_patients.treatment_id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.treatment_id) {
            sql += " and treatment_patients.treatment_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and treatment_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and patients.user_id = ?"
            params.push(filters.user_id);
        }
        sql += " order by treatment_patients.id desc";
        console.log(sql,params)
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

    async countUserTreaments(filters) {
        let sql = "SELECT count(*) as total " +
        "FROM treatment_patients "+
        "LEFT JOIN patients ON treatment_patients.patient_id = patients.id "+
        "LEFT JOIN treatments on treatments.id = treatment_patients.treatment_id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.treatment_id) {
            sql += " and treatment_patients.treatment_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and treatment_patients.patient_id = ?"
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
    async delete(o) {
        if(o && o.ids) {

            let sql = "delete from treatments where id in (?) ";
            try {
                
                const del = await db.query(sql, o.ids);
                console.log(sql,del,o);
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
