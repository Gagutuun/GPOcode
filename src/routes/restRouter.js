const express = require('express');
const router = express.Router();

let items = [];

router.get('/', (req, res) => {
  res.json(items);
});

router.post('/', (req, res) => {
  const newItem = req.body;
  items.push(newItem);
  res.status(201).json(newItem);
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body;
  items = items.map(item => item.id === id ? updatedItem : item);
  res.json(updatedItem);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  items = items.filter(item => item.id !== id);
  res.status(204).end();
});

module.exports = router;