// Helper Functions

var crypto = require('crypto');
var querystring = require('querystring');
var shopifyAPI = require('shopify-node-api');

module.exports.validateHMAC = (params) => {
    // auth_hash used on first time initialization
    if(('auth_hash' in params) && ('shop' in params)){
        let auth_hash = crypto.createHmac('sha256', 'secret')
            .update(params.shop)
            .digest('hex');
        return params.auth_hash === auth_hash;
    }else {
        const hmac = params.hmac;
        if (params.hmac) {
            delete params.hmac;
        }
        try {
            const paramString = querystring.stringify(params);
            let hash = crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET)
                .update(paramString)
                .digest('hex');

            return hmac === hash;
        } catch (e) {
            console.log(e.toString())
            throw new Error('HMAC signature is not valid');
        }
    }
}