const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class SurveyEffectDescriptions {
    constructor() { }

    async get(filters) {
        const params = [];
        let sql = "SELECT survey_effect_descriptions.id,survey_effect_descriptions.user_id, image, " +
        "DATE_FORMAT(survey_effect_descriptions.date, '%Y-%m-%d')  date_created " +
        "FROM survey_effect_descriptions " +
        //"where DATE_FORMAT(now(), '%Y-%m-%d') = DATE_FORMAT(survey_effect_descriptions.date, '%Y-%m-%d')" ;
        " WHERE 1 =1 ";
        if (filters.user_id) {
            sql += " AND survey_effect_descriptions.user_id = ?"
            params.push(filters.user_id);
        }
        if(filters.survey_effect_description_id) {
            sql += " AND survey_effect_descriptions.id = ?"
            params.push(filters.survey_effect_description_id);
        }
        try {
            let rows = await db.query(sql,params);
            if (rows && rows.length > 0) {
                return rows[0];
            }
            return null;
        } catch (error) {
            return error
        }
    }
    async list(filters) {
        const params = [];
        let sql = "SELECT survey_effect_descriptions.id,survey_effect_descriptions.user_id, image, date, " +
        "date  date_created " +
        "FROM survey_effect_descriptions " +
        " left join users on users.id = survey_effect_descriptions.user_id " +
        " left join patients on users.id = patients.user_id " +
        "where 1 = 1" ;
        if (filters.user_id) {
            sql += " AND survey_effect_descriptions.user_id = ?"
            params.push(filters.user_id);
        }
        if (filters.patient_id) {
            sql += " AND patients.id = ?"
            params.push(filters.patient_id);
        }
        sql += ' order by date desc';
        try {
            let rows = await db.query(sql,params);
            if (rows && rows.length > 0) {
                return rows;
            }
            return null;
        } catch (error) {
            return error
        }
    }
    async update(o) {
        let sql = "UPDATE survey_effect_descriptions  ";
        
        const params = [];
        if (o.image) {
            sql += " SET image = ?";
            params.push(o.image);
        } 
        params.push(new Date());
        sql += " where id="+o.id;
        
        try {
            const updated = await db.query(sql, params);
            return {
                saved: updated,
                id: o.id
            };
        }
        catch (err) {
            return err;
        }
    }
    async insert(params) {
        let sql = "INSERT INTO survey_effect_descriptions SET ? ";
        try {
            const add = await db.query(sql, params);
            return {
                saved: add.affectedRows,
                id: add.insertId
            };
        }
        catch (err) {
            return err;
        }
    }

}