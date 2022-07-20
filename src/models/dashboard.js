const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Dashboard {
    constructor() { }
    async moods(filters) {
        let params = [];
        let sql = "SELECT survey_moods.mood_id," +
            "sum(score) score," +
            "mood_descriptions.name " +
            "FROM survey_moods " +
            "LEFT JOIN moods ON moods.id = survey_moods.mood_id " +
            "LEFT JOIN mood_descriptions ON moods.id = mood_descriptions.mood_id " +
            "GROUP BY survey_moods.mood_id ";
        try {
            let rows = await db.query(sql, params);
            if (rows && rows.length > 0) {
                return rows;
            }
            return null;
        } catch (error) {
            console.log(error)
            return error
        }
    }
}