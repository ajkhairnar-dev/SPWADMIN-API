const ecode = require("./error_code.json");
const {s3Fileupload,s3FilereadStaticURL} = require('../../common/s3/s3upload')
const moment = require('moment');

const getMeterial = async (req,res) => {
    try{
        const {rows} = await conn.query("select material_id,materialname,materialicon,isactive from mst_material");
        let staticFile = '/material/static.png'
        rows.forEach(obj => obj.materialicon = obj.materialicon ? s3FilereadStaticURL(obj.materialicon) : s3FilereadStaticURL(staticFile));
        if(_.isEmpty(rows)){
            return res.status(200).send({ success:true,message:"Material Not Found.",data:{material:rows}})
        }
        res.status(200).send({ success:true,message:"Material fetch successfully..",data:{material:rows}})
    }catch (error) {
        console.log(error)
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
        await s3Fileupload(obj)
        let path = obj.folderName+'/'+obj.fileName
        const {rows} = await conn.query("insert into mst_material(materialname,materialicon,isactive,createdate) values($1,$2,$3,$4) RETURNING *",[material.materialname,path,material.isactive,moment().format("YYYY-MM-DD hh:mm:ss")]);
        return res.status(400).send({ success:false,message:"Materal has been added",errorCode:"dsf", data:{} })

    }catch(error){
        console.log(error.message)
       
    }
}




module.exports = {
    getMeterial,
    addMaterial
}