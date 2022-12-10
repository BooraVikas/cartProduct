'use strict';

const { Op } = require("sequelize");

const DataHelper = require('../../../helpers/v1/data.helpers');
const _DataHelper = new DataHelper();

const RedisService = require('../../../services/redis');
const { associate, associations } = require("../apiTokens/apiToken.model");
const _RedisService = new RedisService()

const Cart = require('./cart.model');

module.exports = class CartsResource {

    async createOne( data = null) {
    
        console.log('CartsResource@createOne');
        if (!data || data === '') {
            throw new Error('data is required');
        }
        
        // let result = await _RedisService.setCache(key,data,process.env.REDIS_EXPIRATION);
        let result = await Cart.create(data);
        if (!result) {
            return false;
        }

        return result;
    }

    async deleteOne(id) {
        console.log('CartsResource@deleteOne');
        if (!id || id === '') {
            throw new Error('id is required');
        }
        let result = await Cart.destroy({
            where: {
                id: id
            }
        })

        if(!result){
            return false;
        }

        return result;
    }

    async getOne(id) {
        console.log('CartsResource@getOne');
        if (!id || id === '') {
            throw new Error('id is required');
        }
        let result = await Cart.findOne({
            where: {
                id: id
            },
            include: ['cart_products']
        })

        if(!result){
            return false;
        }

        return result;
    }

    async findOneByColumnNameAndValue(columnName = '', columnValue = '') {
        console.log('CartsResource@findOneByColumnNameAndValue');
        if ((!columnName || columnName === '') || (!columnValue || columnValue === '')) {
            throw new Error('columnName and columnValue is required');
        }

        let result = await Cart.findOne({
            where: {
                [columnName]: columnValue
            },
            include: ['cart_products']
        })

        if(!result){
            return false;
        }

        return result;
    }

    // async UpdateOne(key, data = null) {
    
    //     console.log('CartsResource@createOne');
    //     if (!data || data === '') {
    //         throw new Error('data is required');
    //     }
        
    //     let result = await _RedisService.createOne(key,data,process.env.REDIS_EXPIRATION);

    //     if (!result) {
    //         return false;
    //     }

    //     return result;
    // }

    // async getAll(pageNo = null, limit = null) {
    //     console.log('CartssResource@getAll');
    //     // get a count of all the folders
    //     let totalRecords = await _RedisService.getCount();

    //     let pagination = await _DataHelper.pagination(totalRecords, pageNo, limit);

    //     let results;

    //     try {
    //         results = await _RedisService.getAllKeys();
    //     } catch (err) {
    //         Error.payload = err.errors ? err.errors : err.message;
    //         throw new Error();
    //     }

    //     if (results.length < 1) {
    //         return false;
    //     }

    //     let resObj = {
    //         total: totalRecords,
    //         current_page: pagination.pageNo,
    //         total_pages: pagination.totalPages,
    //         per_page: pagination.limit,
    //         data: results
    //     }

    //     return resObj;
    // }

    // async getOneByUserId(key){
    //     console.log("UsersResource@getOneByUserId")
    //     if (!key || key === '') {
    //         throw new Error('key is required');
    //     }
    //     //await _RedisService.clearCache(key)
    //     let result = await _RedisService.getCache(key)

    //     if(!result){
    //         return false;
    //     }


    //     return result;
    // }
}