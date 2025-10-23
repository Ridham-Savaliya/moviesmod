const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  process.exit(0);
})
.catch((err) => {
  console.error('❌ MongoDB Connection Failed:', err.message);
  process.exit(1);
});
