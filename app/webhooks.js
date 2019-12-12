'use strict';

var shopifyAPI = require('shopify-node-api');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const axios = require('axios');

// Uninstallation webhook
module.exports.uninstall = async event => {
    const data = JSON.parse(event.body);
    const shop_id = data.id;

    const promise = new Promise(function (resolve, reject) {

        const params = {
            TableName: process.env.tableName,
            Key: {
                shopId: shop_id.toString(),
            }
        };
        dynamoDb.delete(params, (error, result) => {
            resolve({'shop_id': shop_id});
        })
        .on('error', (e) => {
            reject(Error(e))
        });
    })
    .then(function (args) {
        return new Promise((resolve, reject) => {
            let response = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "message": "success"}),
            };
            resolve(response);
        });
    });

    return promise;
}

// GDPR webhook
module.exports.gdpr = async event => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "message": "success"}),
    };
}