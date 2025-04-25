// models/userprofile.js

module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define("UserProfile", {
    profile_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  UserProfile.associate = (models) => {
    // If you later add relationships, define them here
    // Example: UserProfile.hasMany(models.Event);
  };

  return UserProfile;
};
