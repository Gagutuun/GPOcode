const asyncHandler = require('express-async-handler');

const fs = require('fs');

const Protocol = require('../models/protocol');

exports.removeLastAdded = asyncHandler(async (req, res) => {
    console.log("[DEBUG] я в контроллере");
    const lastAddedProtocolID = await Protocol.getLastProtocolId();
    console.log(`[DEUBG] lastAddedProtocolID = ${lastAddedProtocolID}`);
    const protocolPath = await Protocol.getProtocolPathByID(lastAddedProtocolID);
    console.log(`[DEUBG] protocolPath = ${protocolPath}`);
    fs.unlinkSync(protocolPath);
    console.log(`[DEBUG] удалил`);
    const deleteProtocolByIDResult = await Protocol.deleteProtocolByID(lastAddedProtocolID)
    // .then((result) => {
    //     console.log(`[DEUBG] удалил`);
    //     res.status(102).send(result);
    //     return;
    // })
    // .catch((err) => {
    //     console.log(`[DEUBG] не удалил`);
    //     res.status(103).send(err);
    //     return;
    // });
    console.log(`[DEBUG] deleteProtocolByIDResult = ${deleteProtocolByIDResult}`);
    if (deleteProtocolByIDResult == "Запрос успешно выполнен!") {
        console.log(`[DEUBG] удалил`);
        res.status(102).send(result);
        return;
    }
    console.log(`[DEUBG] не удалил`);
    res.status(103).send(err);
    return;
})