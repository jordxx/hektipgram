'use strict';

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Posts', 'TagId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Tags', key: 'id' }
    })
     
  },

  down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Posts', 'TagId')
  }
};
