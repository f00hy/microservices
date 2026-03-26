import mongoose from 'mongoose';

// Define the Product schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

export default Product;
