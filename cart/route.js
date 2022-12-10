const express = require('express');
const routes = express.Router();

const RequestLogMiddleware = require('../../../middleware/v1/requestLog');
const reqLog = new RequestLogMiddleware();

const Authorize = require('../../../middleware/v1/authorize');
const auth = new Authorize();

const CartsValidation = require('./carts.validation');
const validate = new CartsValidation();

const CartsController = require('./carts.controller.js');
const cart = new CartsController();

/**
 * routes
 */

routes.post('/', [auth.auth, validate.createOne], cart.createOne)
routes.delete('/', [auth.auth, validate.deleteOne], cart.deleteOne)
routes.delete('/:cartId/:productId', [auth.auth, validate.deleteOneProduct], cart.deleteOneProduct)
routes.get('/user',[auth.auth, validate.getUserCart], cart.getUserCart)

// routes.get('/',[validate.getAll],cart.getAll)



module.exports = routes;