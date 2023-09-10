import mongoose from 'mongoose'

const UserShema = new mongoose.Schema(
    {
        username: {
            type: String,
            // обязательный
            required: true,
            // уникальный
            unique: true,
        },
        email: {
            type: String,
            // validate: {
            //     validator: (value) => {
            //         console.log("email work ", value);
            //         value.split('').includes('@')
            //     },
            //     message: props => `${props.value} is not consider a @`
            // }
        },
        password: {
            type: String,
            minLength: 8,
            required: true,
        },
        phone: {
            type: String,
            // minLength: 10,
            // validate: {
            //     validator: (value) => { value.split('').includes('@') },
            //     message: props => `${props.value} is not consider a @`
            // }
        },
    },
    { timestamps: true },
)

export default mongoose.model('User', UserShema)