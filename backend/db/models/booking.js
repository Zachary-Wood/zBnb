'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {
        foreignKey: "userId"
      })
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      })
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      // unique: true,
      validate: {
        isInt: true,
        min: 1
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // unique: true,
      validate: {
        isInt: true,
        min: 1
      }
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        } 
    },
    endDate: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: true,
        }
      }
  }, {
    sequelize,
    modelName: 'Booking',
    // defaultScope: {
    //   attributes: {
    //     exclude: ["createdAt", "updatedAt"]
    //   }
    // }
  });
  return Booking;
};