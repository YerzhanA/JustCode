//Создаем роуты чтобы вывзвать их из index.js
import { Router } from 'express'
import { register, login, getMe, update, remove } from '../controllers/auth.js'
import { checkAuth } from '../utils/checkAuth.js'
const router = new Router()



//Register  //https://localhost.:8000/api/auth/register
router.post('/register', register)

//Login  //https://localhost.:8000/api/auth/login
router.post('/login', login)

//Login  //https://localhost.:8000/api/auth/update
router.put('/update', update)

//Getme  //https://localhost.:8000/api/auth/me
router.get('/me', checkAuth, getMe)

// Remove // http://localhost:8000/api/auth/remove
router.delete('/remove/:id', remove)


export default router