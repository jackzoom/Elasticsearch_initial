const express = require("express");
const router = express.Router();
const escClient = require("../lib/esc_client")
const {
    escIndex
} = require('../config')
/**
 * 查询高亮匹配
 */
router.get("/", function (req, res, next) {
    let result = {},
        query = {
            match_all: {}
        };
    const search = function (index, body) {
        return escClient.search({
            index: index,
            body: body
        });
    };
    if (req.query.keyword) {
        query = {
            multi_match: {
                query: req.query.keyword,
                fields: ["author", "title", "desc", "content"]
            }
        }
    }
    search(escIndex, {
            query,
            highlight: {
                require_field_match: false,
                fields: {
                    author: {
                        pre_tags: [`<span class="user">`],
                        post_tags: ["</span>"]
                    },
                    title: {},
                    desc: {},
                    content: {}
                }

            },
            // sort: [{
            //     age: req.query.sort
            // }]
        })
        .then(data => {
            let result = [];
            data.hits.total.value && data.hits.hits.forEach((item) => {
                // Object.keys(item.highlight).forEach((i) => {
                //     item.highlight[i].forEach((j, k) => {
                //         console.log(item.highlight[i])
                //         item.highlight[i][k] = j.replace(new RegExp('</em><em>', 'g'), '');
                //     })
                // })
                result.push(Object.assign(item, {
                    highlight: item.highlight
                }))
            })
            res.json({
                code: '0000',
                data: result,
                // search: data
            })
        })
        .catch((err) => {
            console.log("获取异常：", err)
            res.json({
                code: '0001',
                message: err
            })
        });
});

module.exports = router;