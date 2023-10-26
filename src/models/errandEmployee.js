const db = require("../config/dbConfig");
const queryBuilder = require("../utils/queryBuilder");

class ErrandEmployee {

    static tableName = "public.\"ErrandEmployee\"";

    static columnNames = {
        id_errand: {
            name: "id_errand",
            type: "number"
        },
        id_employee: {
            name: "id_employee",
            type: "number"
        },
        report: {
            name: "report",
            type: "string"
        }
    }

    static addRow(id_errand, id_employee) {
        return new Promise((resolve, reject) => {
            if (typeof id_errand != this.columnNames.id_errand.type) {
                reject(`id_errand isn't type of ${this.columnNames.id_errand.type}`);
                return;
            }
            if (typeof id_employee != this.columnNames.id_employee.type) {
                reject(`id_employee isn't type of ${this.columnNames.id_employee.type}`);
                return;
            }
            const sqlQuery = queryBuilder.makeInsertQuery(
                this.tableName,
                [
                    this.columnNames.id_errand.name,
                    this.columnNames.id_employee.name
                ]
            );
            db.query(
                sqlQuery,
                [id_errand, id_employee],
                (err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (res.rowCount > 0) {
                        resolve(res);
                        return;
                    }
                    reject("Unknown error");
                }
            );
        })
    }

    static getRow(id_errand) {
        return new Promise((resolve, reject) => {
            if (typeof id_errand != ErrandEmployee.columnNames.id_errand.type) {
                reject(`id_errand must be a type of ${ErrandEmployee.columnNames.id_errand.type}`);
                return;
            }
            db.query(
                queryBuilder.makeSelectQuery(
                    this.tableName,
                    [],
                    queryBuilder.makeSubexpression(
                        queryBuilder.WHERE,
                        queryBuilder.equals(id_errand.name)
                    )
                ),
                [id_errand],
                (err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (res.rowCount > 0) {
                        resolve(res.rows);
                        return;
                    }
                    reject("Unknown error");
                }
            )
        })
    }

    static addReport(id_errand, reportText) {
        return new Promise((resolve, reject) => {
            if (typeof id_errand != ErrandEmployee.columnNames.id_errand.type) {
                reject(`id_errand must be a type of ${ErrandEmployee.columnNames.id_errand.type}`);
                return;
            }
            if (typeof reportText != ErrandEmployee.columnNames.report.type) {
                reject(`reportText must be a type of ${ErrandEmployee.columnNames.report.type}`);
                return;
            }
            db.query(
                queryBuilder.makeExtendedInsertQuery(
                    ErrandEmployee.tableName,
                    [ErrandEmployee.columnNames.report.name],
                    queryBuilder.makeSubexpression(
                        queryBuilder.WHERE,
                        queryBuilder.equals(ErrandEmployee.columnNames.id_errand.name)
                    )
                ),
                [reportText, id_errand],
                (err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (res.rowCount > 0) {
                        resolve(res);
                        return;
                    }
                    reject("Unknown error");
                }
            )
        })
    }

}

module.exports = ErrandEmployee;