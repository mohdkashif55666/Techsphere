import mongoose from 'mongoose';

let _memServer = null;

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (uri) {
    // Use the provided URI (Atlas, local mongod, etc.)
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected → ${uri}`);
    return;
  }

  // ── Fallback: in-memory MongoDB (zero external dependency) ──────────────
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    _memServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.14', // Explicit Debian 12+ compatible binary
      },
    });
    const memUri = _memServer.getUri();
    await mongoose.connect(memUri);
    console.log('✅ MongoDB connected → in-memory (mongodb-memory-server)');
    console.log('   ℹ️  Set MONGO_URI in server/.env to persist data between restarts.');
  } catch (err) {
    console.error('In-memory MongoDB startup failed:', err.message);
    console.error(
      '❌ No MONGO_URI and mongodb-memory-server not available.\n' +
        '   Run: npm install mongodb-memory-server --prefix server\n' +
        '   Or set MONGO_URI=mongodb://localhost:27017/techsphere in server/.env'
    );
    process.exit(1);
  }
}

export async function closeDB() {
  await mongoose.disconnect();
  if (_memServer) await _memServer.stop();
}
