const mongoose = require('mongoose');

// Try different common database names
const dbNames = [
  'businesshub',
  'khata_system', 
  'business_hub',
  'inventory_system',
  'test',
  'development'
];

async function checkDatabase(dbName) {
  try {
    console.log(`\n=== Checking database: ${dbName} ===`);
    
    // Connect to the database
    const connection = mongoose.createConnection(`mongodb://localhost:27017/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Define schemas
    const clientSchema = new mongoose.Schema({
      name: String,
      userId: mongoose.Schema.Types.ObjectId,
      phone: String,
      address: String,
      contact: {
        phone: String,
        address: String
      }
    });

    const vendorSchema = new mongoose.Schema({
      name: String,
      userId: mongoose.Schema.Types.ObjectId,
      phone: String,
      address: String,
      contact: {
        phone: String,
        address: String
      }
    });

    const Client = connection.model('Client', clientSchema);
    const Vendor = connection.model('Vendor', vendorSchema);

    // Check clients
    const allClients = await Client.find({});
    console.log(`Total clients: ${allClients.length}`);
    
    if (allClients.length > 0) {
      console.log('Client details:');
      allClients.forEach((client, index) => {
        console.log(`${index + 1}. Name: ${client.name}, UserID: ${client.userId}`);
      });
    }

    // Check vendors
    const allVendors = await Vendor.find({});
    console.log(`Total vendors: ${allVendors.length}`);
    
    if (allVendors.length > 0) {
      console.log('Vendor details:');
      allVendors.forEach((vendor, index) => {
        console.log(`${index + 1}. Name: ${vendor.name}, UserID: ${vendor.userId}`);
      });
    }

    // Check with demo token user ID
    const demoUserId = '507f1f77bcf86cd799439011';
    const demoUserClients = await Client.find({ userId: demoUserId });
    const demoUserVendors = await Vendor.find({ userId: demoUserId });
    
    console.log(`\nClients for demo user (${demoUserId}): ${demoUserClients.length}`);
    console.log(`Vendors for demo user (${demoUserId}): ${demoUserVendors.length}`);

    await connection.close();
    
    if (allClients.length > 0 || allVendors.length > 0) {
      return { dbName, clients: allClients.length, vendors: allVendors.length };
    }
    
  } catch (error) {
    console.log(`Error with ${dbName}: ${error.message}`);
  }
  return null;
}

async function checkAllDatabases() {
  console.log('Checking all possible databases for clients and vendors...\n');
  
  const results = [];
  for (const dbName of dbNames) {
    const result = await checkDatabase(dbName);
    if (result) {
      results.push(result);
    }
  }
  
  console.log('\n=== SUMMARY ===');
  if (results.length > 0) {
    results.forEach(result => {
      console.log(`Database: ${result.dbName} - Clients: ${result.clients}, Vendors: ${result.vendors}`);
    });
  } else {
    console.log('No clients or vendors found in any database');
  }
  
  mongoose.disconnect();
}

checkAllDatabases();
