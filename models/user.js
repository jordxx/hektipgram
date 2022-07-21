'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {
        foreignKey: 'UserId'
      }),
        User.hasMany(models.Post, {
          foreignKey: 'UserId'
        }),
        User.hasMany(models.Comment, {
          foreignKey: 'UserId'
        })
    }
  }
  User.init({
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate(user, options) {
        user.role = false
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8))
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};