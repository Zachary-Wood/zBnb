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
          isAfter: '2024-02-23',
          async isStartDateValid(value) {
            await Booking.findOne({
                where: {
                  spotId: this.spotId,
                  endDate: {
                    [Op.gt]: value
                  }
                }
              }.then((existingBooking) => {
                if(existingBooking) {
                  throw new Error('Someone has a booking on this date')
                }
              })
            )
          }
        } 
    },
    endDate: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: true,
        isAfter: this.startDate
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