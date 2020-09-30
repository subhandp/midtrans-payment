'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Orders", [ 
      {
        total: 100000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        total: 500000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Orders", null, {})
  }
};
