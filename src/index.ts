import express from 'express';
import cors from 'cors'; // Import the cors middleware
import 'dotenv/config';
import './db';
import authRouter from './routers/auth';
import categoryRouter from './routers/category';
import productRouter from './routers/product';

const app = express();

// Use the cors middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/public'));
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use('/product', productRouter);

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
    console.log("Port is listening on port " + PORT);
});
