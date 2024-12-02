import { createClient } from 'redis'
import { promisify } from 'util'
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
    console.log(await promisify(client.GET).bind(client)(schoolName))
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');