const search = require('./search')
const create = require('./create')
const router = (app) => {
    app.use("/v1/search", search);
    app.use("/v1/create", create);
}
module.exports = router