import Consul from 'consul';
import config from '../config.js';

export function createConsulRegistry() {
  const SERVICE_NAME = config.name;
  const SERVICE_HOST = config.consul.serviceHost;
  const SERVICE_PORT = config.port;
  const SERVICE_ID = `${config.name}-${config.port}`;

  // Initialize Consul client
  const consul = new Consul({
    host: config.consul.host, // Consul server hostname
    port: config.consul.port, // Consul server port
  });

  // Wraps callback-based Consul methods in Promise for async/await usage
  async function invokeConsul(method, ...args) {
    return new Promise((resolve, reject) => {
      method(...args, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  // Register service to Consul server
  async function register() {
    try {
      await invokeConsul(consul.agent.service.register.bind(consul.agent.service), {
        id: SERVICE_ID,
        name: SERVICE_NAME,
        address: SERVICE_HOST,
        port: SERVICE_PORT,
        check: {
          http: `http://${SERVICE_HOST}:${SERVICE_PORT}/health`,
          interval: '10s',
          timeout: '5s',
        },
      });
      console.log(`User Service registered with Consul at http://${SERVICE_HOST}:${SERVICE_PORT}`);
    } catch (err) {
      console.error('Failed to register User Service with Consul:', err);
      throw err;
    }
  }

  // Deregister service from Consul server
  async function deregister() {
    try {
      await invokeConsul(consul.agent.service.deregister.bind(consul.agent.service), SERVICE_ID);
      console.log(`User Service deregistered from Consul.`);
    } catch (err) {
      console.error('Failed to deregister User Service from Consul:', err);
      throw err;
    }
  }

  return { register, deregister };
}
