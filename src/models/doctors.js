const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Doctor {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT doctors.id as doctor_id, doctors.id as id,"+
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
    "doctors.hospital_id,"+
    "doctors.daysin, "+
    "hospitals.name hospital_name "+
    "FROM doctors "+
    "LEFT JOIN users ON users.id = doctors.user_id "+
    "LEFT JOIN hospitals ON hospitals.id = doctors.hospital_id "+
    "WHERE 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and doctors.id = ?"
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
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  users.email like ?"
            paramsSearch.push('%'+filters.email + '%');
        }
        if (filters.hospital_name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  hospitals.name like ?"
            paramsSearch.push(filters.hospital_name + '%');
        }

        if (filters.role) {
            sql += " and users.role like ?"
            params.push(filters.role);
        }
        if(filters.limit) {
            filterClause = " limit "+((filters.page)*filters.limit)+', '+(filters.limit*(filters.page+1));
        }
        sql += " order by doctors.date_created desc "+filterClause;
        try {
            const combined = [...params, ...paramsSearch];
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
        let sql = "SELECT count(*) as total FROM doctors left join users on users.id = doctors.user_id where 1=1  ";
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
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  users.email like ?"
            paramsSearch.push('%'+filters.email + '%');
        }
        if (filters.hospital_name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  hospitals.name like ?"
            paramsSearch.push(filters.hospital_name + '%');
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }

        if (filters.role) {
            sql += " and users.role like ?"
            params.push(filters.role);
        }
        try {

            const combined = [...params, ...paramsSearch];
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
        let sql = "SELECT doctors.id as doctor_id,"+
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
        "doctors.hospital_id,"+
        "doctors.daysin, "+
        "hospitals.name hospital_name "+
        "FROM users "+
        "LEFT JOIN doctors ON users.id = doctors.user_id "+
        "LEFT JOIN hospitals ON hospitals.id = doctors.hospital_id "+
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.id) {
            sql += " and doctors.id = ?"
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
        let sql = "INSERT INTO doctors SET ? ";
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
        let sql = "UPDATE doctors  ";
        
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
        "users.id as id,"+
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
        "hospitals.name hospital_name, " +
        "patients.emergency_contact_relationship," +
        "patients.emergency_contact_name," +
        "patients.emergency_contact_phone," +
        "patients.close_monitoring " +
        "FROM doctor_patients "+
        "LEFT JOIN patients ON doctor_patients.patient_id = patients.id "+
        "LEFT JOIN doctors ON doctor_patients.doctor_id = doctors.id  " +
        "LEFT JOIN hospitals ON hospitals.id = doctors.hospital_id  " +
        "LEFT JOIN users on patients.user_id = users.id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.doctor_id) {
            sql += " and doctor_patients.doctor_id = ?"
            params.push(filters.doctor_id);
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
        "FROM doctor_patients "+
        "LEFT JOIN patients ON doctor_patients.patient_id = patients.id "+
        "LEFT JOIN users on patients.user_id = users.id  " +
        "WHERE 1 = 1 ";
        let params = [];
        if (filters.doctor_id) {
            sql += " and doctor_patients.doctor_id = ? "
            params.push(filters.doctor_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ? "
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

        sql += " order by users.date_created desc limit 1 "
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

    async deleteDoctors(o) {
        if(o.ids) {
            let sql = "delete from users where id in ( select user_id from doctors where doctors.id in ("+o.ids+") )  ";
            try {
                await db.query(sql, o);
                return true
            }
            catch (err) {
                return err;
            }
        } else {
            return null;
        }
        
    }
    async unlinkPatient(o) {
        if(o.doctor_id && o.patient_id) {
            let sql = "delete from doctor_patients where patient_id =  "+o.patient_id+" and doctor_id ="+o.doctor_id;
            try {
                await db.query(sql, o);
                return true
            }
            catch (err) {
                return err;
            }
        } else if(o.patient_id && o.ids) {
            let sql = "delete from doctor_patients where patient_id =  "+o.patient_id+" and doctor_id in ("+o.ids+")";
            try {
                await db.query(sql, o);
                return true
            }
            catch (err) {
                return err;
            }
        } else {
            return null;
        }
        
    }
    async addPatient(o) {
        let sql = "INSERT INTO doctor_patients SET ? ";
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
     async getDoctors(filters) {
        let sql = "SELECT doctors.id AS doctor_id,"+
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
        "hospitals.name hospital_name, " +
        "users.birthday,"+
        "users.avatar " + 
        "FROM doctor_patients "+
        "LEFT JOIN doctors ON doctor_patients.doctor_id = doctors.id  " +
        "LEFT JOIN patients ON doctor_patients.patient_id = patients.id "+
        "LEFT JOIN hospitals ON hospitals.id = doctors.hospital_id  " +
        "LEFT JOIN users ON doctors.user_id = users.id " + 
        "WHERE 1 = 1   ";
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += " and patients.id =  ?"
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
        sql += " order by doctors.date_created desc " + filterClause;
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
    async countDoctors(filters) {
        let sql = "SELECT count(*) total " +
        "FROM doctor_patients "+
        "LEFT JOIN doctors ON doctor_patients.doctor_id = doctors.id  " +
        "LEFT JOIN patients ON doctor_patients.patient_id = patients.id "+
        "LEFT JOIN users ON doctors.user_id = users.id " + 
        "WHERE 1 = 1   ";
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += " and doctor_patients.patient_id = ?"
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
