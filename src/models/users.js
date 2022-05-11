const conn = require("../utils/conn");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_APIKEY);
const db = conn.conn();
module.exports = class User {
    constructor() { }

    async find(filters) {
        let sql = "SELECT * FROM users where 1=1 ";
        let params = [];
        if (filters.id) {
            sql += " and id = ?"
            params.push(filters.id);
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
        if (filters.type) {
            sql += " and type = ?"
            params.push(filters.type);
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
            return error
        }
    }
    async add(o) {
        let sql = "INSERT INTO users SET ? ";
        const params = {
            firstname: o.firstname,
            lastname: o.lastname,
            email: o.email,
            type: o.type,
            role: o.role,
            password: o.password,
            active: false
        };
        console.log(params)
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
        console.log('requestPassword')
        const user = await this.find({ email: email });
        if (user && user.id) {
            console.log('userxxxxx', user)
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
                console.log('usertoken', token)
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
            console.log('user not found')
            return { error: 'user not found' };
        }
    }
}
