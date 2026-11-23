import {app} from './src/api.js'
import {db} from './src/db/db.connection.js'
import {sql} from 'drizzle-orm'


const PORT = process.env.PORT || 3000;

async function startServer() {
    try{
        await db.execute(sql`SELECT 1`);
        console.log('Database connection established');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error starting server:', err);
    }
}

startServer();