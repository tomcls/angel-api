const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Scientist {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT scientists.id as scientist_id,"+
        "scientists.id as id,"+
    "users.id as user_id,"+
    "users.firstname,"+
    "users.lastname,"+
    "users.phone,"+
    "users.email,"+
    "users.sex,"+
    "users.lang,"+
    "users.active,"+
    "users.role,"+
    "users.address,"+
    "users.street_number,"+
    "users.zip,"+
    "users.city,"+
    "users.country,"+
    "users.password,"+
    "users.date_created,"+
    "users.date_updated,"+
    "users.birthday,"+
    "users.avatar," +
    "scientists.laboratory_id,"+
    "laboratories.name "+
    "FROM scientists "+
    "LEFT JOIN users ON users.id = scientists.user_id "+
    "LEFT JOIN laboratories ON laboratories.id = scientists.laboratory_id "+
    "WHERE 1 = 1 ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and scientists.id = ?"
            params.push(filters.id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        if (filters.firstname) {
            sql += " and users.firstname like ?%"
            params.push(filters.firstname);
        }
        if (filters.lastname) {
            sql += " and users.lastname like ?%"
            params.push(filters.lastname);
        }
        if (filters.email) {
            sql += " and users.email like ?%"
            params.push(filters.email);
        }
        if (filters.role) {
            sql += " and users.role like ?%"
            params.push(filters.role);
        }
        if(filters.limit) {
            filterClause = " limit "+((filters.page)*filters.limit)+', '+(filters.limit*(filters.page+1));
        }
        sql += " order by scientists.date_created desc "+filterClause;
        console.log(sql);
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
        let sql = "SELECT count(*) as total FROM scientists left join users on users.id = scientists.user_id where 1=1  ";
        let params = [];
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        if (filters.firstname) {
            sql += " and users.firstname like ?%"
            params.push(filters.firstname);
        }
        if (filters.lastname) {
            sql += " and users.lastname like ?%"
            params.push(filters.lastname);
        }
        if (filters.email) {
            sql += " and users.email like ?%"
            params.push(filters.email);
        }
        if (filters.role) {
            sql += " and users.role like ?%"
            params.push(filters.role);
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
        let sql = "SELECT scientists.id as scientist_id,"+
        "users.id as user_id,"+
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
        "users.avatar," +
        "scientists.laboratory_id, "+
        "laboratories.name "+
        "FROM users "+
        "LEFT JOIN scientists ON users.id = scientists.user_id "+
        "LEFT JOIN laboratories ON laboratories.id = scientists.laboratory_id "+
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.id) {
            sql += " and scientists.id = ?"
            params.push(filters.id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        if (filters.firstname) {
            sql += " and firstname = ?"
            params.push(filters.firstname);
        }
        if (filters.lastname) {
            sql += " and lastname = ?"
            params.push(filters.lastname);
        }
        if (filters.email) {
            sql += " and email = ?"
            params.push(filters.email);
        }
        if (filters.role) {
            sql += " and role = ?"
            params.push(filters.role);
        }
        sql += " order by users.date_created desc limit 1"
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
        let sql = "INSERT INTO scientists SET ? ";
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
        let sql = "UPDATE scientists  ";
        
        const params = [];
        if (o.id) {
            sql += " SET id = ?";
            params.push(o.id);
        } else {
            throw {error: 'No pk provided'}
        }
        if (o.user_id) {
            sql += ",  user_id = ?"
            params.push(o.user_id);
        }
        if (o.laboratory_id) {
            sql += ",   laboratory_id = ?"
            params.push(o.laboratory_id);
        }
        if (o.daysin) {
            sql += ",   daysin = ?"
            params.push(o.daysin);
        }
        sql += ",   date_updated = ?"
        params.push(new Date());
        sql += " where id="+o.id
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
        "users.avatar," +
        "patients.emergency_contact_relationship," +
        "patients.emergency_contact_name," +
        "patients.emergency_contact_phone," +
        "patients.close_monitoring " +
        "FROM scientist_patients "+
        "LEFT JOIN patients ON scientist_patients.patient_id = patients.id "+
        "LEFT JOIN users on patients.user_id = users.id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.scientist_id) {
            sql += " and scientist_patients.scientist_id = ?"
            params.push(filters.scientist_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        sql += " order by patients.id desc";
        console.log(sql);
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
        let sql = "SELECT count(*) as total "+
        "FROM scientist_patients "+
        "LEFT JOIN patients ON scientist_patients.patient_id = patients.id "+
        "LEFT JOIN users on patients.user_id = users.id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.scientist_id) {
            sql += " and scientist_patients.scientist_id = ?"
            params.push(filters.scientist_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        sql += " order by users.date_created desc limit 1"
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
        let sql = "INSERT INTO scientist_patients SET ? ";
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

}
