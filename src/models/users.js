const conn = require("../utils/conn");
const jwt = require("jsonwebtoken")
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_APIKEY);
const db = conn.conn();
module.exports = class User {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT * FROM users where 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and id = ?"
            params.push(filters.id);
        }
        if (filters.firstname) {
            sql += " and firstname like ?%"
            params.push(filters.firstname);
        }
        if (filters.lastname) {
            sql += " and lastname = ?%"
            params.push(filters.lastname);
        }
        if (filters.email) {
            sql += " and email = ?%"
            params.push(filters.email);
        }
        if (filters.role) {
            sql += " and role = ?"
            params.push(filters.role);
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
        let sql = "SELECT count(*) total FROM users where 1=1 ";
        let params = [];
        if (filters.id) {
            sql += " and id = ?"
            params.push(filters.id);
        }
        if (filters.firstname) {
            sql += " and firstname like ?%"
            params.push(filters.firstname);
        }
        if (filters.lastname) {
            sql += " and lastname = ?%"
            params.push(filters.lastname);
        }
        if (filters.email) {
            sql += " and email = ?%"
            params.push(filters.email);
        }
        if (filters.role) {
            sql += " and role = ?"
            params.push(filters.role);
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
        
        let sql = "SELECT * FROM users where 1=1 ";
        let params = [];
        if (filters.id) {
            sql += " and id = ?"
            params.push(filters.id);
        }
        if (filters.user_id) {
            sql += " and id = ?"
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
        sql += " order by date_created desc limit 1"
        try {
            let rows = await db.query(sql, params);
            if (rows && rows.length > 0) {
                return rows[0];
            }
            return null;
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async add(params) {
        let sql = "INSERT INTO users SET ? ";
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
        let sql = "UPDATE users  ";
        
        const params = [];
        if (o.id) {
            sql += " SET id = ?";
            params.push(o.id);
        } else {
            throw {error: 'No pk provided'}
        }
        if (o.firstname) {
            sql += ",  firstname = ?"
            params.push(o.firstname);
        }
        if (o.lastname) {
            sql += ",   lastname = ?"
            params.push(o.lastname);
        }
        if (o.email) {
            sql += " ,  email = ?"
            params.push(o.email);
        }
        if (o.phone) {
            sql += ",   phone = ?"
            params.push(o.phone);
        }
        if (o.lang) {
            sql += ",   lang = ?"
            params.push(o.lang);
        }
        if (o.sex) {
            sql += ",   sex = ?"
            params.push(o.sex);
        }
        if (o.birthday) {
            sql += ",   birthday = ?"
            params.push(o.birthday);
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
        if (o.avatar) {
            sql += ",   avatar = ?"
            params.push(o.avatar);
        }
        if (o.role) {
            sql += ",   role = ?"
            params.push(o.role);
        }
        if (o.active) {
            sql += ",   active = ?"
            params.push(o.active);
        }
        sql += ",   date_updated = ?"
        params.push(new Date());
        sql += " where id="+o.id;
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

    async updatePassword(params) {
        let sql = "UPDATE users set password = ? WHERE email = ? ";
        try {
            const updatePassword = await db.query(sql, params);
            return updatePassword;
        }
        catch (err) {
            return err;
        }
    }
    async requestPassword(email) {
        const user = await this.find({ email: email });
        if (user && user.id) {
            const o = {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                type: user.type,
                date_created: user.date_created
            }
            try {
                const token = jwt.sign(o, process.env.API_SECRET, { expiresIn: "60m" });
                const msg = {
                    to: email,
                    from: process.env.SENDER_EMAIL,
                    subject: 'Reset Password',
                    template_id: 'd-7c19f89a19fe4279afa5570c0f316ce4',
                    dynamicTemplateData: {
                        Weblink: process.env.APP_URL + '/reset-password?hash=' + token
                    },
                };
                try {
                    return await sgMail.send(msg);
                } catch (error) {
                    return error;
                }
            } catch (error) {
                return { error: error };
            }
        } else {
            return { error: 'user not found' };
        }
    }
    async delete(o) {
        if(o && o.ids) {
            let sql = "delete from users where id in ("+o.ids+") ";
            try {
                const del = await db.query(sql);
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
    async coordinators(filters) {
        let sql = "SELECT u.id,"+
        "u.id as user_id,"+
        "u.firstname,"+
        "u.lastname,"+
        "u.phone,"+
        "u.email,"+
        "u.sex,"+
        "u.lang,"+
        "u.active,"+
        "u.role,"+
        "u.password,"+
        "u.address,"+
        "u.street_number,"+
        "u.zip,"+
        "u.city,"+
        "u.country,"+
        "u.date_created,"+
        "u.date_updated,"+
        "u.birthday,"+
        "u.avatar " +
        " FROM users u  "+
        " where 1=1 "+
        "  and u.id not in (select user_id from nurses) " + 
        " and u.id not in (select user_id from doctors) " + 
        " and u.id not in (select user_id from scientists)" + 
        " and u.id not in (select user_id from patients)" ;
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and id = ?"
            params.push(filters.id);
        }
        if (filters.firstname) {
            sql += " and firstname like ?%"
            params.push(filters.firstname);
        }
        if (filters.lastname) {
            sql += " and lastname = ?%"
            params.push(filters.lastname);
        }
        if (filters.email) {
            sql += " and email = ?%"
            params.push(filters.email);
        }
        if (filters.role) {
            sql += " and role = ?"
            params.push(filters.role);
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
    async countCoordinators(filters) {
        let sql = "SELECT count(*) total FROM users u "+
        " where 1=1 "+
        " and u.id not in (select user_id from nurses) " + 
        " and u.id not in (select user_id from doctors) " + 
        " and u.id not in (select user_id from scientists)" + 
        " and u.id not in (select user_id from patients)" ;
        let params = [];
        if (filters.id) {
            sql += " and id = ?"
            params.push(filters.id);
        }
        if (filters.firstname) {
            sql += " and firstname like ?%"
            params.push(filters.firstname);
        }
        if (filters.lastname) {
            sql += " and lastname = ?%"
            params.push(filters.lastname);
        }
        if (filters.email) {
            sql += " and email = ?%"
            params.push(filters.email);
        }
        if (filters.role) {
            sql += " and role = ?"
            params.push(filters.role);
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
}
