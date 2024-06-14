const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Survey {
    constructor() { }
    async groupPatients(filters) {
        let sql = " SELECT survey_moods.patient_id " +
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
    async groupSideEffectDates(filters) {
        let sql = " SELECT DATE_FORMAT(survey_effects.date_created, '%Y-%m-%d')  date, HOUR(survey_effects.date_created) hour,survey_effects.date_created " +
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
        if (filters.date_created) {
            sql += " and survey_effects.date_created >= ?"
            params.push(filters.date_created);
        }
        if (filters.side_effect_id) {
            sql += " and survey_effects.side_effect_id = ?"
            params.push(filters.side_effect_id);
        }
        if (filters.lang_id) {
            sql += " and side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        sql += " GROUP by date order by date desc limit 30";
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
    async groupMoodsDates(filters) {
        let sql = " SELECT DATE_FORMAT(survey_moods.date_created, '%Y-%m-%d')  date, HOUR(survey_moods.date_created) hour,survey_moods.date_created " +
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
        sql += " GROUP by date desc limit 30";
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
    async groupEffects(filters) {
        let sql = "SELECT survey_effects.id," +
            " survey_effects.id AS survey_side_effect_id," +
            " survey_effects.patient_id," +
            " survey_effects.side_effect_id," +
            " (SELECT count(*) " +
            " FROM survey_effects s " +
            " WHERE s.patient_id = survey_effects.patient_id ) AS total_effects," +
            " SUM(score)score," +
            " survey_effects.patient_id," +
            " survey_effects.date_created date, DATE_FORMAT(survey_effects.date_created, '%Y-%m-%d') date_created," +
            "survey_effects.date_updated," +
            "side_effect_descriptions.name," +
            "users.firstname," +
            "users.lastname," +
            "users.avatar" +
            " FROM survey_effects" +
            " LEFT JOIN side_effects ON survey_effects.side_effect_id = side_effects.id" +
            " LEFT JOIN side_effect_descriptions ON side_effect_descriptions.side_effect_id = side_effects.id" +
            " LEFT JOIN patients ON survey_effects.patient_id = patients.id" +
            " LEFT JOIN users ON patients.user_id = users.id" +
            " WHERE ";

        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += "  side_effects.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.from_date) {
            sql += ((params.length) ? ' AND ' : '') + "  survey_effects.date_created >= ?"
            params.push(filters.from_date);
        }
        if (filters.to_date) {
            sql += ((params.length) ? ' AND ' : '') + "  survey_effects.date_created <= ?"
            params.push(filters.to_date);
        }
        if (filters.lang_id) {
            sql += ((params.length) ? ' AND ' : '') + "  side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id);
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
        if (filters.score) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  survey_effects.score = ?"
            paramsSearch.push(filters.score);
        }
        if (filters.name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  side_effect_descriptions.name like ?"
            paramsSearch.push(filters.name + '%');
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }
        const combined = [...params, ...paramsSearch]
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " GROUP BY survey_effects.patient_id ";
        sql += " ORDER BY date DESC" + filterClause;
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


    async groupMoods(filters) {
        let sql = "SELECT survey_moods.id," +
            " survey_moods.id AS survey_mood_id," +
            " survey_moods.patient_id," +
            " survey_moods.mood_id," +
            " (SELECT count(*) " +
            " FROM survey_moods s " +
            " WHERE s.patient_id = survey_moods.patient_id ) AS total_effects," +
            " SUM(score)score," +
            " survey_moods.patient_id," +
            " survey_moods.date_created date, DATE_FORMAT(survey_moods.date_created, '%Y-%m-%d') date_created," +
            "survey_moods.date_updated," +
            "mood_descriptions.name," +
            "users.firstname," +
            "users.lastname," +
            "users.avatar" +
            " FROM survey_moods" +
            " LEFT JOIN moods ON survey_moods.mood_id = moods.id" +
            " LEFT JOIN mood_descriptions ON mood_descriptions.mood_id = moods.id" +
            " LEFT JOIN patients ON survey_moods.patient_id = patients.id" +
            " LEFT JOIN users ON patients.user_id = users.id" +
            " WHERE ";

        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += "  survey_moods.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.from_date) {
            sql += ((params.length) ? ' AND ' : '') + "  survey_moods.date_created >= ?"
            params.push(filters.from_date);
        }
        if (filters.to_date) {
            sql += ((params.length) ? ' AND ' : '') + "  survey_moods.date_created <= ?"
            params.push(filters.to_date);
        }
        if (filters.lang_id) {
            sql += ((params.length) ? ' AND ' : '') + "  mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
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
        if (filters.score) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  survey_moods.score = ?"
            paramsSearch.push(filters.score);
        }
        if (filters.name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  mood_descriptions.name like ?"
            paramsSearch.push(filters.name + '%');
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }
        const combined = [...params, ...paramsSearch]
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " GROUP BY survey_moods.patient_id ";
        sql += " ORDER BY date DESC" + filterClause;
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


    async moods(filters) {
        let sql = "SELECT " +
            "survey_moods.id, " +
            "survey_moods.id as survey_mood_id, " +
            "survey_moods.patient_id, " +
            "survey_moods.mood_id, " +
            "survey_moods.score, " +
            "survey_moods.patient_id, " +
            "survey_moods.date_created date, " +
            "DATE_FORMAT(survey_moods.date_created, '%Y-%m-%d')  date_created," +
            "survey_moods.date_updated, " +
            "mood_descriptions.name, " +
            "users.firstname, " +
            "users.lastname, " +
            "users.avatar " +
            "FROM survey_moods " +
            "LEFT JOIN moods on survey_moods.mood_id = moods.id " +
            "LEFT JOIN mood_descriptions on mood_descriptions.mood_id = moods.id " +
            "LEFT JOIN patients on survey_moods.patient_id = patients.id " +
            "LEFT JOIN users on patients.user_id = users.id " +
            "WHERE  ";
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += "  survey_moods.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.from_date) {
            sql += ((params.length) ? ' AND ' : '') + "  survey_moods.date_created >= ?"
            params.push(filters.from_date);
        }
        if (filters.to_date) {
            sql += ((params.length) ? ' AND ' : '') + "  survey_moods.date_created <= ?"
            params.push(filters.to_date);
        }
        if (filters.lang_id) {
            sql += ((params.length) ? ' AND ' : '') + "  mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
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
        if (filters.score) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  survey_moods.score = ?"
            paramsSearch.push(filters.score);
        }
        if (filters.name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  mood_descriptions.name like ?"
            paramsSearch.push(filters.name + '%');
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }
        const combined = [...params, ...paramsSearch]
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by survey_moods.patient_id desc, date desc " + filterClause;
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
    async countMoods(filters) {
        let sql = "SELECT count(*) as total " +
            "FROM survey_moods " +
            "LEFT JOIN moods on survey_moods.mood_id = moods.id " +
            "LEFT JOIN mood_descriptions on mood_descriptions.mood_id = moods.id " +
            "LEFT JOIN patients on survey_moods.patient_id = patients.id " +
            "LEFT JOIN users on patients.user_id = users.id " +
            "WHERE  ";
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += "  survey_moods.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.date_created) {
            sql += ((params.length) ? ' AND ' : '') + "  date_created >= ?"
            params.push(filters.date_created);
        }
        if (filters.lang_id) {
            sql += ((params.length) ? ' AND ' : '') + "  mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
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
        if (filters.score) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  survey_moods.score = ?"
            paramsSearch.push(filters.score);
        }
        if (filters.name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  mood_descriptions.name like ?"
            paramsSearch.push(filters.name + '%');
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }
        const combined = [...params, ...paramsSearch]
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
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

    async sideEffects(filters) {
        let sql = "SELECT " +
            "survey_effects.id, " +
            "survey_effects.id as survey_side_effect_id, " +
            "survey_effects.patient_id, " +
            "survey_effects.side_effect_id, " +
            "survey_effects.score, " +
            "survey_effects.patient_id, " +
            "survey_effects.date_created date, " +
            "DATE_FORMAT(survey_effects.date_created, '%Y-%m-%d')  date_created," +
            "survey_effects.date_updated, " +
            "side_effect_descriptions.name, " +
            "users.firstname, " +
            "users.lastname, " +
            "users.avatar " +
            "FROM survey_effects " +
            "LEFT JOIN side_effects on survey_effects.side_effect_id = side_effects.id " +
            "LEFT JOIN side_effect_descriptions on side_effect_descriptions.side_effect_id = side_effects.id " +
            "LEFT JOIN patients on survey_effects.patient_id = patients.id " +
            "LEFT JOIN users on patients.user_id = users.id " +
            "WHERE  ";
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += "  survey_effects.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.from_date) {
            sql += ((params.length) ? ' AND ' : '') + "  survey_effects.date_created >= ?"
            params.push(filters.from_date);
        }
        if (filters.to_date) {
            sql += ((params.length) ? ' AND ' : '') + "  survey_effects.date_created <= ?"
            params.push(filters.to_date);
        }
        if (filters.lang_id) {
            sql += ((params.length) ? ' AND ' : '') + "  side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id);
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
        if (filters.score) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  survey_effects.score = ?"
            paramsSearch.push(filters.score);
        }
        if (filters.name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  side_effect_descriptions.name like ?"
            paramsSearch.push(filters.name + '%');
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }
        const combined = [...params, ...paramsSearch]
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by survey_effects.patient_id desc, date desc " + filterClause;
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
    async countSideEffects(filters) {
        let sql = "SELECT count(*) as total " +
            "FROM survey_effects " +
            "LEFT JOIN side_effects on survey_effects.side_effect_id = side_effects.id " +
            "LEFT JOIN side_effect_descriptions on side_effect_descriptions.side_effect_id = side_effects.id " +
            "LEFT JOIN patients on survey_effects.patient_id = patients.id " +
            "LEFT JOIN users on patients.user_id = users.id " +
            "WHERE  ";
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += "  survey_effects.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.date_created) {
            sql += ((params.length) ? ' AND ' : '') + "  DATE_FORMAT(survey_effects.date_created, '%Y-%m-%d') = ?"
            params.push(filters.date_created);
        }
        if (filters.lang_id) {
            sql += ((params.length) ? ' AND ' : '') + "  side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id);
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
        if (filters.score) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  survey_effects.score = ?"
            paramsSearch.push(filters.score);
        }
        if (filters.name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  side_effect_descriptions.name like ?"
            paramsSearch.push(filters.name + '%');
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }
        const combined = [...params, ...paramsSearch]
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
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
    async concatEffects(filters) {
        let sql = "SELECT date_created, avatar, firstname, lastname, patient_id,close_monitoring,GROUP_CONCAT(name) total_effects, GROUP_CONCAT( effect_cnt) effect_cnt FROM ( SELECT        survey_effects.patient_id, " +
            " side_effects.id,  " +
            " users.avatar,  " +
            " users.firstname,  " +
            " users.lastname,  " +
            " survey_effects.date_created, "+
            " patients.close_monitoring, "+
            "side_effect_descriptions.name,  " +
            "COUNT(side_effects.id) AS effect_cnt " +
            " FROM survey_effects  " +
            " LEFT JOIN side_effects on survey_effects.side_effect_id = side_effects.id  " +
            " LEFT JOIN patients ON patients.id = survey_effects.patient_id " +
            " LEFT JOIN nurse_patients ON patients.id = nurse_patients.patient_id " +
            " LEFT JOIN doctor_patients ON patients.id = doctor_patients.patient_id " +
            " LEFT JOIN users ON users.id = patients.user_id " +
            "LEFT JOIN side_effect_descriptions on side_effect_descriptions.side_effect_id = side_effects.id " +
            "WHERE ";
        let params = [];
        if (filters.patient_id) {
            sql += "  survey_effects.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.date_created) {
            sql += ((params.length) ? ' AND ' : '') + "  DATE_FORMAT(survey_effects.date_created, '%Y-%m-%d') = ?"
            params.push(filters.date_created);
        }
        if (filters.lang_id) {
            sql += ((params.length) ? ' AND ' : '') + "  side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        if (filters.doctor_id) {
            sql += ((params.length) ? ' AND ' : '') + "  doctor_patients.doctor_id = ?"
            params.push(filters.doctor_id);
        }
        if (filters.nurse_id) {
            sql += ((params.length) ? ' AND ' : '') + "  nurse_patients.nurse_id = ?"
            params.push(filters.nurse_id);
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
        if (filters.score) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  survey_effects.score = ?"
            paramsSearch.push(filters.score);
        }
        if (filters.name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  side_effect_descriptions.name like ?"
            paramsSearch.push(filters.name + '%');
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }

        sql = sql + " GROUP BY survey_effects.patient_id, side_effects.id ORDER BY effect_cnt) as sub " +
            " GROUP BY patient_id";
        const combined = [...params, ...paramsSearch]
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
    async countGroupEffects(filters) {
        let sql = "SELECT count(*) total, patient_id FROM ( SELECT        survey_effects.patient_id, " +
            " side_effects.id,  " +
            " users.avatar,  " +
            " users.firstname,  " +
            " users.lastname,  " +
            " survey_effects.date_created, "+
            "side_effect_descriptions.name,  " +
            "COUNT(side_effects.id) AS effect_cnt " +
            " FROM survey_effects  " +
            " LEFT JOIN side_effects on survey_effects.side_effect_id = side_effects.id  " +
            " LEFT JOIN patients ON patients.id = survey_effects.patient_id " +
            " LEFT JOIN users ON users.id = patients.user_id " +
            "LEFT JOIN side_effect_descriptions on side_effect_descriptions.side_effect_id = side_effects.id " +
            "WHERE ";

            let params = [];
            if (filters.patient_id) {
                sql += "  survey_effects.patient_id = ?"
                params.push(filters.patient_id);
            }
            if (filters.date_created) {
                sql += ((params.length) ? ' AND ' : '') + "  DATE_FORMAT(survey_effects.date_created, '%Y-%m-%d') = ?"
                params.push(filters.date_created);
            }
            if (filters.lang_id) {
                sql += ((params.length) ? ' AND ' : '') + "  side_effect_descriptions.lang_id = ?"
                params.push(filters.lang_id);
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
            if (filters.score) {
                sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  side_effects.score = ?"
                paramsSearch.push(filters.score);
            }
            if (filters.name) {
                sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  side_effect_descriptions.name like ?"
                paramsSearch.push(filters.name + '%');
            }
            if (paramsSearch.length) {
                sql = sql + " AND (" + sqlSearch + ")";
            }
    
            sql = sql + " GROUP BY survey_effects.patient_id, side_effects.id ORDER BY effect_cnt) as sub " +
                " GROUP BY patient_id";
        const combined = [...params, ...paramsSearch]
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
    async concatMoods(filters) {


        let sql = "SELECT date_created,avatar, firstname, lastname, patient_id,close_monitoring, GROUP_CONCAT(name) total_moods, GROUP_CONCAT( mood_cnt) mood_cnt, GROUP_CONCAT(score) score FROM ( SELECT        survey_moods.patient_id, " +
            " moods.id,  " +
            " users.avatar,  " +
            " users.firstname,  " +
            " users.lastname,  " +
            " mood_descriptions.name,  " +
            " patients.close_monitoring, "+
            " survey_moods.score, " +
            " survey_moods.date_created, " +
            " COUNT(moods.id) AS mood_cnt " +
            " FROM survey_moods  " +
            " LEFT JOIN moods on survey_moods.mood_id = moods.id  " +
            " LEFT JOIN patients ON patients.id = survey_moods.patient_id " +
            " LEFT JOIN nurse_patients ON patients.id = nurse_patients.patient_id " +
            " LEFT JOIN doctor_patients ON patients.id = doctor_patients.patient_id " +
            " LEFT JOIN users ON users.id = patients.user_id " +
            "LEFT JOIN mood_descriptions on mood_descriptions.mood_id = moods.id " +
            "WHERE  ";

        let params = [];
        if (filters.patient_id) {
            sql += "  survey_effects.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.date_created) {
            sql += ((params.length) ? ' AND ' : '') + "  DATE_FORMAT(survey_moods.date_created, '%Y-%m-%d') = ?"
            params.push(filters.date_created);
        }
        if (filters.lang_id) {
            sql += ((params.length) ? ' AND ' : '') + "  mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        if (filters.nurse_id) {
            sql += ((params.length) ? ' AND ' : '') + "  nurse_patients.nurse_id = ?"
            params.push(filters.nurse_id);
        }
        if (filters.doctor_id) {
            sql += ((params.length) ? ' AND ' : '') + "  doctor_patients.doctor_id = ?"
            params.push(filters.doctor_id);
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
        if (filters.score) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  survey_moods.score = ?"
            paramsSearch.push(filters.score);
        }
        if (filters.name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  mood_descriptions.name like ?"
            paramsSearch.push(filters.name + '%');
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }
        sql += " GROUP BY survey_moods.patient_id, moods.id ) as sub " +
            " GROUP BY patient_id";
        const combined = [...params, ...paramsSearch]

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
    async countGroupMoods(filters) {
        let sql = " SELECT count(*) as total from (SELECT survey_moods.patient_id " +
            " FROM survey_moods" +
            " LEFT JOIN moods ON survey_moods.mood_id = moods.id" +
            " LEFT JOIN mood_descriptions ON mood_descriptions.mood_id = moods.id" +
            " LEFT JOIN patients ON survey_moods.patient_id = patients.id" +
            " LEFT JOIN users ON patients.user_id = users.id" +
            " WHERE ";

        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += "  survey_moods.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.from_date) {
            sql += ((params.length) ? ' AND ' : '') + "  survey_moods.date_created >= ?"
            params.push(filters.from_date);
        }
        if (filters.to_date) {
            sql += ((params.length) ? ' AND ' : '') + "  survey_moods.date_created <= ?"
            params.push(filters.to_date);
        }
        if (filters.lang_id) {
            sql += ((params.length) ? ' AND ' : '') + "  mood_descriptions.lang_id = ?"
            params.push(filters.lang_id);
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
        if (filters.score) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  survey_moods.score = ?"
            paramsSearch.push(filters.score);
        }
        if (filters.name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  mood_descriptions.name like ?"
            paramsSearch.push(filters.name + '%');
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }
        const combined = [...params, ...paramsSearch]
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " GROUP BY survey_moods.patient_id ) as t";
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
}
