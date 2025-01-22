const tracer = require('dd-trace').init();

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-consumer',
    brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'test', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log('Received message:', {
                topic,
                partition,
                value: message.value.toString(),
            });
        },
    });
};

run().catch(console.error);
