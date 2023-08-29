const express = require("express");
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const { generalResponse, catchAsync } = require("../utils/common-utils");
const { testIdToId } = require("../utils/uuid-utils");
const { check, query, validationResult } = require("express-validator");
const resultService = require("../services/result-service");
const { keycloak } = require("../middlewares/keycloak");

/* update result nodes */
router.put("/nodes/results", [
        keycloak.protect("automind-backend:internal-service"),
        check("pid", "pid must be provided").matches(/^[a-zA-Z0-9]+$/),
        check("vid", "vid only accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
        check("clearAll", "must be boolean").isBoolean(),
        check("tests", "array of test nodes").isArray(),
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        if (req.body.clearAll) {
            await resultService.clearResults(req.body.vid);
        }

        const results = [];
        for (const test of req.body.tests) {
            const testNodeId = testIdToId(test.tid);
            const resultNode = await resultService.createOrUpdateResult(req.body.pid, req.body.vid, testNodeId, test.result);

            if (resultNode) {
                console.log(resultNode);
                results.push({ testNodeId: testNodeId, resultNodeId: resultNode.id, result: resultNode.topic});
            }
        }

        return res.status(StatusCodes.OK).send({ pid: req.body.pid, vid: req.body.vid, updatedTests: results });
    })
);

/* clear view's test results */
router.post("/nodes/results/clear", [
        keycloak.protect("automind-app:app-user"),
        check("vid", "vid only accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        const deletedCount = await resultService.clearResults(req.body.vid);

        return res.status(StatusCodes.OK).send({ vid: req.body.vid, deletedCount });
    })
);

module.exports = router;
