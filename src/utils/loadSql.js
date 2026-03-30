const fs = require('fs');
const path = require('path');

/**
 * Reads a .sql file from sql/queries/ and returns a keyed object of query strings.
 *
 * Convention: each query is preceded by a marker comment:
 *   -- :queryName
 *
 * Example:
 *   -- :getAll
 *   SELECT * FROM members ORDER BY id DESC;
 *
 * Usage:
 *   const Q = loadSql('members.sql');
 *   pool.query(Q.getAll);
 */
const loadSql = (filename) => {
  const filePath = path.join(__dirname, '../../sql/queries', filename);
  const content = fs.readFileSync(filePath, 'utf-8');

  const queries = {};
  // Split on lines that look like "-- :queryName"
  const parts = content.split(/^-- :(\w+)\s*$/m);

  // parts layout: [preamble, name1, body1, name2, body2, ...]
  for (let i = 1; i < parts.length; i += 2) {
    const name = parts[i].trim();
    const sql  = parts[i + 1].trim();
    queries[name] = sql;
  }

  return queries;
};

module.exports = loadSql;
