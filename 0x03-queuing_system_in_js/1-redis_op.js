import { createClient, print } from 'redis'

const client = createClient()

client.on('connect', () => {
    console.log("Redis client connected to the server")
})
client.on('error', (err) => {
    console.log("Redis client not connected to the server:", err.toStr)
})

const setNewSchool = async (schoolName, value) => {
   client.SET(schoolName, value)
}

const displaySchoolValue = async (schoolName) => {
    await client.GET(schoolName, (_err, reply) => {
        console.log(reply)
    })
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');