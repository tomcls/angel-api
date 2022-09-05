const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Survey {
    constructor() { }
    async groupPatients(filters) {
        let sql = " SELECT survey_moods.patient_id "+
        "FROM survey_moods " +
        "LEFT JOIN moods on survey_moods.mood_id = moods.id " +
        "LEFT JOIN mood_descriptions on mood_descriptions.mood_id = moods.id " +
        "LEFT JOIN patients on survey_moods.patient_id = patients.id " +
        "LEFT JOIN users on patients.user_id = users.id " +
        "WHERE 1=1 ";
        let params = [];
        if (filters.patient_id) {
            sql += " and survey_moods.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.date_created) {
            sql += " and survey_moods.date_created >= ?"
            params.push(filters.date_created);
        }
        if (filters.mood_id) {
            sql += " and survey_moods.mood_id = ?"
            params.push(filters.mood_id);
        }
        if (filters.lang_id) {
            sql += " and mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        sql += " GROUP by survey_moods.patient_id";
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
    async groupDates(filters) {
        let sql = " SELECT DATE_FORMAT(survey_moods.date_created, '%Y-%m-%d')  date "+
        "FROM survey_moods " +
        "LEFT JOIN moods on survey_moods.mood_id = moods.id " +
        "LEFT JOIN mood_descriptions on mood_descriptions.mood_id = moods.id " +
        "LEFT JOIN patients on survey_moods.patient_id = patients.id " +
        "LEFT JOIN users on patients.user_id = users.id " +
        "WHERE 1=1 ";
        let params = [];
        if (filters.patient_id) {
            sql += " and survey_moods.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.date_created) {
            sql += " and survey_moods.date_created >= ?"
            params.push(filters.date_created);
        }
        if (filters.mood_id) {
            sql += " and survey_moods.mood_id = ?"
            params.push(filters.mood_id);
        }
        if (filters.lang_id) {
            sql += " and mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        sql += " GROUP by date";
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
    async groupMoods(filters) {
        let sql = " SELECT moods.id, "+
        "mood_descriptions.name "+
        "FROM survey_moods " +
        "LEFT JOIN moods on survey_moods.mood_id = moods.id " +
        "LEFT JOIN mood_descriptions on mood_descriptions.mood_id = moods.id " +
        "LEFT JOIN patients on survey_moods.patient_id = patients.id " +
        "LEFT JOIN users on patients.user_id = users.id " +
        "WHERE 1=1 ";
        let params = [];
        if (filters.patient_id) {
            sql += " and survey_moods.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.date_created) {
            sql += " and survey_moods.date_created >= ?"
            params.push(filters.date_created);
        }
        if (filters.mood_id) {
            sql += " and survey_moods.mood_id = ?"
            params.push(filters.mood_id);
        }
        if (filters.lang_id) {
            sql += " and mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        sql += " GROUP by moods.id";
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
    async moods(filters) {
        let sql = "SELECT "+
            "survey_moods.id as survey_mood_id, "+
            "survey_moods.patient_id, " +
            "survey_moods.mood_id, " +
            "survey_moods.score, " +
            "DATE_FORMAT(survey_moods.date_created, '%Y-%m-%d')  date_created," +
            "survey_moods.date_updated, " +
            "mood_descriptions.name, " +
            "users.firstname, "+
            "users.lastname, "+
            "users.avatar " +
            "FROM survey_moods " +
            "LEFT JOIN moods on survey_moods.mood_id = moods.id " +
            "LEFT JOIN mood_descriptions on mood_descriptions.mood_id = moods.id " +
            "LEFT JOIN patients on survey_moods.patient_id = patients.id " +
            "LEFT JOIN users on patients.user_id = users.id " +
            "WHERE 1=1 ";
        let params = [];
        if (filters.patient_id) {
            sql += " and survey_moods.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.mood_id) {
            sql += " and survey_moods.mood_id = ?"
            params.push(filters.mood_id);
        }
        if (filters.date_created) {
            sql += " and survey_moods.date_created >= ?"
            params.push(filters.date_created);
        }
        if (filters.lang_id) {
            sql += " and mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        sql += " order by survey_moods.date_created, survey_moods.patient_id desc ";
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
    async countMoods(filters) {
        let sql = "SELECT count(*) as total "+
            "FROM survey_moods " +
            "LEFT JOIN moods on survey_moods.mood_id = moods.id " +
            "LEFT JOIN mood_descriptions on mood_descriptions.mood_id = moods.id " +
            "WHERE 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += " and survey_moods.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.mood_id) {
            sql += " and survey_moods.mood_id = ?"
            params.push(filters.mood_id);
        }
        if (filters.lang_id) {
            sql += " and mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by survey_moods.id desc " + filterClause;
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

    async sideEffects(filters) {
        let sql = "SELECT "+
            "survey_effects.id, "+
            "survey_effects.id as survey_side_effect_id, "+
            "survey_effects.patient_id, " +
            "survey_effects.side_effect_id, " +
            "survey_effects.score, " +
            "survey_effects.date_created date, "+
            "DATE_FORMAT(survey_effects.date_created, '%Y-%m-%d')  date_created," +
            "survey_effects.date_updated, " +
            "side_effect_descriptions.name, " +
            "users.firstname, "+
            "users.lastname, "+
            "users.avatar " +
            "FROM survey_effects " +
            "LEFT JOIN side_effects on survey_effects.side_effect_id = side_effects.id " +
            "LEFT JOIN side_effect_descriptions on side_effect_descriptions.side_effect_id = side_effects.id " +
            "LEFT JOIN patients on survey_effects.patient_id = patients.id " +
            "LEFT JOIN users on patients.user_id = users.id " +
            "WHERE 1=1 ";
        let params = [];
        if (filters.patient_id) {
            sql += " and survey_effects.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.mood_id) {
            sql += " and survey_effects.mood_id = ?"
            params.push(filters.mood_id);
        }
        if (filters.date_created) {
            sql += " and survey_effects.date_created >= ?"
            params.push(filters.date_created);
        }
        if (filters.lang_id) {
            sql += " and side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        sql += " order by survey_effects.date_created, survey_effects.patient_id desc ";
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
    async countSideEffects(filters) {
        let sql = "SELECT count(*) as total "+
            "FROM survey_effects " +
            "LEFT JOIN side_effects on survey_effects.side_effect_id = side_effects.id " +
            "LEFT JOIN side_effect_descriptions on side_effect_descriptions.side_effect_id = side_effects.id " +
            "LEFT JOIN patients on survey_effects.patient_id = patients.id " +
            "LEFT JOIN users on patients.user_id = users.id " +
            "WHERE 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += " and survey_effects.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.side_effect_id) {
            sql += " and survey_effects.side_effect_id = ?"
            params.push(filters.side_effect_id);
        }
        if (filters.lang_id) {
            sql += " and side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by side_effects.id desc " + filterClause;
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
