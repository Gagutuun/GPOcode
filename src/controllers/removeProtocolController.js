const asyncHandler = require('express-async-handler');

const fs = require('fs');

const Protocol = require('../models/protocol');

exports.removeLastAdded = asyncHandler(async (req, res) => {
    const lastAddedProtocolID = await Protocol.getLastProtocolId();
    const protocolPath = await Protocol.getProtocolPathByID(lastAddedProtocolID);
    fs.unlinkSync(protocolPath);
    const deleteProtocolByIDResult = await Protocol.deleteProtocolByID(lastAddedProtocolID)
    if (deleteProtocolByIDResult == "Запрос успешно выполнен!") {
        res.status(102).send(result);
        return;
    }
    res.status(103).send(err);
    return;
})