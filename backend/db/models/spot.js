'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'Owner'
      })
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId'
      })

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId'
      })

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId'
      })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [10,50]
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3,30]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3,30]
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3,30]
      }
    },
    lat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    lng: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5,100]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [100,500]
      }
      
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 30,
        max: 3000,
      }
    },
  }, {
    sequelize,
    modelName: 'Spot',
    // defaultScope: {
    //   attributes: {
    //     exclude: ["createdAt", "updatedAt"]
    //   }
    // }
  });
  return Spot;
};