"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add a temporary column
    await queryInterface.addColumn("Articles", "content_temp", {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    });

    // 2. Migrate data from old content
    const [articles] = await queryInterface.sequelize.query(
      `SELECT id, content FROM "Articles";`
    );

    for (const article of articles) {
      let parsed;
      try {
        parsed = JSON.parse(article.content); // try parsing if it was valid JSON
      } catch {
        // fallback: wrap text in an array
        parsed = [article.content];
      }
      await queryInterface.sequelize.query(
        `UPDATE "Articles" SET content_temp = :parsed WHERE id = :id`,
        {
          replacements: { parsed: JSON.stringify(parsed), id: article.id },
        }
      );
    }

    // 3. Drop old column
    await queryInterface.removeColumn("Articles", "content");

    // 4. Rename temp column to 'content'
    await queryInterface.renameColumn("Articles", "content_temp", "content");
  },

  async down(queryInterface, Sequelize) {
    // Reverse: back to TEXT
    await queryInterface.addColumn("Articles", "content_temp", {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: "",
    });

    const [articles] = await queryInterface.sequelize.query(
      `SELECT id, content FROM "Articles";`
    );

    for (const article of articles) {
      // stringify array back to text
      const text = Array.isArray(article.content)
        ? article.content.join("\n\n")
        : article.content;
      await queryInterface.sequelize.query(
        `UPDATE "Articles" SET content_temp = :text WHERE id = :id`,
        {
          replacements: { text, id: article.id },
        }
      );
    }

    await queryInterface.removeColumn("Articles", "content");
    await queryInterface.renameColumn("Articles", "content_temp", "content");
  },
};
