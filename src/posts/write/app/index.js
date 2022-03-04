const app = require("express")();

// constants
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, HOST);
