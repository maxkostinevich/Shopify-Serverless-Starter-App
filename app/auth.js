// Handle App Installation
'use strict';

const Utils = require('./utils');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.index = async event => {
    const action = 'https://' + event.headers.Host;// + '/' + event.requestContext.stage;
    const params = event.queryStringParameters;

    // Validate Request
    if(!event.queryStringParameters || !('shop' in event.queryStringParameters)){
        const response = {
            statusCode: 301,
            headers: {
                Location: action + '/install'
            }
        };
        return response;
    }
    // Validate HMAC
    Utils.validateHMAC(params);

    // DB
    const dbParams = {
        TableName: process.env.tableName,
        IndexName: "domain-index",
        KeyConditionExpression: "#domain = :domain",
        ExpressionAttributeNames:{
            "#domain": "domain"
        },
        ExpressionAttributeValues: {
            ":domain": params.shop
        }
    };


    // Get Shop Info
    const promise = new Promise(function (resolve, reject) {
        dynamoDb.query(dbParams, (error, result) => {
            const item = result.Items[0];

            const shopDomain = params.shop;
            const shopName = item.name;
            const shopId = item.shopId;
            const shopEmail = item.email;

            const html = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="shortcut icon" type="image/png" href="${action}/assets/favicon.png" />
    <link rel="stylesheet" href="${action}/assets/css/app.css"/>

    <title>${process.env.appName}</title>
</head>
<body>
<div id="app">
    <!-- preloading -->
    <div style="--top-bar-background:#00848e; --top-bar-color:#f9fafb; --top-bar-background-lighter:#1d9ba4;">
        <div class="Polaris-SkeletonPage__Page" role="status" aria-label="Page loading">
            <div class="Polaris-SkeletonPage__Header Polaris-SkeletonPage__Header--hasSecondaryActions">
                <div class="Polaris-SkeletonPage__TitleAndPrimaryAction">
                    <div class="Polaris-SkeletonPage__Title">
                        <div class="Polaris-SkeletonDisplayText__DisplayText Polaris-SkeletonDisplayText--sizeLarge"></div>
                    </div>
                    <div class="Polaris-SkeletonPage__PrimaryAction">
                        <div class="Polaris-SkeletonDisplayText__DisplayText Polaris-SkeletonDisplayText--sizeLarge"></div>
                    </div>
                </div>
                <div class="Polaris-SkeletonPage__Actions">
                    <div class="Polaris-SkeletonPage__Action" style="width: 87px;">
                        <div class="Polaris-SkeletonBodyText__SkeletonBodyTextContainer">
                            <div class="Polaris-SkeletonBodyText"></div>
                        </div>
                    </div>
                    <div class="Polaris-SkeletonPage__Action" style="width: 97px;">
                        <div class="Polaris-SkeletonBodyText__SkeletonBodyTextContainer">
                            <div class="Polaris-SkeletonBodyText"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="Polaris-SkeletonPage__Content">
                <div class="Polaris-Layout">
                    <div class="Polaris-Layout__Section">
                        <div class="Polaris-Card">
                            <div class="Polaris-Card__Section">
                                <div class="Polaris-SkeletonBodyText__SkeletonBodyTextContainer">
                                    <div class="Polaris-SkeletonBodyText"></div>
                                    <div class="Polaris-SkeletonBodyText"></div>
                                    <div class="Polaris-SkeletonBodyText"></div>
                                </div>
                            </div>
                        </div>
                        <div class="Polaris-Card">
                            <div class="Polaris-Card__Section">
                                <div class="Polaris-TextContainer">
                                    <div class="Polaris-SkeletonDisplayText__DisplayText Polaris-SkeletonDisplayText--sizeSmall"></div>
                                    <div class="Polaris-SkeletonBodyText__SkeletonBodyTextContainer">
                                        <div class="Polaris-SkeletonBodyText"></div>
                                        <div class="Polaris-SkeletonBodyText"></div>
                                        <div class="Polaris-SkeletonBodyText"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="Polaris-Card">
                            <div class="Polaris-Card__Section">
                                <div class="Polaris-TextContainer">
                                    <div class="Polaris-SkeletonDisplayText__DisplayText Polaris-SkeletonDisplayText--sizeSmall"></div>
                                    <div class="Polaris-SkeletonBodyText__SkeletonBodyTextContainer">
                                        <div class="Polaris-SkeletonBodyText"></div>
                                        <div class="Polaris-SkeletonBodyText"></div>
                                        <div class="Polaris-SkeletonBodyText"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="Polaris-Layout__Section Polaris-Layout__Section--secondary">
                        <div class="Polaris-Card">
                            <div class="Polaris-Card__Section">
                                <div class="Polaris-TextContainer">
                                    <div class="Polaris-SkeletonDisplayText__DisplayText Polaris-SkeletonDisplayText--sizeSmall"></div>
                                    <div class="Polaris-SkeletonBodyText__SkeletonBodyTextContainer">
                                        <div class="Polaris-SkeletonBodyText"></div>
                                        <div class="Polaris-SkeletonBodyText"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="Polaris-Card__Section">
                                <div class="Polaris-SkeletonBodyText__SkeletonBodyTextContainer">
                                    <div class="Polaris-SkeletonBodyText"></div>
                                </div>
                            </div>
                        </div>
                        <div class="Polaris-Card Polaris-Card--subdued">
                            <div class="Polaris-Card__Section">
                                <div class="Polaris-TextContainer">
                                    <div class="Polaris-SkeletonDisplayText__DisplayText Polaris-SkeletonDisplayText--sizeSmall"></div>
                                    <div class="Polaris-SkeletonBodyText__SkeletonBodyTextContainer">
                                        <div class="Polaris-SkeletonBodyText"></div>
                                        <div class="Polaris-SkeletonBodyText"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="Polaris-Card__Section">
                                <div class="Polaris-SkeletonBodyText__SkeletonBodyTextContainer">
                                    <div class="Polaris-SkeletonBodyText"></div>
                                    <div class="Polaris-SkeletonBodyText"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- end preloading -->
</div>

<div style="--top-bar-background:#00848e; --top-bar-color:#f9fafb; --top-bar-background-lighter:#1d9ba4;">
    <div class="Polaris-FooterHelp">
        <div class="Polaris-FooterHelp__Content">
            <div class="Polaris-FooterHelp__Icon"><span class="Polaris-Icon Polaris-Icon--colorTeal Polaris-Icon--isColored Polaris-Icon--hasBackdrop"><svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
            <circle cx="10" cy="10" r="9" fill="currentColor"></circle>
            <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m0-4a1 1 0 1 0 0 2 1 1 0 1 0 0-2m0-10C8.346 4 7 5.346 7 7a1 1 0 1 0 2 0 1.001 1.001 0 1 1 1.591.808C9.58 8.548 9 9.616 9 10.737V11a1 1 0 1 0 2 0v-.263c0-.653.484-1.105.773-1.317A3.013 3.013 0 0 0 13 7c0-1.654-1.346-3-3-3"></path>
          </svg></span></div>
            <div class="Polaris-FooterHelp__Text">Need help? Email us at <a class="Polaris-Link" href="mailto:support@digitalwheat.com" data-polaris-unstyled="true">support@digitalwheat.com</a></div>
        </div>
    </div>
</div>

<script>
    window.shopify_app = {};
    window.shopify_app.url = "${action}";
    window.shopify_app.name = "${process.env.appName}";
    window.shopify_app.shop = "${shopDomain}";
    window.shopify_app.api = "${process.env.SHOPIFY_API_KEY}";
    window.shopify_app.shop_name = "${shopName}";
    window.shopify_app.shop_id = "${shopId}";
    window.shopify_app.shop_email = "${shopEmail}";
</script>
<script src="${action}/assets/js/app.js"></script>

</body>
</html>
    `;
            var response = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/html',
                },
                body: html
            };
            resolve(response);

        }).on('error', (e) => {
            reject(Error(e))
        })
    });
    return promise;

};

