// models/event.js

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    image: {
      type: DataTypes.STRING, // Just store file name or URL
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    host: {
      type: DataTypes.STRING, // Host is profile_name of UserProfile
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    event_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    event_place: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estimated_attendees: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  Event.associate = (models) => {
    // Relationships can be defined here if you want later
    // Example: Event.belongsTo(models.UserProfile, { foreignKey: 'userId' });
  };

  return Event;
};
