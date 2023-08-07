const express = require("express");
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const { generalResponse, catchAsync, GResponse} = require("../utils/common-utils");
const { check, query, validationResult } = require("express-validator");
const nodeService = require("../services/node-service");
const { keycloak } = require("../middlewares/keycloak");

/* Create & update nodes */
router.post("/nodes/bulk", [
        keycloak.protect('automind-app:app-user'),
        check("pid", "pid must be provided").matches(/^[a-zA-Z0-9]+$/),
        check("vid", "vid only accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
        check("updateNodes", "updateNodes must be provide as an array").isArray(),
        check("deleteNodeIds", "deleteNodeIds must be provide as an array").isArray(),
    ],
    function(req, res, next) {
    (async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        console.log("payload -->");
        console.log(req.body);

        try {
            let updatedCount = 0;
            let deleteCount = 0;
            let updatedNode;
            let statusCode = StatusCodes.OK;

            // consider user Model.bulkSave() in case of performance issue.
            // ToDo: not to pass entire nodeData, instead assign each attributes one by one to avoid security issue.
            for (let nodeData of req.body.updateNodes) {
                updatedNode = await nodeService.findAndUpdateNode(req.body.pid, req.body.vid, nodeData);

                if (!updatedNode) {
                    await nodeService.createNode(req.body.pid, req.body.vid, nodeData);
                    statusCode = StatusCodes.CREATED;
                }
                updatedCount++;
            }

            for (let id of req.body.deleteNodeIds) {
                deleteCount = await nodeService.deleteNode(req.body.pid, req.body.vid, id);
            }

            return res.status(statusCode).send({ updatedCount, deleteCount });

        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

/* Fetch nodes */
router.get("/nodes/bulk",
    [
        keycloak.protect('automind-app:app-user'),
        query("pid", "pid must be provided, accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
        query("vid", "vid must be provided, accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
    ],
    function(req, res, next) {
        (async () => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
            }

            try {
                const pid = req.query.pid;
                const vid = req.query.vid;
                const nodes = await nodeService.fetchNodes(pid, vid);

                return res.status(StatusCodes.OK).send({
                    pid: pid,
                    vid: vid,
                    counts: nodes.length,
                    nodes: nodes.map(node => {
                        return {
                            // Elixir default attributes
                            id: node.id,
                            root: node.root,
                            tags: node.tags,
                            memo: node.memo,
                            style: node.style,
                            topic: node.topic,
                            icons: node.icons,
                            direction: node.direction,
                            hyperLink: node.hyperLink,
                            childrenIds: node.childrenIds,

                            // a3mind attributes:
                            parentId: node.parentId ? node.parentId : null,
                            nodeType: node.nodeType,
                            testTitle: node.testTitle,
                            testDescription: node.testDescription

                            // createdA: node.createdAt,
                            // updatedAt: node.updatedAt,
                        }
                    }),
                });

            } catch (error) {
                console.error(error);
                next(error);
            }
        })();
});

/* Fetch node */
router.get("/node",
    [
        keycloak.protect('automind-app:app-user'),
        query("id", "id must be provided, accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        const node = await nodeService.getNodeById(req.query.id);
        if (node) {
            return res.status(StatusCodes.OK).send({
                // Elixir default attributes
                id: node.id,
                root: node.root,
                tags: node.tags,
                memo: node.memo,
                style: node.style,
                topic: node.topic,
                icons: node.icons,
                direction: node.direction,
                hyperLink: node.hyperLink,
                childrenIds: node.childrenIds,

                // a3mind attributes
                pid: node.pid,
                vid: node.vid,
                parentId: node.parentId ? node.parentId : null,
                nodeType: node.nodeType,
                testTitle: node.testTitle,
                testDescription: node.testDescription
            })
        }

        return res.status(StatusCodes.OK).send(GResponse.notFound('Node not found'));
    })
);

/* Update node */
router.put("/node",
    [
        keycloak.protect('automind-app:app-user'),
        check("pid", "pid must be provided, accept letters in PID[a-zA-Z0-9]").matches(/^PID[a-zA-Z0-9]+$/),
        check("vid", "vid must be provided, accept letters in VID[a-zA-Z0-9]").matches(/^VID[a-zA-Z0-9]+$/),
        check("id", "id must be provided, accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        const nodeData = {
            // Elixir default attributes
            id: req.body.id,
            root: req.body.root,
            tags: req.body.tags,
            memo: req.body.memo,
            style: req.body.style,
            topic: req.body.topic,
            icons: req.body.icons,
            direction: req.body.direction,
            hyperLink: req.body.hyperLink,
            childrenIds: req.body.childrenIds,

            // a3mind attributes
            parentId: req.body.parentId ? req.body.parentId : null,
            nodeType: req.body.nodeType,
            testTitle: req.body.testTitle,
            testDescription: req.body.testDescription
        }
        const updatedNode = await nodeService.findAndUpdateNode(req.body.pid, req.body.vid, nodeData);
        if (updatedNode) {
            return res.status(StatusCodes.OK).send(GResponse.succeed('Node updated'));
        }

        return res.status(StatusCodes.BAD_REQUEST).send(GResponse.notFound('Node may not found, no node updated'));
    })
);



module.exports = router;
