import { createClient } from 'redis'

const client = createClient()

client.on('connect', async () => {
    console.log("Redis client connected to the server")
    await client.subscribe('holberton school channel')
    client.on('message', async (err, msg) => {
        console.log(msg)
        if (msg === 'KILL_SERVER') {
            await client.unsubscribe();
            client.quit();
        }
    })
})
client.on('error', (err) => {
    console.log("Redis client not connected to the server:", err.toStr)
})



