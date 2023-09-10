import jwt from 'jsonwebtoken'

//проверка токена
export const checkAuth = (req, res, next) => {
    //удалеям Bearer получаем читсый  токен 
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    if (token) {
        try {
            // проверяем verify
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //записываем его в req.userId чтобы с ним дальше работать в getMe()
            req.userId = decoded.id
            //Переходим к след функции getMe() - > next()
            next()
        } catch (error) {
            return res.json({
                maessage: 'Нет достпуа'
            })
        }
    } else {
        return res.json({
            maessage: 'Нет достпуа'
        })
    }

}