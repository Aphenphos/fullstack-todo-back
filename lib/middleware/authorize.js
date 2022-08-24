const Todo = require('../models/Todo');

module.exports = async (req, res, next) => {
  try {
    const todo = await Todo.getById(req.params.id);
    if(todo.user_id !== req.user.id) {
      throw new Error('You dont have perms');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
