const fs = require('fs');
const path = require('path');

const cache = {};

const loadSql = (filename) => {
  if (cache[filename]) return cache[filename];

  const filePath = path.join(__dirname, '../../sql/queries', filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`SQL file not found: ${filename}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const queries = {};
  const parts = content.split(/^-- :(\w+)\s*$/m);

  for (let i = 1; i < parts.length; i += 2) {
    const name = parts[i].trim();
    const sql  = parts[i + 1].trim();
    queries[name] = sql;
  }

  cache[filename] = queries;
  return queries;
};

module.exports = loadSql;
