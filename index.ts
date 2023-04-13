const cron = require('node-cron');
const { getNetworkStats } = require('./src/redes.spec.js');

console.log('Starting script...');
cron.schedule('*/30 * * * *', async () => {
  console.log('Running script...');
  await getNetworkStats();
  console.log('Script finished.\n');
});

process.on('SIGINT', () => {
  console.log('Script ended.\n');
  process.exit();
});
