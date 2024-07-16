const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars').create({ extname: '.handlebars' });

const app = express();
const server = createServer(app);
const io = new Server(server);

// Configurar Handlebars
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Rutas
app.get('/', (req, res) => {
    res.render('index', { products: getProducts() });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: getProducts() });
});

// Productos simulados
let products = [];

// Función para obtener productos
const getProducts = () => products;

// Websockets
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.emit('products', getProducts());

    socket.on('newProduct', (product) => {
        products.push(product);
        io.emit('products', getProducts());
    });

    socket.on('deleteProduct', (productName) => {
        products = products.filter(product => product.name !== productName);
        io.emit('products', getProducts());
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Servidor escuchando
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
