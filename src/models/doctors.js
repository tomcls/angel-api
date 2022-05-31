const conn = require("../utils/conn");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_APIKEY);
const db = conn.conn();
module.exports = class Doctor {
    constructor() { }
    async findAll(filters) {
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
    "users.type,"+
    "users.address,"+
    "users.street_number,"+
    "users.zip,"+
    "users.city,"+
    "users.country,"+
    "users.password,"+
    "users.date_created,"+
    "users.date_updated,"+
    "users.birthday,"+
    "doctors.hospital_id,"+
    "doctors.daysin "+
    "FROM users "+
    "LEFT JOIN doctors ON users.id = doctors.user_id "+
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
        if (filters.type) {
            sql += " and users.type like ?"
            params.push(filters.type);
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
        let sql = "SELECT count(*) FROM users left join doctors on users.id = doctors.user_id where 1=1  ";
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
        if (filters.type) {
            sql += " and users.type like ?%"
            params.push(filters.type);
        }
        if (filters.role) {
            sql += " and users.role like ?%"
            params.push(filters.role);
        }
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
        "users.type,"+
        "users.address,"+
        "users.street_number,"+
        "users.zip,"+
        "users.city,"+
        "users.country,"+
        "users.password,"+
        "users.date_created,"+
        "users.date_updated,"+
        "users.birthday,"+
        "doctors.hospital_id,"+
        "doctors.daysin "+
        "FROM users "+
        "LEFT JOIN doctors ON users.id = doctors.user_id "+
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
        if (filters.type) {
            sql += " and type = ?"
            params.push(filters.type);
        }
        if (filters.role) {
            sql += " and role = ?"
            params.push(filters.role);
        }
        sql += " order by users.date_created desc limit 1"
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
        console.log(sql)
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
        "users.type,"+
        "users.password,"+
        "users.address,"+
        "users.street_number,"+
        "users.zip,"+
        "users.city,"+
        "users.country,"+
        "users.date_created,"+
        "users.date_updated,"+
        "users.birthday,"+
        "patients.emergency_contact_relationship," +
        "patients.emergency_contact_name," +
        "patients.emergency_contact_phone," +
        "patients.close_monitoring " +
        "FROM doctor_patients "+
        "LEFT JOIN patients ON doctor_patients.patient_id = patients.id "+
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
        let sql = "SELECT count(*) as total"+
        "FROM doctor_patients "+
        "LEFT JOIN patients ON doctor_patients.patient_id = patients.id "+
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
}
