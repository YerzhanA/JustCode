import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Изменение пользователя
export const update = async (req, res) => {
    try {
        const { _id, username, password, email, phone } = req.body;
        console.log(req.body);
        // Проверяем, есть ли пользователь с таким username
        const existingUser = await User.findById({ _id });
        if (!existingUser) {
            return res.json({
                message: 'Пользователь с данным username не существует!',
            });
        }

        // Если передан новый пароль, хэшируем его
        let hashedPassword = existingUser.password;
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            hashedPassword = bcrypt.hashSync(password, salt);
        }

        // Обновляем данные пользователя
        const updatedUser = await User.findOneAndUpdate(
            { username },
            {
                $set: {
                    email: email || existingUser.email,
                    password: hashedPassword,
                    phone: phone || existingUser.phone,
                },
            },
            { new: true } // Возвращать обновленный документ
        );

        // Если пользователь был успешно обновлен, отправляем ответ
        if (updatedUser) {
            return res.json({
                user: updatedUser,
                message: 'Данные пользователя успешно обновлены!',
            });
        } else {
            return res.json({
                message: 'Не удалось обновить данные пользователя.',
            });
        }
    } catch (error) {
        console.error(error);
        res.json({ message: 'Ошибка при обновлении пользователя' });
    }
};

//Регистрация пользователя
export const register = async (req, res) => {
    try {
        //получаем данные с клиента
        const { username, password, email, phone } = req.body
        //ищем пользователя в БД по имени

        const isUsed = await User.findOne({ username })
        //ПРоверяем если есть такой пользователь, так как имя пользователя уникально
        if (isUsed) {
            return res.json({ message: 'Данный username уже занят!' });
        }
        //Создаем пользователя с хэшированным пароллем
        //Для шифрования пароля hash password
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User(
            {
                username: username,
                email: email,
                password: hash,
                phone: phone
            }
        )
        // console.log(newUser);
        //устанавливаем токен 
        const token = jwt.sign({
            id: newUser._id,
        }, process.env.JWT_SECRET,
            { expiresIn: '30d' },
            // { expiresIn: '1h' },
        )

        //Сохрянем в БД
        const user = await newUser.save()

        //Отправляем ответ из Сервера на КЛиент 
        res.json({
            token,
            user,
            message: 'Регистрация прошла успешно!',
        })

    } catch (error) {
        res.json({ message: 'Ошибка при создании пользователя' })
    }
}


//ЛОГИН пользователя
export const login = async (req, res) => {
    try {
        //получаем данные с клиента
        const { username, password } = req.body

        const productId = req.params.id;
        console.log(req.body);
        //ищем login в БД 
        const user = await User.findOne({ username })
        console.log(user);
        //ПРоверяем если есть такой пользователь, так как имя пользователя уникально
        if (!user) {
            return res.json(
                {
                    message: 'Данный username не существует!'
                });
        }
        //Расшифровываем праоль
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.json(
                {
                    message: 'Неверный пароль!'
                });
        }
        //устанавливаем токен https://jwt.io/#debugger-io
        const token = jwt.sign({
            id: user.id,
        }, process.env.JWT_SECRET,
            { expiresIn: '30d' },
            // { expiresIn: '1h' },
        )
        //Отправляем ответ из Сервера на КЛиент 
        res.json({
            token,
            user,
            message: 'Вы вошли в систему!',
        })


    } catch (error) {
        res.json({ message: 'Ошибка при авторизации пользователя' })
    }
}


//Get me для постоянного входа при перезагрузке страницы
export const getMe = async (req, res) => {
    try {
        //работаем дальше после next() с req.userId
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json(
                {
                    message: 'Данный username не существует!'
                });
        }
        //устанавливаем токен 
        const token = jwt.sign({
            id: user.id,
        }, process.env.JWT_SECRET,
            { expiresIn: '30d' },
            // { expiresIn: '1h' },
        )
        //Отправляем ответ из Сервера на КЛиент 
        res.json({
            token,
            user,
            // message: 'Вы вошли в систему!',
        })
    } catch (error) {
        res.json({ message: 'Нет доступа' })
    }
}

// Remove 
export const remove = async (req, res) => {

    try {
        const userId = req.params.id;
        console.log(userId);
        // Проверяем, существует ли пользователь с указанным ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        console.log(user);
        // Удаляем пользователя из базы данных
        await User.findByIdAndDelete(userId);

        return res.json({ message: 'Пользователь успешно удален' });
    } catch (error) {
        console.error("removeUser", error);
        res.status(500).json({ message: 'Ошибка при удалении пользователя' });
    }
}
