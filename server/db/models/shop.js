export default (sequelize, DataTypes) => {
  const Shop = sequelize.define(
    'shops',
    {
      myshopify_domain: {
        type: DataTypes.STRING,
        unique: true
      },
      domain: {
        type: DataTypes.STRING
      },
      address1: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      country: {
        type: DataTypes.STRING
      },
      country_code: {
        type: DataTypes.STRING(2)
      },
      created_at: {
        type: DataTypes.DATE
      },
      customer_email: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      name: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING(50)
      },
      province: {
        type: DataTypes.STRING
      },
      province_code: {
        type: DataTypes.STRING(2)
      },
      zip: {
        type: DataTypes.STRING(30)
      },
      currency: {
        type: DataTypes.STRING(3)
      },
      timezone: {
        type: DataTypes.STRING(50)
      },
      iana_timezone: {
        type: DataTypes.STRING(50)
      },
      shop_owner: {
        type: DataTypes.STRING
      },
      money_format: {
        type: DataTypes.STRING(50)
      },
      money_with_currency_format: {
        type: DataTypes.STRING(50)
      },
      taxes_included: {
        type: DataTypes.STRING(10)
      },
      tax_shipping: {
        type: DataTypes.STRING(10)
      },
      plan_name: {
        type: DataTypes.STRING
      },
      shopify_shop_id: {
        type: DataTypes.BIGINT
      },
      source: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'shops'
    }
  );
  return Shop;
};
