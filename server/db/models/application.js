export default (sequelize, DataTypes) => {
  const Application = sequelize.define(
    'applications',
    {
      app_name: {
        type: DataTypes.STRING
      },
      testing: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
      }
    },
    {
      tableName: 'applications'
    }
  );
  return Application;
};
