import express from 'express';
import cors from 'cors'; // Import the cors middleware
import 'dotenv/config';
import './db';
import authRouter from './routers/auth';
import categoryRouter from './routers/category';
import productRouter from './routers/product';
import orderRouter from './routers/order';

const app = express();

// Use the cors middleware with options to allow requests from your local origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/public'));
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use('/product', productRouter); 
app.use('/order', orderRouter);

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
    console.log("Port is listening on port " + PORT);
});