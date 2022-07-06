const ecode = require("./error_code.json");


const getMeterial = async (req,res) => {
    try{
        const {rows} = await conn.query("select material_id,materialname,materialicon,isactive from mst_material");
        if(_.isEmpty(rows)){
            return res.status(200).send({ success:true,message:"Material Not Found.",data:{material:rows}})
        }
        res.status(200).send({ success:true,message:"Material fetch successfully..",data:{material:rows}})
    }catch (error) {
        return res.status(400).send({ success:false,message:ecode.SYSA0301.msg,errorCode:ecode.SYSA0301.code, data:{} })
    }
}

const addMaterial = async(req,res) => {
    try{
        
    }catch(error){

    }
}




module.exports = {
    getMeterial,
    addMaterial
}