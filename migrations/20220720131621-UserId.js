'use strict';

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Posts', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    })
     
  },

  down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Posts', 'UserId')
  }
};
