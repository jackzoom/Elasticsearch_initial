const fs = require('fs');
const path = require('path');
const express = require("express");
const escClient = require("../lib/esc_client")
const router = express.Router();
const {
    escIndex
} = require('../config')


/**
 * 指定索引插入数据
 * @param {*} index 
 * @param {*} type 
 * @param {*} data 
 */
async function createData(index, type, dataJson) {
    //执行分片中文处理
    return new Promise(async (resolve, reject) => {
        const data = JSON.parse(dataJson);
        let bulkBody = [];
        data.forEach(item => {
            bulkBody.push({
                index: {
                    _index: index,
                    _type: type,
                    _id: item.id
                }
            });
            bulkBody.push(item);
        });
        escClient.bulk({
                body: bulkBody
            })
            .then(response => {
                // let errorCount = 0;
                // response.items.forEach(item => {
                //     if (item.index && item.index.error) {
                //         console.log(++errorCount, item.index.error);
                //     }
                // });
                // console.log(
                //     `Successfully indexed ${data.length - errorCount} out of ${data.length} items`
                // );
                resolve(response);
            })
            .catch((err) => {
                reject(err)
            });
    })

};

/**
 * 插入数据
 */
router.post("/", async function (req, res, next) {
    let dataJson = await fs.readFileSync(path.resolve(__dirname, '../model/data.json'));
    createData(escIndex, 'artilce', dataJson).then((result) => {
        res.json({
            code: '0000',
            data: result,
        })
    }).catch((err) => {
        res.json({
            code: '0001',
            message: err,
        })
    })

});

/**
 * 插入分词数据
 */
router.post("/tokens", async function (req, res, next) {
    let dataJson = await fs.readFileSync(path.resolve(__dirname, '../model/data.json'));
    createData(escIndex, 'artilce', dataJson).then((result) => {
        res.json({
            code: '0000',
            data: result,
        })
    }).catch((err) => {
        res.json({
            code: '0001',
            message: err,
        })
    })

});

module.exports = router;