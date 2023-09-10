//Наш главный входной файл
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors'
//routes
import authRouter from './routes/auth.js'




const app = express();
dotenv.config()

//Consts
const PORT = process.env.PORT || 8001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

//Middleware
app.use(cors())
app.use(express.json())

//Routes
app.use('/api/auth', authRouter)



//Запуск Сервера после подключения  к БД
async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.38wsx0v.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
        )
        app.listen(PORT, () => console.log(`Server startet on port ${PORT}`));

    } catch (error) {
        console.log(error)
    }
}

start()

