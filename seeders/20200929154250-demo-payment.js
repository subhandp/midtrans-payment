'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Payments", [ 
    {
      idOrder: "order123",
      status: "pending",
      token: "ce83bd16-dcd1-45cc-8b2e-dbd11c57f8a6",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      idOrder: "order12345",
      status: "pending",
      token: "264c1a3c-8334-4b8a-beda-bec68ede0821",
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
    return queryInterface.bulkDelete("Payments", null, {})
  }
};
