const express = require('express');
const routes = express.Router();

const RequestLogMiddleware = require('../../../middleware/v1/requestLog');
const reqLog = new RequestLogMiddleware();

const Authorize = require('../../../middleware/v1/authorize');
const auth = new Authorize();

const CartProductsValidation = require('./cart_products.validation');
const validate = new CartProductsValidation();

const CartProductsController = require('./cart_products.controller.js');
const cartProduct = new CartProductsController();

/**
 * routes
 */



module.exports = routes;