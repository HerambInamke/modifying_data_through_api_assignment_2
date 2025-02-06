const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Menu Update (PUT) Route
app.put('/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  // Input validation
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required.' });
  }

  try {
    // Find the menu item by ID
    const menuItem = await mongoose.model('MenuItem').findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    // Update menu item fields
    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;

    // Save the updated item
    await menuItem.save();

    res.status(200).json(menuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating menu item.' });
  }
});

// Menu Delete (DELETE) Route
app.delete('/menu/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the menu item by ID
    const menuItem = await mongoose.model('MenuItem').findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting menu item.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
