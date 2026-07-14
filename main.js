import express from 'express';
import DarkWAF from './core/waf.js'

const app = express();
const port = 3000;

app.use(express.json());
app.use(DarkWAF);

app.post('/', (req, res) => {
    res.json({
        message: "OK"
    });

});

app.listen(port, () => {
    console.log(`Running at ${port}`);
});