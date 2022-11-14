const conn = require("../utils/conn");
const db = conn.conn();
module.exports = class Hospital {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT *,id as hospital_id FROM hospitals where 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and id = ?"
            params.push(filters.id);
        }
        let sqlSearch = '';
        if (filters.name) {
            sqlSearch +=  " hospitals.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.email) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" hospitals.email like ?"
            params.push(filters.email + '%');
        }
        if (filters.phone) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" hospitals.phone like ?"
            params.push(filters.phone + '%');
        }
        if(sqlSearch !=='') {
            sql += ' AND (' + sqlSearch + ') ';
        }
        if(filters.limit) {
            filterClause = " limit "+((filters.page)*filters.limit)+', '+(filters.limit*(filters.page+1));
        }
        sql += " order by date_created desc "+filterClause;
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
        let sql = "SELECT count(*) total FROM hospitals where 1=1 ";
        let params = [];
        if (filters.id) {
            sql += " and id = ?"
            params.push(filters.id);
        }
        let sqlSearch = '';
        if (filters.name) {
            sqlSearch +=  " hospitals.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.email) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" hospitals.email like ?"
            params.push(filters.email + '%');
        }
        if (filters.phone) {
            sqlSearch += ((sqlSearch)?' OR ': ' ')+" hospitals.phone like ?"
            params.push(filters.phone + '%');
        }
        if(sqlSearch !=='') {
            sql += ' AND (' + sqlSearch + ') ';
        }
        sql += " order by date_created desc limit 30"
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
        let sql = "SELECT *,id as hospital_id FROM hospitals where 1=1 ";
        let params = [];
        if (filters.id) {
            sql += " and id = ?"
            params.push(filters.id);
        } else if (filters.hospital_id) {
            sql += " and id = ?"
            params.push(filters.hospital_id);
        }
        if (filters.name) {
            sql += " and name = ?"
            params.push(filters.name);
        }
        if (filters.email) {
            sql += " and email = ?"
            params.push(filters.email);
        }
        sql += " order by date_created desc limit 1"
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
    async add(params) {
        let sql = "INSERT INTO hospitals SET ? ";
        try {
            const add = await db.query(sql, params);
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
        let sql = "UPDATE hospitals  ";
        
        const params = [];
        if (o.id) {
            sql += " SET id = ?";
            params.push(o.id);
        } else {
            throw {error: 'No pk provided'}
        }
        if (o.name) {
            sql += ",  name = ?"
            params.push(o.name);
        }
        if (o.email) {
            sql += " ,  email = ?"
            params.push(o.email);
        }
        if (o.phone) {
            sql += ",   phone = ?"
            params.push(o.phone);
        }
        if (o.address) {
            sql += ",   address = ?"
            params.push(o.address);
        }
        if (o.street_number) {
            sql += ",   street_number = ?"
            params.push(o.street_number);
        }
        if (o.zip) {
            sql += ",   zip = ?"
            params.push(o.zip);
        }
        if (o.city) {
            sql += ",   city = ?"
            params.push(o.city);
        }
        if (o.country) {
            sql += ",   country = ?"
            params.push(o.country);
        }
        sql += ",   date_updated = ?"
        params.push(new Date());
        sql += " where id="+o.id
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

            let sql = "delete from hospitals where id in (?) ";
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
