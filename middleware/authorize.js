'use strict';
require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken')

const ResponseHelper = require('../../helpers/v1/response.helpers');
const response = new ResponseHelper();

const ApplicationResource = require('../../resources/v1/applications/applications.resources');
const _Application = new ApplicationResource();

const ApiTokenResource = require('../../resources/v1/apiTokens/apiTokens.resources');
const _ApiToken = new ApiTokenResource();


module.exports = class AuthorizationMiddleware {
    superAdmin(req, res, next) {
        console.log('AuthorizationMiddleware@superAdmin');
        if (!req.headers['unoapp-token'] || req.headers['unoapp-token'] === '') {
            return response.forbidden('unoapp token is required', res, false);
        }

        let unoappToken = process.env.UNOAPP_TOKEN;
        if (req.headers['unoapp-token'] !== unoappToken) {
            return response.unauthorized('invalid unoapp-token', res, false);
        }

        next()
    }

    async auth(req,res,next){
        console.log('AuthorizationMiddleware@auth');

        if (!req.headers['authorization']) {
            return response.unauthorized('missing api token', res, false);
        }

        let token = req.headers['authorization'];
        
        try{
            
            jwt.verify(token, process.env.JWT_TOKEN_KEY, async(err, decoded) => {
                if (err) {
                  return response.unauthorized(err.message,res,false)
                }
                
                let authUrl = process.env.AUTH_URL + '/api/v1/users/'+ decoded.user_id;
                let user
                try{
                    user = await axios.get(authUrl,{
                        headers : {
                            authorization : token
                        }
                    })
                }
                catch(err){
                    
                    return response.unauthorized("invalid_token", res, false);  
                }
                
                if(user.status === 401 || user === null || user === false){
                    return response.unauthorized("invalid_token", res, false);  
                }

                req.user = user.data.payload;

                next()
            });
        }
        catch (error) {
            return response.unauthorized(error.message, res, false);
        }
        
    }

}