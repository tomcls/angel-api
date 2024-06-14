const conn = require("../utils/conn");
const Posology = require("./posologies");
const async = require('async');
const DrugDescription = require("./drugDescriptions");
const db = conn.conn();
module.exports = class Drug {
    constructor() { }
    async findAll(filters) {
        let sql = "SELECT drugs.id as drug_id, drug_descriptions.id as drug_description_id, " +
            "drugs.laboratory_id, " +
            "drugs.name drug_name, " +
            "drugs.molecule_name," +
            "drugs.code drug_code, " +
            "drugs.date_created, " +
            "drugs.date_updated, " +
            "drugs.image," +
            "drug_descriptions.notice, " +
            "drug_descriptions.description, " +
            "laboratories.name laboratory_name " +
            "FROM drugs " +
            "LEFT JOIN drug_descriptions on drugs.id = drug_descriptions.drug_id AND drug_descriptions.lang_id ='" + filters.lang_id + "' " +
            "LEFT JOIN laboratories on drugs.laboratory_id = laboratories.id " +
            "WHERE 1=1 ";
        let params = [];
        let filterClause = '';
        if (filters.id) {
            sql += " and drugs.id = ?"
            params.push(filters.id);
        }
        if (filters.ids) {
            sql += " and drugs.id in (?)"
            params.push( filters.ids);
        }
        if (filters.laboratory_id) {
            sql += " and drugs.laboratory_id = ? "
            params.push(filters.laboratory_id);
        }
        let sqlSearch = '';
        if (filters.name) {
            sqlSearch += " drugs.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.code) {
            sqlSearch += ((sqlSearch) ? ' OR ' : ' ') + " drugs.code like ?"
            params.push(filters.code + '%');
        }
        if (sqlSearch !== '') {
            sql += ' AND (' + sqlSearch + ') ';
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + filters.limit;
        }
        sql += " order by drugs.id desc " + filterClause;
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
        let sql = "SELECT count(*) as total FROM drugs LEFT JOIN drug_descriptions on drugs.id = drug_descriptions.drug_id AND drug_descriptions.lang_id ='" + filters.lang_id + "' "
            + " where 1=1  ";

        let params = [];
        if (filters.id) {
            sql += " and drugs.id = ?"
            params.push(filters.id);
        }
        if (filters.laboratory_id) {
            sql += " and drugs.laboratory_id = ?"
            params.push(filters.laboratory_id);
        }
        let sqlSearch = '';
        if (filters.name) {
            sqlSearch += " drugs.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.code) {
            sqlSearch += ((sqlSearch) ? ' OR ' : ' ') + " drugs.code like ?"
            params.push(filters.code + '%');
        }
        if (sqlSearch !== '') {
            sql += ' AND (' + sqlSearch + ') ';
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
        let sql = "SELECT drugs.id as drug_id, drug_descriptions.id as drug_description_id, " +
            "drugs.laboratory_id," +
            "drugs.name," +
            "drugs.molecule_name," +
            "drugs.code," +
            "drugs.image," +
            "drugs.date_created," +
            "drugs.date_updated, " +
            "drug_descriptions.notice, " +
            "drug_descriptions.description, " +
            "laboratories.name laboratory_name " +
            "FROM drugs " +
            "LEFT JOIN drug_descriptions on drugs.id = drug_descriptions.drug_id AND drug_descriptions.lang_id ='" + filters.lang_id + "' " +
            "LEFT JOIN laboratories on drugs.laboratory_id = laboratories.id " +
            "WHERE 1 = 1 ";
        let params = [];
        if (filters.id) {
            sql += " and drugs.id = ?"
            params.push(filters.id);
        }
        if (filters.drug_id) {
            sql += " and drugs.id = ?"
            params.push(filters.drug_id);
        }
        if (filters.laboratory_id) {
            sql += " and drugs.laboratory_id = ?"
            params.push(filters.laboratory_id);
        }
        if (filters.code) {
            sql += " and drugs.code code = ?"
            params.push(filters.code);
        }
        if (filters.name) {
            sql += " and drugs.name = ?"
            params.push(filters.name);
        }
        sql += " order by drugs.date_created desc limit 1";
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
        let sql = "INSERT INTO drugs SET ? ";
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
        let sql = "UPDATE drugs  ";

        const params = [];
        if (o.id) {
            sql += " SET id = ?";
            params.push(o.id);
        } else {
            throw { error: 'No pk provided' }
        }
        if (o.code) {
            sql += ",  code = ?"
            params.push(o.code);
        }
        if (o.name) {
            sql += ",  name = ?"
            params.push(o.name);
        }
        if (o.molecule_name) {
            sql += ",  molecule_name = ?"
            params.push(o.molecule_name);
        }
        if (o.image) {
            sql += ",  image = ?"
            params.push(o.image);
        }
        if (o.laboratory_id) {
            sql += ",   laboratory_id = ?"
            params.push(o.laboratory_id);
        }
        sql += ",   date_updated = ?"
        params.push(new Date());
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
    async search(filters) {

        let sql = "SELECT drugs.id as drug_id," +
            "drugs.id as id," +
            "drugs.name," +
            "drugs.image," +
            "drugs.code," +
            "drugs.date_created," +
            "drugs.date_updated " +
            "FROM drugs " +
            "WHERE  ";
        let params = [];
        let filterClause = '';
        if (filters.drug_id) {
            sql += "  drug_id.id = ?"
            params.push(filters.id);
        }
        if (filters.name) {
            sql += ((params.length) ? ' OR ' : '') + "  drugs.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.code) {
            sql += ((params.length) ? ' OR ' : '') + "  drugs.code like ?"
            params.push(filters.code + '%');
        }
        if (filters.limit) {
            filterClause = " limit " + ((filters.page) * filters.limit) + ', ' + (filters.limit * (filters.page + 1));
        }
        sql += " order by drugs.date_created desc " + filterClause;
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
    async duplicate(o) {
        if (o && o.ids && o.ids.length > 0) {
            // Using async/await
            try {
                await async.each(o.ids, async (id) => {
                    const drug = await this.find({id:id} ) ;
                    const newDrug = {
                        laboratory_id : drug.laboratory_id,
                        name: drug.name + " copy",
                        molecule_name: drug.molecule_name,
                        code: drug.code,
                        image: drug.image
                    }
                    const addedDrug = await this.add(newDrug);
                    const modelDescription = new DrugDescription();
                    const descriptions = await modelDescription.find({id:drug.drug_id} ) ;
                    const newDesciptions = [];
                    await async.each(descriptions, async (d) => {
                        const newDescription = {
                            lang_id : d.lang_id,
                            description: d.description,
                            drug_id: addedDrug.inserted_id
                        }
                        newDesciptions.push(newDescription) ;                
                    });
                    modelDescription.add(newDesciptions, function(a) {
                             
                    }) ;
                });
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    async delete(o) {
        if (o && o.ids) {

            let sql = "delete from drugs where id in (" + o.ids + ") ";
            try {
                const del = await db.query(sql);
                return del;
            }
            catch (err) {
                return err;
            }
        } else {
            throw { error: 'No ids provided' }
        }
    }
    async getPatients(filters) {
        let sql = "SELECT patients.id as patient_id," +
            "users.id as user_id," +
            "users.id as id," +
            "users.firstname," +
            "users.lastname," +
            "users.phone," +
            "users.email," +
            "users.sex," +
            "users.lang," +
            "users.active," +
            "users.role," +
            "users.password," +
            "users.address," +
            "users.street_number," +
            "users.zip," +
            "users.city," +
            "users.country," +
            "users.date_created," +
            "users.date_updated," +
            "users.birthday," +
            "users.avatar," +
            "patients.emergency_contact_relationship," +
            "patients.emergency_contact_name," +
            "patients.emergency_contact_phone," +
            "patients.close_monitoring " +
            "FROM drug_patients " +
            "LEFT JOIN patients ON drug_patients.patient_id = patients.id " +
            "LEFT JOIN users on patients.user_id = users.id  " +
            "WHERE 1 = 1 ";
        let params = [];
        if (filters.drug_id) {
            sql += " and drug_patients.drug_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and drug_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
        }
        sql += " order by drug_patients.id desc";
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

    async countPatients(filters) {
        let sql = "SELECT count(*) as total " +
            "FROM drug_patients " +
            "LEFT JOIN patients ON drug_patients.patient_id = patients.id " +
            "LEFT JOIN users on patients.user_id = users.id  " +
            "WHERE 1 = 1 ";
        let params = [];
        if (filters.treatment_id) {
            sql += " and drug_patients.treatment_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and drug_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and users.id = ?"
            params.push(filters.user_id);
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

    async addPatient(o) {
        let posology = new Posology();
        let p = {
            days: o.days,
            hours: o.hours,
            repetition: o.repetition,
            type: o.type,
            note: o.note
        }
        let addPos = await posology.add(p);
        let sql = "INSERT INTO drug_patients SET ? ";
        try {
            let t = {
                drug_id: o.drug_id,
                patient_id: o.patient_id,
                posology_id: addPos.inserted_id,
                start_date: o.start_date,
                end_date: o.end_date
            }
            const add = await db.query(sql, t);
            return {
                saved: add.affectedRows,
                inserted_id: add.insertId
            };
        }
        catch (err) {
            return err;
        }
    }
    async updatePatient(o) {
        let sql = "UPDATE drug_patients  ";

        let params = [];
        if (o.id) {
            sql += " SET id = ?";
            params.push(o.id);
        } else {
            throw { error: 'No pk provided' }
        }
        if (o.drug_id) {
            sql += ",  drug_id = ?"
            params.push(o.drug_id);
        }
        if (o.patient_id) {
            sql += ",  patient_id = ?"
            params.push(o.patient_id);
        }
        if (o.start_date) {
            sql += ",  start_date = ?"
            params.push(o.start_date);
        }
        if (o.end_date) {
            sql += ",  end_date = ?"
            params.push(o.end_date);
        }
        sql += " where id=" + o.id
        try {
            const updated = await db.query(sql, params);
            sql = "UPDATE posologies  ";
            params = [];
            if (o.posology_id) {
                sql += " SET id = ?";
                params.push(o.posology_id);
            } else {
                throw { error: 'No pk provided' }
            }
            if (o.days) {
                sql += ",  days = ?"
                params.push(o.days);
            }
            if (o.hours) {
                sql += ",  hours = ?"
                params.push(o.hours);
            }
            if (o.repetition) {
                sql += ",  repetition = ?"
                params.push(o.repetition);
            }
            if (o.type) {
                sql += ",  type = ?"
                params.push(o.type);
            }
            if (o.note) {
                sql += ",  note = ?"
                params.push(o.note);
            }
            sql += " where id=" + o.posology_id
            await db.query(sql, params);
            return {
                saved: updated
            };
        }
        catch (err) {
            return err;
        }
    }
    async getUserDrugs(filters) {
        let sql = "SELECT drugs.id as drug_id, drug_patients.id id, " +
            "users.avatar, " +
            "users.firstname, " +
            "users.lastname, " +
            "drugs.name, " +
            "drugs.image," +
            "drugs.molecule_name," +
            "drugs.code, " +
            "drug_patients.patient_id, " +
            "drug_patients.posology_id, " +
            "drug_patients.start_date, " +
            "drug_patients.end_date, " +
            "drugs.date_created, " +
            "drugs.date_updated, " +
            "drug_descriptions.notice, " +
            "drug_descriptions.description, " +
            "posologies.days, " +
            "posologies.hours, " +
            "posologies.repetition, " +
            "posologies.note, " +
            "posologies.type " +
            "FROM drug_patients " +
            "LEFT JOIN patients ON drug_patients.patient_id = patients.id " +
            "LEFT JOIN nurse_patients ON nurse_patients.patient_id = patients.id " +
            "LEFT JOIN doctor_patients ON doctor_patients.patient_id = patients.id " +
            "LEFT JOIN users ON users.id = patients.user_id " +
            "LEFT JOIN drugs on drugs.id = drug_patients.drug_id  " +
            `LEFT JOIN drug_descriptions on drugs.id = drug_descriptions.drug_id and drug_descriptions.lang_id = '${filters.lang??'en'}'` +
            "LEFT JOIN posologies on posologies.id = drug_patients.posology_id  " +
            "WHERE 1 = 1 ";
        let params = [];
        if (filters.drug_id) {
            sql += " and drug_patients.drug_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and drug_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.nurse_id) {
            sql += " and nurse_patients.nurse_id = ?"
            params.push(filters.nurse_id);
        }
        if (filters.doctor_id) {
            sql += " and doctor_patients.doctor_id = ?"
            params.push(filters.doctor_id);
        }
        if (filters.end_date) {
             sql += " and (drug_patients.end_date >= ? OR drug_patients.end_date is NULL)"
             params.push(filters.end_date);
        }
        if (filters.user_id) {
            sql += " and patients.user_id = ?"
            params.push(filters.user_id);
        }
        sql += " GROUP by drug_patients.id order by drug_patients.patient_id , drug_patients.date_created desc";
        
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

    async countUserDrugs(filters) {
        let sql = "SELECT count(*) as total " +
            "FROM drug_patients " +
            "LEFT JOIN patients ON drug_patients.patient_id = patients.id " +
            "LEFT JOIN nurse_patients ON nurse_patients.patient_id = patients.id " +
            "LEFT JOIN doctor_patients ON doctor_patients.patient_id = patients.id " +
            "LEFT JOIN drugs on drugs.id = drug_patients.drug_id  " +
            "WHERE 1 = 1 ";
        let params = [];
        if (filters.drug_id) {
            sql += " and drug_patients.drug_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.patient_id) {
            sql += " and drug_patients.patient_id = ?"
            params.push(filters.patient_id);
        }
        if (filters.user_id) {
            sql += " and patients.user_id = ?"
            params.push(filters.user_id);
        }
        if (filters.nurse_id) {
            sql += " and nurse_patients.nurse_id = ?"
            params.push(filters.nurse_id);
        }
        if (filters.end_date) {
            sql += " and drug_patients.end_date >= ?"
            params.push(filters.end_date);
        }
        if (filters.doctor_id) {
            sql += " and doctor_patients.doctor_id = ?"
            params.push(filters.doctor_id);
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
    async addEffect(o) {
        let sql = "INSERT INTO drug_effects SET ? ";
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
    async deleteEffect(o) {
        if (o && o.ids) {

            let sql = "delete from drug_effects where id in (?) ";
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
            throw { error: 'No ids provided' }
        }
    }
    async getEffects(filters) {
        let sql = " select drug_effects.id," +
            " drug_effects.side_effect_id, " +
            " drug_effects.drug_id, " +
            " side_effect_descriptions.name " +
            " FROM drug_effects " +
            " LEFT JOIN side_effects on side_effects.id = drug_effects.side_effect_id " +
            " LEFT JOIN side_effect_descriptions on side_effects.id = side_effect_descriptions.side_effect_id " +
            "WHERE  ";
        let params = [];
        let filterClause = '';
        if (filters.side_effect_id) {
            sql += "  side_effects.id = ?"
            params.push(filters.side_effect_id);
        }
        if (filters.name) {
            sql += ((params.length) ? ' OR ' : '') + "  side_effect_descriptions.name like ?"
            params.push(filters.name + '%');
        }
        if (filters.drug_id) {
            sql += ((params.length) ? " AND" : "") + "  drug_effects.drug_id = ?"
            params.push(filters.drug_id);
        }
        if (filters.lang_id) {
            sql += " AND side_effect_descriptions.lang_id = ?"
            params.push(filters.lang_id);
        }
        sql += " order by side_effect_descriptions.name asc " + filterClause;
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
}
