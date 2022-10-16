const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Notification {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT notifications.id as notification_id," +
            " notifications.id as id," +
            " notifications.object ," +
            " notifications.content ," +
            " notifications.user_from ," +
            " notifications.user_to ," +
            " notifications.readed ," +
            " notifications.date_created ," +
            " user_from.firstname firstname_from," +
            " user_from.lastname lastname_from," +
            " user_from.phone phone_from," +
            " user_from.email email_from," +
            " user_to.firstname firstname_to," +
            " user_to.lastname lastname_to," +
            " user_to.phone phone_to," +
            " user_to.email email_to" +
            " FROM notifications " +
            " LEFT JOIN users user_from ON user_from.id = notifications.user_from " +
            " LEFT JOIN users user_to ON user_to.id = notifications.user_to " +
            " WHERE 1 = 1 ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and notifications.id = ?"
            params.push(filters.id);
        }
        if (filters.user_to) {
            sql += " and notifications.user_to = ?"
            params.push(filters.user_to);
        }
        if (filters.user_from) {
            sql += " and notifications.user_from = ?"
            params.push(filters.user_from);
        }
        if (filters.readed) {
            sql += " and notifications.readed = ?"
            params.push(filters.readed);
        }
        if (filters.firstname) {
            sql += " and ( user_from.firstname like ? OR user_to.firstname  like ?)"
            params.push(filters.firstname+'%');
        }
        if (filters.lastname) {
            sql += " and ( user_from.lastname like ? OR user_to.lastname  like ?)"
            params.push(filters.lastname+'%');
        }
        if (filters.email) {
            sql += " and ( user_from.email like ? OR user_to.email  like ?)"
            params.push(filters.email+'%');
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by notifications.date_created desc " + filterClause;
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
        let sql = "SELECT count(*) total " +
            " FROM notifications " +
            " LEFT JOIN users user_from ON user_from.id = notifications.user_from " +
            " LEFT JOIN users user_to ON user_to.id = notifications.user_to " +
            " WHERE 1 = 1 ";
        let params = [];
        if (filters.user_to) {
            sql += " and notifications.user_to = ?"
            params.push(filters.user_to);
        }
        if (filters.user_from) {
            sql += " and notifications.user_from = ?"
            params.push(filters.user_from);
        }
        if (filters.readed) {
            sql += " and notifications.readed = ?"
            params.push(filters.readed);
        }
        if (filters.firstname) {
            sql += " and ( user_from.firstname like ? OR user_to.firstname  like ?)"
            params.push(filters.firstname+'%');
        }
        if (filters.lastname) {
            sql += " and ( user_from.lastname like ? OR user_to.lastname  like ?)"
            params.push(filters.lastname+'%');
        }
        if (filters.email) {
            sql += " and ( user_from.email like ? OR user_to.email  like ?)"
            params.push(filters.email+'%');
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
        let sql = "SELECT notifications.id as notification_id," +
        " notifications.id as id," +
        " notifications.object ," +
        " notifications.content ," +
        " notifications.user_from ," +
        " notifications.user_to ," +
        " notifications.readed ," +
        " notifications.date_created ," +
        " user_from.firstname firstname_from," +
        " user_from.lastname lastname_from," +
        " user_from.phone phone_from," +
        " user_from.email email_from," +
        " user_to.firstname firstname_to," +
        " user_to.lastname lastname_to," +
        " user_to.phone phone_to," +
        " user_to.email email_to" +
        " FROM notifications " +
        " LEFT JOIN users user_from ON user_from.id = notifications.user_from " +
        " LEFT JOIN users user_to ON user_to.id = notifications.user_to " +
        " WHERE 1 = 1";
        let params = [];
        if (filters.id) {
            sql += " and notifications.id = ?"
            params.push(filters.id);
        }
        if (filters.user_from) {
            sql += " and notifications.user_from = ?"
            params.push(filters.user_from);
        }
        if (filters.readed) {
            sql += " and notifications.readed = ?"
            params.push(filters.readed);
        }
        if (filters.firstname) {
            sql += " and ( user_from.firstname like ? OR user_to.firstname  like ?)"
            params.push(filters.firstname+'%');
        }
        if (filters.lastname) {
            sql += " and ( user_from.lastname like ? OR user_to.lastname  like ?)"
            params.push(filters.lastname+'%');
        }
        if (filters.email) {
            sql += " and ( user_from.email like ? OR user_to.email  like ?)"
            params.push(filters.email+'%');
        }
        sql += "  limit 1";
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
        let sql = "INSERT INTO notifications SET ? ";
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
        let sql = "UPDATE notifications  ";

        const params = [];
        if (o.id) {
            sql += " SET id = ?";
            params.push(o.id);
        } else {
            throw { error: 'No pk provided' }
        }
        if (o.readed) {
            sql += ",  readed = ?"
            params.push(o.readed);
        }
        
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
    async delete(o) {
        if(o && o.ids) {

            let sql = "delete from notifications where id in (?) ";
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

}
