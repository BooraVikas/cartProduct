'use strict';

const { Op } = require("sequelize");

const DataHelper = require('../../../helpers/v1/data.helpers');
const _DataHelper = new DataHelper();

const RedisService = require('../../../services/redis')
const _RedisService = new RedisService()

const CartProduct = require('./cart_product.model');

module.exports = class CartProductsResource {
    
    async createOne(data = null) {
    
        console.log('CartProductsResource@createOne');
        if (!data || data === '') {
            throw new Error('data is required');
        }
        
        // let result = await _RedisService.setCache(key,data,process.env.REDIS_EXPIRATION);
        let result = await CartProduct.create(data);

        if (!result) {
            return false;
        }

        return result;
    }

    async findByCartIdAndProductId(cartId = '', productId = '') {
        console.log('CartProductsResource@findByCartIdAndProductId');
        if ((!cartId || cartId === '') || (!productId || productId === '')) {
            throw new Error('cartId and productId is required');
        }

        let result = await CartProduct.findOne({
            where: {
                cart_id: cartId,
                product_id: productId
            }
        })

        if(!result){
            return false;
        }

        return result;
    }

    async getCountByCartId(cartId = '') {
        console.log('CartProductsResource@getCountByCartId');
        if (!cartId || cartId === '') {
            throw new Error('cartId is required');
        }

        let result = await CartProduct.count({
            where: {
                cart_id: cartId,
            }
        })

        if(!result){
            return false;
        }

        return result;
    }

    async updateOne(id, data) {
        console.log('CartProductsResource@updateOne');
        try {
            let result = await CartProduct.update(data, {
                where: {
                    id: id
                }
            });

            if(!result){
                return false;
            }
    
            return result;

        } catch (err) {
            Error.payload = err.errors ? err.errors : err.message;
            throw new Error();
        }
    }

    async deleteOneByCartId(cartId = '', productId = '') {
        console.log('CartProductsResource@deleteOneByCartId');
        if ((!cartId || cartId === '') || (!productId || productId === '')) {
            throw new Error('cartId and productId is required');
        }

        let result = await CartProduct.destroy({
            where: {
                cart_id: cartId,
                product_id: productId
            }
        })

        if(!result){
            return false;
        }

        return result;
    }
}