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
    const todo = await Todo.getById(id);
    const update = { ...todo, ...attrs };
    const { rows } = await pool.query(
      `
      UPDATE todos 
      SET user_id=$1, 
      task=$2, 
      done=$3  
      WHERE id=$4
      RETURNING *`,
      [update.user_id, update.task, update.done, id]
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
    } else {
      return new Todo(rows[0]);
    }
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM todos WHERE id=$1 RETURNING *',
      [id]
    );
    return new Todo(rows[0]);
  }

};
