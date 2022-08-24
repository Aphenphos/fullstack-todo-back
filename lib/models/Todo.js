const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  task;
  done;
  user_id;

  constructor(row) {
    this.id = row.id;
    this.task = row.task;
    this.done = row.done;
    this.user_id = row.user_id;
  }
  static async insert({ task, user_id }) {
    const { rows } = await pool.query(
      `INSERT INTO todos (task, user_id)
      VALUES ($1, $2)
      RETURNING *`,
      [task, user_id]
    );
    return new Todo(rows[0]);
  }
  static async getAll(user_id) {
    const { rows } = await pool.query(
      `SELECT * FROM todos
      WHERE user_id = $1`,
      [user_id]
    );
    return rows.map((row) => new Todo(row));
  }

  static async updateById(id, attrs) {
    const todo = await this.getById(id);
    const update = { ...todo, ...attrs };
    const { task, done } = update;
    const { rows } = await pool.query(
      `
      UPDATE todos 
      SET task=$1, done=$2,  
      WHERE id=$3 RETURNING *`,
      [task, done, id]
    );
    return new Todo(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM todos
      WHERE id=$1
      `,
      [id]
    );
    if (!rows[0]) {
      return null;
    }
    return new Todo(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );
    return new Todo(rows[0]);
  }

};
