const uuid = require("uuid");

const projectUuid = () => {
    return "PID" + uuid.v4().replace(/-/g, "").toUpperCase();
};

const viewUuid = () => {
    return "VID" + uuid.v4().replace(/-/g, "").toUpperCase();
};

const nodeUuid = () => {
    return "NID" + uuid.v4().replace(/-/g, "").toUpperCase();
};

/**
 * copied from frontend elixir source code: src/utils/index.ts / generateUUID()
 * **/
const elixirUuid = () => {
    return (new Date().getTime().toString(16) + Math.random().toString(16).substr(2)).substr(2, 16);
};

module.exports = {
    projectUuid,
    viewUuid,
    nodeUuid,
    elixirUuid
};
