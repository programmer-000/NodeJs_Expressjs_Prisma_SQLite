import express from 'express';
import cors from 'cors';
import { router } from './routes';

const PORT = process.env.PORT || '5000';

const app = express(); // Creating Express application instance

// Middleware to parse JSON bodies of incoming requests
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// Middleware to serve static files from 'src/uploads/' directory
app.use('/src/uploads/', express.static('src/uploads/'));

// Mounting router for handling API routes
app.use(router);

// Starting the server and listening on the specified port
app.listen(PORT, () => {
    console.log(`Server was started on port ${PORT}`);
});
