const conn = require("../utils/conn");
const db = conn.conn();
const async = require('async');
const fs = require('fs');
module.exports = class DrugDescription {
    constructor() { }
    async find(filters) {
        let sql = "SELECT drug_descriptions.id, " +
            "drug_descriptions.lang_id," +
            "drug_descriptions.description," +
            "drug_descriptions.drug_id," +
            "drug_descriptions.notice," +
            "drug_descriptions.date_created," +
            "drug_descriptions.date_updated " +
            "FROM drug_descriptions " +
            "WHERE 1 = 1 ";
        let params = [];
        if (filters.drug_id) {
            sql += " and drug_descriptions.drug_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.id) {
            sql += " and drug_descriptions.id = ?"
            params.push(filters.id);
        }
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
    add(list, callback) {
        if (list && list.length > 0) {
            const insertedIds = [];
            async.eachSeries(list, function (o, cb) {
                let sql = "INSERT INTO drug_descriptions SET ? ";
                db.query(sql, o).then(function (add) {
                    insertedIds.push({
                        drug_id: o.drug_id,
                        notice: o.notice,
                        saved: add.affectedRows,
                        inserted_id: add.insertId
                    });
                    cb();
                });
            }, function (err) {
                callback(insertedIds);
            });
        }
    }
    async update(list, callback) {
        if (list && list.length > 0) {
            const insertedIds = [];
            try {
                await async.eachSeries(list, async (o) => {
                    let sql = "UPDATE drug_descriptions  ";
                    const params = [];
                    if (o.drug_id) {
                        sql += " SET  drug_id = ?";
                        params.push(o.drug_id);
                    }
                    if (o.notice) {
                        sql += ((params.length) ? ', ' : ' SET ') + "  notice = ?"
                        params.push(o.notice);
                    }
                    if (o.lang_id) {
                        sql += ",  lang_id = ?"
                        params.push(o.lang_id);
                    }
                    if (o.description) {
                        sql += ",  description = ?"
                        params.push(o.description);
                    }
                    sql += ",   date_updated = ?"
                    params.push(new Date());
                    sql += " where id=" + o.id
                    db.query(sql, params).then(function (add) {
                        insertedIds.push({
                            drug_id: o.drug_id,
                            notice: o.notice,
                            saved: add.affectedRows,
                            inserted_id: add.insertId
                        });
                    });
                });
                return insertedIds
            }
            catch (err) {
                console.log(err);
            }
        }
        return {
            saved: "nothing updated"
        };
    }
    /**
     * @todo remove the file
     * @param {*} o 
     */
    async deleteNotice(o) {
        console.log(o)
        if(o && o.id) {
            try {
                const d = await this.find({id: o.id});
                
                if(d && d.length && d[0].id) {
                    console.log(d[0] )
                    var filePath = './public/drugs/documents/'+d[0].notice; 
                    console.log(filePath)
                    fs.unlinkSync(filePath);
                    let sql = "UPDATE drug_descriptions SET notice=null where id="+o.id;
                    await db.query(sql);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}
