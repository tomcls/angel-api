const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Mood {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT moods.id as mood_id, mood_descriptions.id as mood_description_id, " +
            "moods.date_created, " +
            "moods.date_updated, " +
            "mood_descriptions.name, " +
            "mood_descriptions.description, " +
            "mood_descriptions.lang_id " +
            "FROM moods " +
            "LEFT JOIN mood_descriptions on moods.id = mood_descriptions.mood_id "
            "WHERE 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.mood_id) {
            sql += " and moods.id = ?"
            params.push(filters.mood_id);
        }
        if (filters.name) {
            sql += " and mood_descriptions.name like ?"
            params.push(filters.name+'%');
        }
        if (filters.lang_id) {
            sql += " and mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by moods.id desc " + filterClause;
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
        let sql = "SELECT count(*) as total FROM moods LEFT JOIN mood_descriptions on moods.id = mood_descriptions.mood_id where 1=1  ";
       
        let params = [];
        if (filters.id) {
            sql += " and moods.id = ?"
            params.push(filters.id);
        }
        if (filters.name) {
            sql += " and mood_descriptions.name like ?"
            params.push(filters.name+'%');
        }
        if (filters.lang_id) {
            sql += " and mood_descriptions.lang_id = ?"
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
        let sql = "SELECT moods.id as mood_id, mood_descriptions.id as mood_description_id, " +
            "moods.date_created," +
            "moods.date_updated, "  +
            "mood_descriptions.name, " +
            "mood_descriptions.description, " +
            "mood_descriptions.lang_id " +
            "FROM moods "  +
            "LEFT JOIN mood_descriptions on moods.id = mood_descriptions.mood_id " + 
            "WHERE 1 = 1 ";
        let params = [];
        if (filters.mood_id) {
            sql += " and moods.id = ?"
            params.push(filters.mood_id);
        }
        if (filters.name) {
            sql += " and mood_descriptions.name = ?"
            params.push(filters.name);
        }
        if (filters.lang_id) {
            sql += " and mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        sql += " order by moods.date_created desc limit 1"
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
        let sql = "INSERT INTO moods ()  VALUES()";

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
        let sql = "UPDATE moods  ";

        const params = [];
        if (o.id) {
            sql += " SET id = ?";
            params.push(o.id);
        } else {
            throw { error: 'No pk provided' }
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

        let sql = "SELECT moods.id as mood_id," +
            "moods.id as id," +
            "mood_descriptions.name," +
            "mood_descriptions.description, " +
            "moods.date_created," +
            "moods.date_updated " +
            "FROM moods " +
            "LEFT JOIN mood_descriptions on moods.id = mood_descriptions.mood_id " + 
            "WHERE  ";
        let params = [];
        let filterClause = '';
        if (filters.mood_id) {
            sql += " and moods.id = ?"
            params.push(filters.mood_id);
        }
        if (filters.name) {
            sql += ((params.length)?' OR ': '')+"  mood_descriptions.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by moods.date_created desc " + filterClause;
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

            let sql = "delete from moods where id in (?) ";
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

    async addSurvey(o) {
        let sql = "INSERT INTO survey_moods (patient_id,mood_id,score,date_created)  VALUES("+parseInt(o.patient_id,10)+","+parseInt(o.mood_id,10)+","+parseInt(o.score,10)+",'"+o.date_created+"')";
        try {
            const add = await db.query(sql);
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
