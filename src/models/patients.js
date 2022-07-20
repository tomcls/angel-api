const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Patient {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT patients.id as patient_id," +
            "patients.id as id," +
            "users.id as user_id," +
            "users.firstname," +
            "users.lastname," +
            "users.phone," +
            "users.email," +
            "users.sex," +
            "users.lang," +
            "users.active," +
            "users.role," +
            "users.address," +
            "users.street_number," +
            "users.zip," +
            "users.city," +
            "users.country," +
            "users.password," +
            "users.avatar," +
            "users.date_created," +
            "users.date_updated," +
            "users.birthday," +
            "patients.emergency_contact_relationship," +
            "patients.emergency_contact_name," +
            "patients.emergency_contact_phone," +
            "patients.close_monitoring " +
            "FROM patients " +
            "LEFT JOIN users ON users.id = patients.user_id " +
            "WHERE 1=1  ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and patients.id = ?"
            params.push(filters.id);
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
        sql += " order by patients.date_created desc " + filterClause;
        console.log(sql,filters)
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
        let sql = "SELECT count(*) as total FROM patients left join users on users.id = patients.user_id where 1=1  ";
        
        let params = [];
        if (filters.id) {
            sql += " and patients.id = ?"
            params.push(filters.id);
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
        if (filters.role) {
            sql += " and users.role = ?"
            params.push(filters.role);
        }
        console.log(sql,filters)
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
        let sql = "SELECT patients.id as patient_id," +
            "users.id as user_id," +
            "users.firstname," +
            "users.lastname," +
            "users.phone," +
            "users.email," +
            "users.sex," +
            "users.lang," +
            "users.active," +
            "users.role," +
            "users.address," +
            "users.street_number," +
            "users.zip," +
            "users.city," +
            "users.country," +
            "users.password," +
            "users.date_created," +
            "users.date_updated," +
            "users.birthday," +
            "users.avatar," +
            "patients.emergency_contact_relationship," +
            "patients.emergency_contact_name," +
            "patients.emergency_contact_phone," +
            "patients.close_monitoring " +
            "FROM patients " +
            "LEFT JOIN users ON users.id = patients.user_id " +
            "WHERE 1=1 ";
        let params = [];
        if (filters.id) {
            sql += " and patients.id = ?"
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
        let sql = "INSERT INTO patients SET ? ";
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
        let sql = "UPDATE patients  ";

        const params = [];
        if (o.id) {
            sql += " SET id = ?";
            params.push(o.id);
        } else {
            throw { error: 'No pk provided' }
        }
        if (o.user_id) {
            sql += ",  user_id = ?"
            params.push(o.user_id);
        }
        if (o.emergency_contact_relationship) {
            sql += ",   emergency_contact_relationship = ?"
            params.push(o.emergency_contact_relationship);
        }
        if (o.emergency_contact_name) {
            sql += " ,  emergency_contact_name = ?"
            params.push(o.emergency_contact_name);
        }
        if (o.emergency_contact_phone) {
            sql += ",   emergency_contact_phone = ?"
            params.push(o.emergency_contact_phone);
        }
        if (o.close_monitoring) {
            sql += ",   close_monitoring = ?"
            params.push(o.close_monitoring);
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

        let sql = "SELECT patients.id as patient_id," +
            "users.id as user_id," +
            "users.firstname," +
            "users.lastname," +
            "users.phone," +
            "users.email," +
            "users.sex," +
            "users.lang," +
            "users.active," +
            "users.role," +
            "users.address," +
            "users.street_number," +
            "users.zip," +
            "users.city," +
            "users.country," +
            "users.password," +
            "users.date_created," +
            "users.date_updated," +
            "users.birthday," +
            "users.avatar," +
            "patients.emergency_contact_relationship," +
            "patients.emergency_contact_name," +
            "patients.emergency_contact_phone," +
            "patients.close_monitoring " +
            "FROM patients " +
            "LEFT JOIN users ON users.id = patients.user_id " +
            "WHERE  ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += "  patients.id = ?"
            params.push(filters.id);
        }
        if (filters.firstname) {
            sql += ((params.length)?' OR ': '')+"  users.firstname like ?"
            params.push(filters.firstname + '%');
        }
        if (filters.lastname) {
            sql += ((params.length)?' OR ': '')+"  users.lastname like ?"
            params.push(filters.lastname + '%');
        }
        if (filters.email) {
            sql += ((params.length)?' OR ': '')+"  users.email like ?"
            params.push(filters.email + '%');
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by patients.date_created desc " + filterClause;
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
}
