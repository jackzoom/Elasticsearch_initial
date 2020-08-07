const express = require('express');
const router = require("./router");
const ecsClient = require("./lib/esc_client");
const app = express();
const PORT = 5000;
ecsClient.ping({
    requestTimeout: 30000
}, function (error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});
router(app);
app.listen(PORT, function () {
    console.log('Server is running on PORT:', PORT);
});