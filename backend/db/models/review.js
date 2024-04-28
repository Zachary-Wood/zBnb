'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      })

      Review.belongsTo(models.Spot, {
        foreignKey: 'id'
      })

      Review.hasMany(models.ReviewImage, {
        foreignKey: "reviewId", 
      })
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      min: 1,
      max: 5
    },
  }, {
    sequelize,
    modelName: 'Review',
    // defaultScope: {
    //   attributes: {
    //     exclude: ["createdAt", "updatedAt"]
    //   }
    // }
  });
  return Review;
};