import { createClient, print } from 'redis'

const client = createClient()

client.on('error', (err) => {
    console.log('Redis client not connected to the server:', err.toString());
});

async function storeHashValue(hashName, fieldName, fieldValue) {
    client.HSET(hashName, fieldName, fieldValue, print)
}

async function printHashEntry() {
    client.HGETALL(hashName, (err, reply) => {
        console.log(reply)
    })
}

function main() {
    const hash = {
        "Portland": 50,
        "Seattle": 80,
        "New York": 20,
        "Bogota": 20,
        "Cali": 40,
        "Paris": 2
    }

    for (const [field, value] of Object.entries(hash)) {
        storeHashValue('HolbertonSchool', field, value)
    }
    printHashEntry('HolbertonSchool')
}

client.on('connect', () => {
    console.log('Redis client connected to the server');
    main();
});