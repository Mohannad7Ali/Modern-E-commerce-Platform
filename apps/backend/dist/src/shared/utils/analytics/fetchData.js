"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchData = void 0;
const _1 = require(".");
const fetchData = async (prisma, model, dateField, startDate, endDate, yearStart, yearEnd, role, include) => {
    const where = {
        [dateField]: (0, _1.buildDateFilter)(startDate, endDate, yearStart, yearEnd)
    };
    if (role)
        where.role = role;
    return prisma[model].findMany({ where, include });
};
exports.fetchData = fetchData;
