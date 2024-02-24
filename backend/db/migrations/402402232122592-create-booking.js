'use strict';
/** @type {import('sequelize-cli').Migration} */



let options = {};
if (process.env.NODE_ENV === 'production') { 
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

// const { User } = require('../models')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // unique: true
        references: {
          model: 'Spots',
          key: 'id'
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        // unique: true,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: 'CASCADE'
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);

    await queryInterface.addConstraint('Bookings', {
      type: 'unique',
      fields: ['spotId', "userId", 'startDate', "endDate"],
      name: 'unique-booking-for-user-spot-and-dates'
    })
    await queryInterface.addConstraint('Bookings', {
      type: 'unique',
      fields: ['spotId', 'endDate'],
      name: 'unique-spot-date-booking'
    }, options)
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    await queryInterface.dropTable('Bookings');
    // await queryInterface.removeConstraint('Bookings', 'unique-booking-for-user-spot-and-dates')
    // await queryInterface.removeConstraint('Bookings', 'unique-spot-date-booking')
  }
};