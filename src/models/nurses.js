const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Nurse {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT nurses.id as nurse_id,"+
        "nurses.id as id,"+
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
    "nurses.hospital_id,"+
    "hospitals.name hospital_name, "+
    "nurses.daysin "+
    "FROM nurses "+
    "LEFT JOIN users ON users.id = nurses.user_id "+
    "LEFT JOIN hospitals ON hospitals.id = nurses.hospital_id "+
    "WHERE 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and nurses.id = ?"
            params.push(filters.id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        let paramsSearch = [];
        let sqlSearch = "";
        if (filters.firstname) {
            sqlSearch += "  users.firstname like ?"
            paramsSearch.push(filters.firstname + '%');
        }
        if (filters.lastname) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  users.lastname like ?"
            paramsSearch.push(filters.lastname + '%');
        }
        if (filters.email) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  users.email = ?"
            paramsSearch.push(filters.email);
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }
        const combined = [...params, ...paramsSearch];
        if(filters.limit) {
            filterClause = " limit "+((filters.page)*filters.limit)+', '+(filters.limit*(filters.page+1));
        }
        sql += " order by nurses.date_created desc "+filterClause;
        console.log(sql)
        try {
            let rows = await db.query(sql, combined);
            if (rows && rows.length > 0) {
                return rows;
            }
            return null;
        } catch (error) {
            return error
        }
    }
    async count(filters) {
        let sql = "SELECT count(*) as total FROM nurses left join users on users.id = nurses.user_id where 1=1  ";
        let params = [];
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        let paramsSearch = [];
        let sqlSearch = "";
        if (filters.firstname) {
            sqlSearch += "  users.firstname like ?"
            paramsSearch.push(filters.firstname + '%');
        }
        if (filters.lastname) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  users.lastname like ?"
            paramsSearch.push(filters.lastname + '%');
        }
        if (filters.email) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  users.email = ?"
            paramsSearch.push(filters.email);
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }
        const combined = [...params, ...paramsSearch];
        try {
            let rows = await db.query(sql, combined);
            if (rows && rows.length > 0) {
                return rows[0].total;
            }
            return null;
        } catch (error) {
            return error
        }
    }
    async find(filters) {
        let sql = "SELECT nurses.id as nurse_id,"+
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
        "nurses.hospital_id, "+
        "hospitals.name hospital_name, "+
        "nurses.daysin "+
        "FROM users "+
        "LEFT JOIN nurses ON users.id = nurses.user_id "+
        "LEFT JOIN hospitals ON hospitals.id = nurses.hospital_id "+
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.id) {
            sql += " and nurses.id = ?"
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
        let sql = "INSERT INTO nurses SET ? ";
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
        let sql = "UPDATE nurses  ";
        
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
        if (o.hospital_id) {
            sql += ",   hospital_id = ?"
            params.push(o.hospital_id);
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
        "FROM nurse_patients "+
        "LEFT JOIN patients ON nurse_patients.patient_id = patients.id "+
        "LEFT JOIN users on patients.user_id = users.id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.nurse_id) {
            sql += " and nurse_patients.nurse_id = ?"
            params.push(filters.nurse_id);
        }
        if (filters.patient_id) {
            sql += " and nurse_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        
        let sqlSearch = '';
        if (filters.firstname) {
            sqlSearch +=  " users.firstname like ?"
            params.push(filters.firstname + '%');
        }
        if (filters.lastname) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" users.lastname like ?"
            params.push(filters.lastname + '%');
        }
        if (filters.email) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" users.email like ?"
            params.push(filters.email + '%');
        }
        if (filters.phone) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" users.phone like ?"
            params.push(filters.phone + '%');
        }
        if(sqlSearch !=='') {
            sql += ' AND (' + sqlSearch + ') ';
        }
        sql += " order by patients.id desc";
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
        "FROM nurse_patients "+
        "LEFT JOIN patients ON nurse_patients.patient_id = patients.id "+
        "LEFT JOIN users on patients.user_id = users.id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.nurse_id) {
            sql += " and nurse_patients.nurse_id = ?"
            params.push(filters.nurse_id);
        }
        if (filters.patient_id) {
            sql += " and nurse_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        let sqlSearch = '';
        if (filters.firstname) {
            sqlSearch +=  " users.firstname like ?"
            params.push(filters.firstname + '%');
        }
        if (filters.lastname) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" users.lastname like ?"
            params.push(filters.lastname + '%');
        }
        if (filters.email) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" users.email like ?"
            params.push(filters.email + '%');
        }
        if (filters.phone) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" users.phone like ?"
            params.push(filters.phone + '%');
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
    async addPatient(o) {
        let sql = "INSERT INTO nurse_patients SET ? ";
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
    // get nurses of a certain patient
    async getNurses(filters) {
        let sql = "SELECT nurses.id AS nurse_id,"+
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
        "users.avatar " + 
        "FROM nurse_patients "+
        "LEFT JOIN nurses ON nurse_patients.nurse_id = nurses.id  " +
        "LEFT JOIN patients ON nurse_patients.patient_id = patients.id "+
        "LEFT JOIN users ON nurses.user_id = users.id " + 
        "WHERE 1 = 1   ";
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += " and nurse_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        if (filters.firstname) {
            sql +=  ((params.length)?' OR ': 'AND ')+" users.firstname like ?"
            params.push(filters.firstname + '%');
        }
        if (filters.lastname) {
            sql += ((params.length)?' OR ': 'AND ')+" users.lastname like ?"
            params.push(filters.lastname + '%');
        }
        if (filters.email) {
            sql += ((params.length)?' OR ': 'AND ')+" users.email like ?"
            params.push(filters.email + '%');
        }
        if (filters.phone) {
            sql += ((params.length)?' OR ': 'AND ')+" users.phone like ?"
            params.push(filters.phone + '%');
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by nurses.date_created desc " + filterClause;
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
    async countNurses(filters) {
        let sql = "SELECT count(*) total " +
        "FROM nurse_patients "+
        "LEFT JOIN nurses ON nurse_patients.nurse_id = nurses.id "+
        "LEFT JOIN users on nurse_patients.nurse_id = users.id  " +
        "WHERE 1 = 1   ";
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += " and nurse_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        if (filters.firstname) {
            sql +=  ((params.length)?' OR ': 'AND ')+" users.firstname like ?"
            params.push(filters.firstname + '%');
        }
        if (filters.lastname) {
            sql += ((params.length)?' OR ': 'AND ')+" users.lastname like ?"
            params.push(filters.lastname + '%');
        }
        if (filters.email) {
            sql += ((params.length)?' OR ': 'AND ')+" users.email like ?"
            params.push(filters.email + '%');
        }
        if (filters.phone) {
            sql += ((params.length)?' OR ': 'AND ')+" users.phone like ?"
            params.push(filters.phone + '%');
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
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
