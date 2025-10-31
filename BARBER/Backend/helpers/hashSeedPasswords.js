const bcrypt = require('bcryptjs');

(async () => {
  const plain = process.argv[2] || 'pass1234';
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plain, salt);
  console.log('Plain:', plain);
  console.log('Hashed:', hashed);
  process.exit(0);
})();
