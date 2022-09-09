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
    async groupDates(filters) {
        let sql = " SELECT DATE_FORMAT(survey_moods.date_created, '%Y-%m-%d')  date " +
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
    async groupEffects(filters) {
        let sql = "SELECT survey_effects.id,"+
                    " survey_effects.id AS survey_side_effect_id,"+
                    " survey_effects.patient_id,"+
                    " survey_effects.side_effect_id,"+
                    " (SELECT count(*) "+
                        " FROM survey_effects s "+
                        " WHERE s.patient_id = survey_effects.patient_id ) AS total_effects,"+
                    " SUM(score)score,"+
                    " survey_effects.patient_id,"+
                    " survey_effects.date_created date, DATE_FORMAT(survey_effects.date_created, '%Y-%m-%d') date_created,"+
                    "survey_effects.date_updated,"+
                    "side_effect_descriptions.name,"+
                    "users.firstname,"+
                    "users.lastname,"+
                    "users.avatar"+
            " FROM survey_effects"+
            " LEFT JOIN side_effects ON survey_effects.side_effect_id = side_effects.id"+
            " LEFT JOIN side_effect_descriptions ON side_effect_descriptions.side_effect_id = side_effects.id"+
            " LEFT JOIN patients ON survey_effects.patient_id = patients.id"+
            " LEFT JOIN users ON patients.user_id = users.id"+
            " WHERE ";
            
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += "  side_effects.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.from_date) {
            sql += ((params.length) ? ' AND ' : '') + "  side_effects.date_created >= ?"
            params.push(filters.from_date);
        }
        if (filters.to_date) {
            sql += ((params.length) ? ' AND ' : '') + "  side_effects.date_created <= ?"
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
        const combined = [...params, ...paramsSearch]
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql +=  " GROUP BY survey_effects.patient_id ";
        sql +=   " ORDER BY date DESC" + filterClause;
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
    async countGroupEffects(filters) {
        let sql = " SELECT count(*) as total from (SELECT survey_effects.patient_id "+
            " FROM survey_effects"+
            " LEFT JOIN side_effects ON survey_effects.side_effect_id = side_effects.id"+
            " LEFT JOIN side_effect_descriptions ON side_effect_descriptions.side_effect_id = side_effects.id"+
            " LEFT JOIN patients ON survey_effects.patient_id = patients.id"+
            " LEFT JOIN users ON patients.user_id = users.id"+
            " WHERE ";
            
        let params = [];
        let filterClause = '';
        if (filters.patient_id) {
            sql += "  survey_moods.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.from_date) {
            sql += ((params.length) ? ' AND ' : '') + "  side_effects.date_created >= ?"
            params.push(filters.from_date);
        }
        if (filters.to_date) {
            sql += ((params.length) ? ' AND ' : '') + "  side_effects.date_created <= ?"
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
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  side_effects.score = ?"
            paramsSearch.push(filters.score);
        }
        if (filters.name) {
            sqlSearch += ((paramsSearch.length) ? ' OR ' : '') + "  side_effects.name like ?"
            paramsSearch.push(filters.name + '%');
        }
        if (paramsSearch.length) {
            sql = sql + " AND (" + sqlSearch + ")";
        }
        const combined = [...params, ...paramsSearch]
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql +=  " GROUP BY survey_effects.patient_id ) as t";
        console.log(sql)
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

    async groupMoods(filters) {
        let sql = "SELECT survey_moods.id,"+
                    " survey_moods.id AS survey_mood_id,"+
                    " survey_moods.patient_id,"+
                    " survey_moods.mood_id,"+
                    " (SELECT count(*) "+
                        " FROM survey_moods s "+
                        " WHERE s.patient_id = survey_moods.patient_id ) AS total_effects,"+
                    " SUM(score)score,"+
                    " survey_moods.patient_id,"+
                    " survey_moods.date_created date, DATE_FORMAT(survey_moods.date_created, '%Y-%m-%d') date_created,"+
                    "survey_moods.date_updated,"+
                    "mood_descriptions.name,"+
                    "users.firstname,"+
                    "users.lastname,"+
                    "users.avatar"+
            " FROM survey_moods"+
            " LEFT JOIN moods ON survey_moods.mood_id = moods.id"+
            " LEFT JOIN mood_descriptions ON mood_descriptions.mood_id = moods.id"+
            " LEFT JOIN patients ON survey_moods.patient_id = patients.id"+
            " LEFT JOIN users ON patients.user_id = users.id"+
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
        sql +=  " GROUP BY survey_moods.patient_id ";
        sql +=   " ORDER BY date DESC" + filterClause;
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

    async countGroupMoods(filters) {
        let sql = " SELECT count(*) as total from (SELECT survey_moods.patient_id "+
            " FROM survey_moods"+
            " LEFT JOIN moods ON survey_moods.side_effect_id = moods.id"+
            " LEFT JOIN side_effect_descriptions ON side_effect_descriptions.side_effect_id = moods.id"+
            " LEFT JOIN patients ON survey_moods.patient_id = patients.id"+
            " LEFT JOIN users ON patients.user_id = users.id"+
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
        sql +=  " GROUP BY survey_moods.patient_id ) as t";
        console.log(sql)
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
            sql += ((params.length) ? ' AND ' : '') + "  date_created >= ?"
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
}
