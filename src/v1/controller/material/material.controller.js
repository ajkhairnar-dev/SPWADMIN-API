const ecode = require("./error_code.json");
const {s3Fileupload} = require('../../common/s3/s3upload')

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
        const material = req.body
        let obj = {
            fileName:material.materialicon.fileName,
            folderName:'material',
            fileData:material.materialicon.fileData,
            fileFormat:material.materialicon.fileType
        }
        let s3res = await s3Fileupload(obj)
        const {rows} =await conn.query("insert into mst_material(materialname,materialicon,isactive) values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",[mobileno,otp,moment().format("YYYY-MM-DD hh:mm:ss"),4,'App',0,1,0,moment().format("YYYY-MM-DD hh:mm:ss")]);

        const {rows1} = await conn.query("select material_id,materialname,materialicon,isactive from mst_material");

    }catch(error){
        console.log(error.message)
       
    }
}




module.exports = {
    getMeterial,
    addMaterial
}