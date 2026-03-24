console.log('Attempting to require src/index.js...');
try {
  require('./src/index.js');
  console.log('Successfully required src/index.js');
} catch (e) {
  console.error('Failed to require src/index.js');
  console.error(e);
}
