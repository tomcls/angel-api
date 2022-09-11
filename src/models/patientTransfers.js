const conn = require("../utils/conn");
const db = conn.conn();
const async = require('async');
module.exports = class Transfer {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT patient_transfers.id, patient_id," +
            " nurse_from," +
            " nurse_to," +
            " up.firstname," +
            " up.lastname," +
            " uf.firstname firstname_from," +
            " uf.lastname lastname_from," +
            " ut.firstname firstname_to," +
            " ut.lastname lastname_to " +
            "FROM patient_transfers  " +
            " LEFT JOIN nurses nf ON nf.id = patient_transfers.nurse_from " +
            " LEFT JOIN nurses nt ON nt.id = patient_transfers.nurse_to " +
            " LEFT JOIN patients np ON np.id = patient_transfers.patient_id " +
            " LEFT JOIN users uf ON uf.id = nf.user_id " +
            " LEFT JOIN users ut ON ut.id = nt.user_id " +
            " LEFT JOIN users up ON up.id = np.user_id " +
            " WHERE 1 = 1 ";
        if (filters.nurse_id) {
            sql += " and ( nurse_from = "+filters.nurse_id+" OR nurse_to = "+filters.nurse_id+" ) "
        }
        sql += " order by patient_transfers.date_created desc ";
        try {
            let rows = await db.query(sql);
            console.log('TOTAzfzefze',rows)
            if (rows && rows.length > 0) {
                return rows;
            }
            return null;
        } catch (error) {
            return error
        }
    }

    async add(o) {
        async.series([
            async function (callback) {
                // add to transfer table
                async.eachSeries(o.patients, function (element, cb) {
                    console.log("aaaaaaa",o.patients)
                    let sql = " INSERT INTO patient_transfers (patient_id, nurse_from, nurse_to) " +
                        " VALUES " +
                        "(" + element + ", " + o.nurse_from + ", " + o.nurse_to + ") ";
                         db.query(sql).then(function() {
                            console.log('aaaaaaaaaaa');
                            cb();
                        });
                       
                        
                }, function (err) {
                    if (err) {
                        console.log('a err ', err);
                    } else {
                        console.log('All records have been transfered successfully');
                    }
                });
            },
            async function (callback) {
                // delete from nurse_patients
                async.eachSeries(o.patients,  function (element, cb) {
                    console.log("bbbb",o.patients)
                    let sql = " DELETE FROM nurse_patients " +
                        " WHERE patient_id = " + element + " and  nurse_id =  " + o.nurse_from + ";"
                        db.query(sql).then(function() {
                            console.log('bbbbbbbbb');
                            cb();
                        });
                }, function (err) {
                    if (err) {
                        console.log('delete err', err);
                    } else {
                        console.log('All files have been unlinked successfully');
                    }
                });
            },
            async function (callback) {
                // add to nurse table
                async.eachSeries(o.patients, function (element, cb) {
                    let sql = " INSERT INTO nurse_patients (patient_id, nurse_id) " +
                        " VALUES " +
                        "(" + element + ", " + o.nurse_to + ") ";
                         db.query(sql).then(function() {
                            console.log('ccccccc');
                            cb();
                        });
                }, function (err) {
                    if (err) {
                        console.log('c err', err);
                    } else {
                        console.log('All files have been linked successfully');
                    }
                });
            }
        ], function (err, results) {
            console.log(results)
            return results;
        });
    }
    recover(o) {
        console.log(o)
       // add to transfer table
       let sql = "SELECT * from patient_transfers where id = "+o.transfer_id;
       db.query(sql).then(function(result) {
        console.log(result[0])
           let sqlUpdate = "UPDATE nurse_patients set nurse_id = " + result[0].nurse_from +
           " WHERE nurse_id = " + result[0].nurse_to +
           " AND  patient_id = " + result[0].patient_id +" ; ";
           db.query(sqlUpdate).then(function(resultUpdate) {
               let sqlDelete = " DELETE FROM patient_transfers " +
               " WHERE id = " + o.transfer_id + ";"
               db.query(sqlDelete).then(function() {
                   console.log('Record  well deleted');
                   return "record well deleted"
               });
           });
       });
    }
}
