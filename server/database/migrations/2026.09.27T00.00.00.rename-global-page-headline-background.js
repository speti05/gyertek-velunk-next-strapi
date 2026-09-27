"use strict";

// Global.pageHeadlineBackground was renamed to defaultPageHeadlineBackground.
// Media links are stored by attribute name, so re-point the existing link instead of losing it.
module.exports = {
  async up(knex) {
    if (!(await knex.schema.hasTable("files_related_mph"))) return;

    await knex("files_related_mph")
      .where({ related_type: "api::global.global", field: "pageHeadlineBackground" })
      .update({ field: "defaultPageHeadlineBackground" });
  },
};
