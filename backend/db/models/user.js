'use strict';
const { Model , Validator} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Booking, {
        foreignKey: 'userId'
      })

      User.hasMany(models.Spot, {
        foreignKey: 'ownerId'
      })
      User.hasMany(models.Review, {
        foreignKey: 'userId'
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2,30],
        isNotEmail(value) {
          if(Validator.isEmail(value)) {
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        len: [2,30],
        isNotEmail(value) {
          if(Validator.isEmail(value)) {
            throw new Error("Cannot be an email.")
          }
        }
      }

    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        len: [2,30],
        isNotEmail(value) {
          if(Validator.isEmail(value)) {
            throw new Error("Cannot be an email.")
          }
        }
      }

    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3,256],
        isEmail: true
      }
    },
    hashedPassword:{ 
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60,60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  });
  return User;
};