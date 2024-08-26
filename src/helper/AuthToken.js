const jwt=require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config({
    path: './config.env'
});
exports.EncodeToken=(email,user_id)=>{
    let KEY= process.env.SECRET_KEY;
    let EXPIRE={expiresIn: '24h'}
    let PAYLOAD={email:email,user_id:user_id}
    return jwt.sign(PAYLOAD,KEY,EXPIRE)
}

exports.DecodeToken = (token) => {
    try {
        const KEY = process.env.SECRET_KEY;
        return jwt.verify(token, KEY);
    } catch (e) {
        return null;
    }
};