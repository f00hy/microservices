import Consul from 'consul';
import config from './config.js';

export function createConsulRegistry() {
  let userServices = [];
  let productServices = [];
  let nextUser = -1;
  let nextProduct = -1;

  // Initialize Consul client
  const consul = new Consul({
    host: config.consul.host,
    port: config.consul.port,
  });

  // Extract service URLs from Consul health check data
  function extractServiceUrls(data) {
    if (!data || data.length === 0) {
      return [];
    }
    return data.map((entry) => {
      const address = entry.Service.Address || entry.Node.Address;
      const port = entry.Service.Port;
      return `http://${address}:${port}`;
    });
  }

  // Set up Consul watcher for user service
  const watchUser = consul.watch({
    method: consul.health.service,
    options: {
      service: config.services.user,
      passing: true,
    },
  });

  // Listen for changes on user service
  watchUser.on('change', (data) => {
    userServices = extractServiceUrls(data);
    console.log(`User service routing table updated: ${userServices}`);
  });

  // Handle errors from user service Consul watcher
  watchUser.on('error', (err) => {
    console.error(`User service Consul watch error: ${err}`);
  });

  // Set up Consul watcher for product service
  const watchProduct = consul.watch({
    method: consul.health.service,
    options: {
      service: config.services.product,
      passing: true,
    },
  });

  // Listen for changes on product service
  watchProduct.on('change', (data) => {
    productServices = extractServiceUrls(data);
    console.log(`Product service routing table updated: ${productServices}`);
  });

  // Handle errors from product service Consul watcher
  watchProduct.on('error', (err) => {
    console.error(`Product service Consul watch error: ${err}`);
  });

  // Get an user service URL
  function getUserService() {
    if (userServices.length > 0) {
      // Round-Robin load balancing
      nextUser = (nextUser + 1) % userServices.length;
      return userServices[nextUser];
    }
    throw new Error('No user services available');
  }

  // Get a product service URL
  function getProductService() {
    if (productServices.length > 0) {
      // Round-Robin load balancing
      nextProduct = (nextProduct + 1) % productServices.length;
      return productServices[nextProduct];
    }
    throw new Error('No product services available');
  }

  // Close Consul watchers
  function close() {
    watchUser.end();
    watchProduct.end();
  }

  return { getUserService, getProductService, close };
}
