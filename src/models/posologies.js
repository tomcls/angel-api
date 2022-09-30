const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Posology {
    constructor() { }
    async find(filters) {

        let sql = " SELECT "+
        " users.id as user_id,"+
        " users.firstname,"+
        " users.lastname,"+
        " users.phone,"+
        " users.email,"+
        " users.sex,"+
        " users.lang,"+
        " users.active,"+
        " users.role,"+
        " users.password,"+
        " users.address,"+
        " users.street_number,"+
        " users.zip,"+
        " users.city,"+
        " users.country,"+
        " users.date_created,"+
        " users.date_updated,"+
        " users.birthday,"+
        " users.avatar," +
        " drugs.name, " +
        " drugs.image," +
        " drugs.code, " +
        " drug_patients.patient_id, "+
        " drug_patients.posology_id, " +
        " drug_patients.start_date, " +
        " drug_patients.end_date, " +
        " posologies.date_created " +
        " FROM posologies "+
        " LEFT JOIN drug_patients ON drug_patients.id = posologies.treatment_id "+
        " LEFT JOIN patients ON patients.id = drug_patients.patient_id "+
        " LEFT JOIN drugs ON drugs.id = drug_patients.drug_id "+
        " LEFT JOIN users ON users.id = patients.user_id "+
        " WHERE 1 = 1 ";

        let params = [];
        if (filters.id) {
            sql += " and drug_patients.id = ?"
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
        sql += " order by posologies.date_created desc limit 1"
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
        let sql = "INSERT INTO posologies SET ? ";
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