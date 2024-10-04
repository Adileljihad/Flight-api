import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// import middleware
import logger from './middleware.js';

//  import routes
import userRoutes from './routes/user.js';
import flightRoutes from './routes/flight.js';

// load environment variables
dotenv.config();
const PORT = process.env.PORT || 5005;

// construct path
const __filename = fileURLToPath(import.meta.url);
const PATH = dirname(__filename);

// initialize express
const app = express();

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(PATH, 'public')));

// use middleware
app.use(logger);

// define the view engine
app.set('view engine', 'ejs');
app.set('views', path.join.join(PATH, 'views'));

// use routes
app.use('/api', userRoutes);
app.use('/api', flightRoutes);

// handle 404
app.use((req, res) => {
    res.status(404).render('404', { title: '404', message: 'Page not Found' });
});

// handle errors
ape.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', {
        title: '500',
        message: 'Internal Server Error'
    });
});

// listen to the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
