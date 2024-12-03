import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

const app = express();
const PORT = 1245;
const client = createClient();

app.use(express.json());

const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { id: 4, name: 'Suitcase 1050', price: 350, initialAvailableQuantity: 5 }
];

/**
 * Retrieves a product from the list by its ID.
 * @param {number} id - The ID of the product to retrieve.
 * @returns {object|null} The product object if found, otherwise null.
 */
function getItemById(id) {
  return listProducts.find((item) => item.id === id) || null;
}

/**
 * Reserves stock for a product by updating its stock count in Redis.
 * @param {number} itemId - The ID of the product to reserve stock for.
 * @param {number} stock - The new stock value to reserve.
 * @returns {Promise<string>} A promise resolving to the Redis response.
 */
async function reserveStockById(itemId, stock) {
  return promisify(client.SET).bind(client)(`item.${itemId}`, stock);
}

/**
 * Retrieves the current reserved stock for a product from Redis.
 * @param {number} itemId - The ID of the product to retrieve stock for.
 * @returns {Promise<number>} A promise resolving to the current reserved stock.
 */
async function getCurrentReservedStockById(itemId) {
  const stock = await promisify(client.GET).bind(client)(`item.${itemId}`);
  return Number(stock) || 0;
}

/**
 * Endpoint to retrieve the list of all products.
 * @route GET /list_products
 * @returns {Array} An array of all products.
 */
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

/**
 * Endpoint to retrieve details of a specific product by ID, including its current available quantity.
 * @route GET /list_products/:itemId
 * @param {number} itemId - The ID of the product to retrieve.
 * @returns {object} The product details or an error message if the product is not found.
 */
app.get('/list_products/:itemId(\\d+)', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const currentItem = getItemById(itemId);

  if (!currentItem) {
    res.json({ status: 'Product not found' });
    return;
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = currentItem.initialAvailableQuantity - reservedStock;
  res.json({ ...currentItem, currentQuantity });
});

/**
 * Endpoint to reserve a product by its ID.
 * @route GET /reserve_product/:itemId
 * @param {number} itemId - The ID of the product to reserve stock for.
 * @returns {object} Confirmation of reservation or an error message if stock is unavailable or the product is not found.
 */
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const currentItem = getItemById(itemId);

  if (!currentItem) {
    res.json({ status: 'Product not found' });
    return;
  }

  const reservedStock = await getCurrentReservedStockById(itemId);

  if (reservedStock >= currentItem.initialAvailableQuantity) {
    res.json({ status: 'Not enough stock available', itemId });
    return;
  }

  await reserveStockById(itemId, reservedStock + 1);
  res.json({ status: 'Reservation confirmed', itemId });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
module.exports  = app;