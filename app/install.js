// Handle app installation

'use strict';

var shopifyAPI = require('shopify-node-api');
const querystring = require('querystring');
const axios = require("axios");
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
var crypto = require('crypto');

module.exports.index = async event => {
  const action = 'https://' + event.headers.Host;// + '/' + event.requestContext.stage;


  const html = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="shortcut icon" type="image/png" href="${action}/assets/favicon.png" />
    <link rel="stylesheet" href="${action}/assets/css/app.css"/>

    <title>${process.env.appName} - Install</title>
</head>
<body>
<div style="--top-bar-background:#00848e; --top-bar-color:#f9fafb; --top-bar-background-lighter:#1d9ba4;">
    <div class="Polaris-Page Polaris-Page--narrowWidth">
        <div class="Polaris-Page-Header Polaris-Page-Header--separator Polaris-Page-Header--mobileView">
            <div class="Polaris-Page-Header__MainContent">
                <div class="Polaris-Page-Header__TitleActionMenuWrapper">
                    <div class="Polaris-Page-Header__Title">
                        <div>
                            <h1 class="Polaris-DisplayText Polaris-DisplayText--sizeLarge">Install ${process.env.appName}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="Polaris-Page__Content">
            <div class="Polaris-Card">
                <div class="Polaris-Card__Section">
                    <div style="--top-bar-background:#00848e; --top-bar-color:#f9fafb; --top-bar-background-lighter:#1d9ba4;">
                        <form action="${action}/install/store" method="post">
                            <div class="Polaris-FormLayout">
                                <div class="Polaris-FormLayout__Item">
                                    <div class="">
                                        <div class="Polaris-Labelled__LabelWrapper">
                                            <div class="Polaris-Label"><label id="shopLabel" for="shop" class="Polaris-Label__Text">Enter your domain:</label></div>
                                        </div>
                                        <div class="Polaris-TextField"><input id="shop" class="Polaris-TextField__Input" type="text" aria-invalid="false" name="shop" value="" placeholder="your-store.myshopify.com" required>
                                            <div class="Polaris-TextField__Backdrop"></div>
                                        </div>
                                        <div class="Polaris-Labelled__HelpText" id="domainLabelHelpText">Enter your domain at <b>myshopify.com</b> to install the application.</div>
                                    </div>
                                </div>
                                <div class="Polaris-FormLayout__Item"><button type="submit" class="Polaris-Button Polaris-Button--primary"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Install</span></span></button></div>
                            </div><span class="Polaris-VisuallyHidden"><button type="submit" aria-hidden="true">Submit</button></span>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html,
  };

};

module.exports.store = async (event) => {
  const action = 'https://' + event.headers.Host;// + '/' + event.requestContext.stage;
  const data = querystring.parse(event.body);
  const qs = event.queryStringParameters || {};
  const timestamp = new Date().getTime();

  if(qs.code){
    var shop = qs.shop.replace('.myshopify.com','');
    var Shopify = new shopifyAPI({
      shop: shop,
      shopify_api_key: process.env.SHOPIFY_API_KEY,
      shopify_shared_secret: process.env.SHOPIFY_API_SECRET,
      nonce: 'shopify_app',
    });

    const promise = new Promise( function (resolve, reject) {
      Shopify.exchange_temporary_token(qs, function(err, data){
        if(err){
          throw new Error('An error occurred');
        }
        resolve({"accessToken": data['access_token']});
      })
    })
      .then(function (args) {
          return new Promise((resolve, reject) => {
            Shopify.get('/admin/shop.json', {}, function(err, data, headers){
              if (!data.shop) {
                console.error('Validation Failed');
              let response = {
                statusCode: 400,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t create the shop item.',
              };
              resolve(response);
            }
              resolve({"accessToken":args.accessToken, "shop": data.shop});
          });
        })
      })
      .then(function (args) {
        return new Promise((resolve, reject) => {
          const params = {
            TableName: process.env.tableName,
            Item: {
              shopId: args.shop.id.toString(),
              name: args.shop.name,
              email: args.shop.email,
              shop: shop,
              domain: args.shop.myshopify_domain,
              shopPlan: args.shop.plan_name,
              shopOwner: args.shop.shop_owner,
              shopCountry: args.shop.country_code,
              shopCity: args.shop.city,
              shopTimezone: args.shop.iana_timezone,
              fullDomain: args.shop.domain || args.shop.myshopify_domain,
              accessToken: args.accessToken,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          };

          dynamoDb.put(params, (error) => {
            // handle potential errors
            if (error) {
              console.error(error);
              let response = {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'Couldn\'t create the shop item.',
              };
              resolve(response);
            }

            resolve({"accessToken":args.accessToken, "shop": args.shop});
          });
        });
      })
      .then(function (args) {
        return new Promise((resolve, reject) => {
          var webhook = {
            "webhook": {
              "topic": "app/uninstalled",
              "address": action + '/webhooks/uninstall',
              "format": "json"
            }
          };

          Shopify.post(`/admin/webhooks.json`, webhook, function (err, data, headers) {
            if (err) {
              console.error(err);
              let response = {
                statusCode: 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'Couldn\'t register the webhhok.',
              };
              resolve(response);
            }
            resolve({"shop": args.shop});
          });
        });
      })
      .then(function (args) {
        return new Promise((resolve, reject) => {
          let auth_hash = crypto.createHmac('sha256', 'secret')
              .update(args.shop.myshopify_domain)
              .digest('hex');

          const response = {
            statusCode: 301,
            headers: {
              Location: action + '/?shop=' + args.shop.myshopify_domain + '&auth_hash=' + auth_hash
            }
          };
          resolve(response);
        });
      });

    return promise;
  } else {

    var shop = data.shop || qs.shop;

    shop = shop
        .replace('https://', '')
        .replace('http://', '')
        .replace('/', '')
        .replace('.myshopify.com', '').toLowerCase();

    if (!shop) {
      const response = {
        statusCode: 301,
        headers: {
          Location: action + '/install'
        }
      };

      return response;
    }


    var Shopify = new shopifyAPI({
      shop: shop,
      shopify_api_key: process.env.SHOPIFY_API_KEY,
      shopify_shared_secret: process.env.SHOPIFY_API_SECRET,
      shopify_scope: 'read_orders',
      redirect_uri: action + '/install/store',
      nonce: 'shopify_app'
    });

    var auth_url = Shopify.buildAuthURL();

    const response = {
      statusCode: 301,
      headers: {
        Location: auth_url
      }
    };

    return response;
  }
};
