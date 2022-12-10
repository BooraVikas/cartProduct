'use strict';
const Sequelize = require('sequelize');

module.exports = class CartModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            seller_id: {
                type: DataTypes.STRING,
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
            modelName: 'Cart',
            tableName: 'carts',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            underscored: true,
            sequelize,
        }
      )
    } 
  
    static associate(models) {
  
        this.relationship = this.hasMany(models.CartProduct, {
            as: 'cart_products',
            foreignKey: 'cart_id',
            onDelete: 'CASCADE',
        })
  
      }
    
}