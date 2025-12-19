import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Article extends Model {
    static associate(models) {
      // future associations
    }
  }

  Article.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.JSONB, allowNull: false },
      summary: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: "Article",
      tableName: "Articles",
      timestamps: true,
    }
  );

  return Article;
};
