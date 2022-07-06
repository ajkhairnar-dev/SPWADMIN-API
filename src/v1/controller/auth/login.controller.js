const {generateAccessToken} = require('../../common/jsonwebtoken');
const bcrypt = require('bcryptjs');
const ecode = require("./error_code.json");

const login = async (req,res) => {
    const { emailid,password } = req.body;
    try{
        const {rows} = await conn.query("select user_id,firstname,lastname,emailid,password,isactive,isblock,isverified from mst_users where emailid=$1",[emailid]);
        if(_.isEmpty(rows)){
            return res.status(400).send({ success:false,message:ecode.SYSA0104.msg,errorCode:ecode.SYSA0104.code, data:{} })
        }
        //password verify
        const bpass = await bcrypt.compare(password,rows[0].password);
        if(!bpass){ 
            return res.status(400).send({ success:false,message:ecode.SYSA0105.msg,errorCode:ecode.SYSA0105.code, data:{} })
        }
        //check Conditions - isactive, isblock, isverify
        const isWrong= checkConditions(rows);
        if(isWrong){ return res.status(400).send(isWrong) }

        const data = _.omit(rows[0],'password','isactive','isblock','isverified');
        //generate jwt token
        const token = await generateAccessToken(data);
        res.status(200).send({ success:true,message:"Login successfully.", data:{user:data,token:token} })
    }catch (error) {
        return res.status(400).send({success:false, data:{ error:error } })
    }
}

const checkConditions = (rows) => {
    if(rows[0].isblock == 1){ //isblock
        return { success:false,message:ecode.SYSA0101.msg,errorCode:ecode.SYSA0101.code, data:{} }
    }else if(rows[0].isactive == 0){ //isactive
        return { success:false,message:ecode.SYSA0103.msg,errorCode:ecode.SYSA0103.code, data:{} }
    }else if(rows[0].isverified == 0){ //isverify
        return { success:false,message:ecode.SYSA0102.msg,errorCode:ecode.SYSA0102.code, data:{} }
    }
}

module.exports = {
    login
}