const queryBuilder = require("../utils/queryBuilder");

/**
 * Модель связи поручения и сотрудника
 */
class ErrandEmployee {

    static tableName = "public.\"ErrandEmployee\"";

    static columnNames = {
        id_errand: "id_errand",
        id_employee: "id_employee",
        report: "report"
    }

    static addRow(id_errand, id_employee) {
        return queryBuilder.insert(
                this.tableName,
                [
                    this.columnNames.id_errand,
                    this.columnNames.id_employee
                ],
                [id_errand, id_employee]
            ).exec();
    }

    static getRow(id_errand) {
        return queryBuilder.select(
                this.tableName,
                []
            ).where(`${this.columnNames.id_errand} = ${id_errand}`)
            .exec();
    }

    static addReport(id_errand, reportText) {
    return queryBuilder.insert(
            this.tableName,
            [this.columnNames.report],
            [reportText])
            .where(`${this.columnNames.id_errand} = ${id_errand}`)
            .exec();
    }
}

module.exports = ErrandEmployee;