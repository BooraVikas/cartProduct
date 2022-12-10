'use strict';
const Sequelize = require('sequelize');

module.exports = class CartProductModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            cart_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'carts',
                    key: 'id',
                },
                onDelete: 'SET NULL'
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            qty: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                allowNull: false,
            },
            product_attribute_value_ids: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                onUpdate: 'SET DEFAULT',
                defaultValue: Sequelize.NOW,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            }
        },
        {
            modelName: 'CartProduct',
            tableName: 'cart_products',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            underscored: true,
            sequelize,
        }
      )
    } 
  
    
}