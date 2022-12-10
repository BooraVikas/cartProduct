const _ = require('lodash');

const ResponseHelper = require('../../../helpers/v1/response.helpers');
const response = new ResponseHelper();

const CartsResource = require('./carts.resources');
const _Carts = new CartsResource();

const CartProductsResource = require('../cartProducts/cart_products.resources');
const _CartProducts = new CartProductsResource();

const InventoryResources = require('../../../services/inventory.services')
const _Inventory = new InventoryResources()

const ProductService = require('../../../services/product.services');
const _Product = new ProductService();

module.exports = class CartsController {

    async createOne(req,res){   
        console.log('CartsController@createOne');
        let data = _.pick(req.body,['seller_id', 'product_id', 'qty', 'attribute_value_ids'])
        
        data.user_id = req.user.unique_uuid;

        if(data.seller_id){
            let sellerProductCheck = await _Inventory.sellerProductsCheck(data.seller_id , [data.product_id])
            if(!sellerProductCheck || sellerProductCheck.length <= 0){
                return response.exception('seller does not have the selected product', res, false);
            }
        }

        // Inserted data in carts table
        let cartData = {
            user_id: req.user.unique_uuid,
            seller_id: data.seller_id
        }

        let cartObj;
        if(req.body.cart){
            cartObj = req.body.cart;
        }
        else {
            cartObj = await _Carts.createOne(cartData);
            if (!cartObj) {
                return response.exception('Cart not created', res, false);
            }
        }

        // Inserted data in cart products table
        let cartProductData = {
            cart_id: cartObj.id,
            product_id: data.product_id,
            qty: data.qty,
            product_attribute_value_ids: data.attribute_value_ids
        };

        let cartProductObj = await _CartProducts.findByCartIdAndProductId(cartObj.id, data.product_id);
        if(cartProductObj){
            await _CartProducts.updateOne(cartProductObj.id, cartProductData);
        }
        else {
            cartProductObj = await _CartProducts.createOne(cartProductData);
            if (!cartProductObj) {
                await _Carts.deleteOne(cartObj.id);
                return response.exception('Cart not created', res, false);
            }
        }
            

        let result = await _Carts.getOne(cartObj.id);
        return response.created('Cart created successfully', res, result);
    }

    async deleteOne(req, res) {
        console.log('CartsController@deleteOne');
        let cartObj = await _Carts.findOneByColumnNameAndValue('user_id', req.user.unique_uuid);
        if(!cartObj){
            return response.notFound('no Carts found', res, false);
        }

        let hasDeleted = await _Carts.deleteOne(cartObj.id);
        if(!hasDeleted){
            return response.exception('not_deleted', res, false);
        }

        return response.success('cart_empty', res, true);
    }

    async deleteOneProduct(req, res) {
        console.log('CartsController@deleteOne');
        const cartObj = req.body.cart;

        let hasDeleted = await _CartProducts.deleteOneByCartId(cartObj.id, req.params.productId);
        if(!hasDeleted){
            return response.exception('not_deleted', res, false);
        }

        let cartProductCount = await _CartProducts.getCountByCartId(cartObj.id);
        if(!cartProductCount || cartProductCount <= 0){
            await _Carts.deleteOne(cartObj.id);
        }

        return response.success('Cart product deleted!', res, cartProductCount ? String(cartProductCount) : "0");
    }
    
    async getUserCart(req, res) {
        console.log('CartsController@getUserCart');
        let userUuid = req.user.unique_uuid;
        let cartObj = await _Carts.findOneByColumnNameAndValue('user_id', userUuid);
        if(!cartObj){
            return response.notFound('Cart not found', res, false);
        }

        let productsPrice = 0;
        let attributesPrice = 0;
        if(cartObj.cart_products && cartObj.cart_products.length > 0){ // Check if cart products exist or not
            for(let cartProduct of cartObj.cart_products){  // Apply loop on each cart products
                const cartProductAttributeValueIds = cartProduct.product_attribute_value_ids ? cartProduct.product_attribute_value_ids : [];

                // Fetching product details from products service alongwith the attribute values
                let productDetails = await _Product.getProductDetailWithAttributeValues(cartProduct.product_id);
                if(productDetails){
                    productDetails = productDetails.payload;
                    let productAttributeValues = productDetails.product_attribute_values;
                    let selectedAttributeValues = [];
                    delete productDetails.product_attribute_values;

                    // If cart product have additional product attribute values
                    if(cartProductAttributeValueIds && cartProductAttributeValueIds.length > 0){

                        // maped the product attribute values and stored into the formated way
                        selectedAttributeValues = productAttributeValues.map((item) => {
                            if(item.attributes_values && item.attributes_values.id && cartProductAttributeValueIds.includes(item.attributes_values.id)){
                                attributesPrice = attributesPrice + (item.attributes_values.price * cartProduct.qty);
                                return item.attributes_values;
                            }
                            return false;
                        });
                    }

                    // Attached the formated attribute values to the cart product object
                    selectedAttributeValues = selectedAttributeValues.filter(item => item);
                    productDetails = {...productDetails, selected_attribute_values: selectedAttributeValues};
                    productsPrice = productsPrice + (productDetails.price * cartProduct.qty)

                    cartProduct.setDataValue('product_details', productDetails)
                }
            }
        }

        let totalAmount = productsPrice + attributesPrice;
        cartObj.setDataValue('amout', {
            total_amount: totalAmount,
            products_price: productsPrice,
            attributes_price: attributesPrice
        });
        return response.success('cart detail', res, cartObj);
    }

    // async getAll(req, res) {
    //     console.log('CartsController@getAll');
    //     let data = _.pick(req.body,['page', 'limit'])
    //     let result = await _Carts.getAll(data.page, data.limit);

    //     if(!result) {
    //         return response.notFound('no Cartss found', res, false);
    //     }

    //     return response.success('api Cartss found', res, result);
    // }
  

}