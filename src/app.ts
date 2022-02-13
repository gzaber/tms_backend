import express from 'express';
import cors from 'cors';
import CompositionRoot from './composition.root';
import config from './config/config';

CompositionRoot.configure();

const app = express();

// view engine
app.set('view engine', 'ejs');

// parse the request
app.use(express.json());
app.use(express.urlencoded());
// manage cors
app.use(cors({ origin: '*', methods: 'GET, POST, PUT, DELETE' }));

// routes
app.use('/auth', CompositionRoot.authRouter());
app.use('/task', CompositionRoot.taskRouter());

// start server
app.listen(config.server.port, () =>
    console.log(`host: ${config.server.host}, listening on port: ${config.server.port}`)
);
