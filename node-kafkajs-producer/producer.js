const tracer = require('dd-trace').init();

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-producer',
    brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

const run = async () => {
    await producer.connect();
    console.log('Producer connected');

    setInterval(async () => {
        try {
            const message = `Hello Kafka ${new Date().toISOString()}`;
            await producer.send({
                topic: 'test',
                messages: [{ value: message }],
            });
            console.log('Message sent:', message);
        } catch (err) {
            console.error('Producer error:', err);
        }
    }, 5000);
};

run().catch(console.error);
