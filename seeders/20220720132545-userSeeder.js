'use strict';
const fs = require("fs")
const bcrypt = require('bcryptjs')
module.exports = {
  up (queryInterface, Sequelize) {
    
    let data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"))
    data.forEach(el => {
      el.password = bcrypt.hashSync(el.password, bcrypt.genSaltSync(8))
      el.createdAt = new Date()
      el.updatedAt = new Date()
    });

    return queryInterface.bulkInsert("Users", data)
  },

  down (queryInterface, Sequelize) {
    
    return queryInterface.bulkDelete("Users")
  }
};
