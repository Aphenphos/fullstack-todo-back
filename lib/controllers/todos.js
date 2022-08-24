const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Todo = require('../models/Todo');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const data = await Todo.insert({ ...req.body, user_id: req.user.id });
      res.json(data);
    } catch (e) {
      next(e);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const todos = await Todo.getAll(req.user.id);
      res.json(todos);
    } catch (e) {
      next(e);
    }
  })
  
  .put('/:id', [authenticate, authorize], async (req, res, next) => {
    try {
      const updateTodo = await Todo.updateById(req.params.id, req.body);
      res.json(updateTodo);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', [authenticate, authorize], async (req, res, next) => {
    try {
      const deleteTodo = await Todo.delete(req.params.id);
      res.send(deleteTodo);
    } catch (e) {
      next(e);
    }
  })
;
