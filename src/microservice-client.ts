const { ClientProxyFactory, Transport } = require('@nestjs/microservices');

async function testMicroservice() {
  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: { port: 3001 },
  });

  try {
    await client.connect();
    console.log('Connected to microservice');

    // Test getting all products
    const products = await client.send({ cmd: 'get_products' }, {}).toPromise();
    console.log('Products via microservice:', products);

    await client.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testMicroservice();
