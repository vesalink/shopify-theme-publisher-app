export default (sequelize, DataTypes) => {
  const Shop_app = sequelize.define(
    'shop_app',
    {
      application_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      api_token: {
        type: DataTypes.STRING,
        unique: true
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
      },
      deleted_date: {
        type: DataTypes.DATE
      },
      install_date: {
        type: DataTypes.DATE
      },
      shop_id: {
        type: DataTypes.BIGINT
      },
      trial_end: {
        type: DataTypes.DATE
      },
      promo_key: {
        type: DataTypes.STRING
      },
      promo_follow_up_email: {
        type: DataTypes.STRING
      },
      promo_offer_date: {
        type: DataTypes.DATE
      },
      msg_dismissed: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
      },
      price_tier_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      price_tier_date: {
        type: DataTypes.DATE
      },
      activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
      },
      recurring_charge_id: {
        type: DataTypes.BIGINT
      }
    },
    {
      tableName: 'shop_app'
    }
  );
  return Shop_app;
};
