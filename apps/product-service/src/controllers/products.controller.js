import Product from '../models/Product.js';

function isBadRequestError(error) {
  return (
    error &&
    (error.name === 'CastError' ||
      error.name === 'BSONTypeError' ||
      error.name === 'ValidationError' ||
      error.name === 'MongoServerError')
  );
}

export async function createProduct(req, res) {
  try {
    const { id, name, description, price, category } = req.body || {};
    if (!(id && name && description && category && Number.isFinite(price))) {
      return res.status(400).send('id, name, description, price, and category are required');
    }

    const productData = { id, name, description, price, category };
    const product = new Product(productData);
    const savedProduct = await product.save();
    return res.status(201).send(savedProduct);
  } catch (error) {
    return res.status(isBadRequestError(error) ? 400 : 500).send(error);
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).send('Product not found');
    }

    return res.send(product);
  } catch (error) {
    return res.status(isBadRequestError(error) ? 400 : 500).send(error);
  }
}

export async function updateProduct(req, res) {
  try {
    const { id, name, description, price, category } = req.body || {};
    if (!(id && name && description && category && Number.isFinite(price))) {
      return res.status(400).send('id, name, description, price, and category are required');
    }

    const update = { id, name, description, price, category };
    const product = await Product.findOneAndUpdate({ id: req.params.id }, update, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!product) {
      return res.status(404).send('Product not found');
    }

    return res.send(product);
  } catch (error) {
    return res.status(isBadRequestError(error) ? 400 : 500).send(error);
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).send('Product not found');
    }

    return res.send(product);
  } catch (error) {
    return res.status(isBadRequestError(error) ? 400 : 500).send(error);
  }
}
