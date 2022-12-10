const _ = require('lodash');

const Joi = require('joi').extend(require('@joi/date'));

const DataHelpers = require('../../../helpers/v1/data.helpers');
const _DataHelper = new DataHelpers();

const ResponseHelper = require('../../../helpers/v1/response.helpers');
const response = new ResponseHelper();

const CartsResource = require('../carts/carts.resources');
const _Carts = new CartsResource();

module.exports = class CartsValidation {
    
    async createOne(req, res, next) {
        console.log('CartsValidation@createOne');
        
        let schema = {
            seller_id: Joi.string().required(),
            product_id: Joi.number().integer().required(),
            qty: Joi.number().integer().required(),
            attribute_value_ids: Joi.array().items(
                Joi.number().integer().required()
            ).optional(),
        }

        let errors = await _DataHelper.joiValidation(req.body, schema);
        if(errors) {
            return response.badRequest('invalid request data', res, errors);
        }

        // Check same seller products
        let cart = await _Carts.findOneByColumnNameAndValue('user_id', req.user.unique_uuid);
        if(cart){
            if(cart.seller_id != req.body.seller_id){
                return response.disallowed('cart already exist with another seller', res, errors);
            }
            req.body.cart = cart;
        }

        //  Need to check product existance
        // TO DO

        // need to check attribute values existance
        // To DO

        next();
    }

    async deleteOne(req, res, next) {
        console.log('CartsValidation@deleteOne');        
        next();
    }

    async deleteOneProduct(req, res, next) {
        console.log('CartsValidation@deleteOneProduct');
        if(!req.params.cartId || req.params.cartId === ''){
            return response.badRequest('cartId_required', res, false);
        }

        let cart = await _Carts.getOne(req.params.cartId);
        if(!cart){
            return response.notFound('Cart not found', res, false);
        }

        if(!req.params.productId || req.params.productId === ''){
            return response.badRequest('productId_required', res, false);
        }
        
        req.body.cart = cart;

        next();
    }

    async getUserCart(req, res, next) {
        console.log('CartsValidation@getUserCart');  
        
        next();
    }

    // async getAll(req, res, next) {
    //     console.log('CartsValidation@getAll');
    //     // verify page and size - set default if not provided
    //     let paginateData = await _DataHelper.getPageAndLimit(req.query);
    //     req.body.page = paginateData.page;
    //     req.body.limit = paginateData.limit;
        
    //     next();
    // }
}