const ecode = require("./error_code.json");
const {s3Fileupload,s3FilereadStaticURL,s2Filedelete} = require('../../common/s3/s3upload')
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
        return res.status(400).send({ success:false,message:ecode.SYSA0301.msg,errorCode:ecode.SYSA0301.code, data:{} })
    }
}

const addMaterial = async(req,res) => {    
    try{
        const material = req.body
        const {rows} = await conn.query("select count(*) as count from mst_material where materialslug=$1",[material.materialname.toLowerCase()]);
        
        if(rows[0].count == '1'){
             return res.status(400).send({ success:false,message:ecode.SYSA0302.msg,errorCode:ecode.SYSA0302.code, data:{} })
        }
     
        let obj = {
            fileName:generateName(material.materialicon.fileExtension),
            folderName:'material',
            fileData:material.materialicon.fileData,
            fileFormat:material.materialicon.fileType
        }
        await s3Fileupload(obj)
        let path = obj.folderName+'/'+obj.fileName
        await conn.query("insert into mst_material(materialname,materialicon,isactive,createdate,materialslug) values($1,$2,$3,$4,$5) RETURNING *",[material.materialname,path,material.isactive,moment().format("YYYY-MM-DD hh:mm:ss"),material.materialname.toLowerCase()]);
        return res.status(200).send({ success:true,message:"Material has been added",data:{} })
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.SYSA0301.msg,errorCode:ecode.SYSA0301.code, data:{} })
    }
}

const editMaterial = async(req,res) => {
    try{
        const material = req.body
        //check material name is already exist
       // const isExist = await conn.query("select count(*) as count from mst_material where materialslug=$1",[material.materialname.toLowerCase()]);
        // if(isExist.rows[0].count == '1'){
        //      return res.status(400).send({ success:false,message:ecode.SYSA0302.msg,errorCode:ecode.SYSA0302.code, data:{} })
        // }
        const {rows} = await conn.query("select * from mst_material where material_id=$1",[material.materialid]);
        let obj={}
        let path = rows[0].materialicon
        if(_.isEmpty(rows)){
            return res.status(400).send({ success:false,message:ecode.SYSA0303.msg,errorCode:ecode.SYSA0303.code, data:{} })
        }
        //material object not empty then delete existing img on s3 and update new img on s3
        if(!_.isEmpty(material.materialicon.fileData)){
            await s2Filedelete({fileName:rows[0].materialicon})
            obj = {
                fileName:generateName(material.materialicon.fileExtension),
                folderName:'material',
                fileData:material.materialicon.fileData,
                fileFormat:material.materialicon.fileType
            }
            await s3Fileupload(obj)
            path = obj.folderName+'/'+obj.fileName
        }

        await conn.query("update mst_material set materialname=$1, materialicon=$2, isactive=$3,updatedate=$4,materialslug=$5 where material_id=$6",
        [material.materialname,path,material.isactive,moment().format("YYYY-MM-DD hh:mm:ss"),material.materialname.toLowerCase(),material.materialid]);

        return res.status(200).send({ success:true,message:"Material has been updated",data:{} })
        
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.SYSA0301.msg,errorCode:ecode.SYSA0301.code, data:{} })
    }
}

const deleteMaterial = async(req,res) =>{
    try{
        const {rows} = await conn.query("select * from mst_material where material_id=$1",[req.body.materialid]);
        if(_.isEmpty(rows)){
            return res.status(400).send({ success:false,message:ecode.SYSA0303.msg,errorCode:ecode.SYSA0303.code, data:{} })
        }
        //delete file on s3 
        await s2Filedelete({fileName:rows[0].materialicon})
        await conn.query("delete from mst_material where material_id=$1",[req.body.materialid]);
        return res.status(200).send({ success:true,message:"Material has been deleted.",data:{} })
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.SYSA0301.msg,errorCode:ecode.SYSA0301.code, data:{} })
    }
}

const changeMaterialStatus = async(req,res) =>{
    try{
        const status = req.body.isactive ? 1 : 0;
        const {rows} = await conn.query("update mst_material set isactive=$1, updatedate=$2 where material_id=$3",
        [status, moment().format("YYYY-MM-DD hh:mm:ss"),req.body.materialid]);
        return res.status(200).send({ success:true,message:"Material status has been updated.",data:{} })
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.SYSA0301.msg,errorCode:ecode.SYSA0301.code, data:{} })
    }
}


let generateName = function (fileExtension) {
    let text = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    // File_02Feb2017_105115180_0bc0984c71784fc78a26ba2ab278f5ab.png
    for (let i = 0; i < 30; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    let fileName = 'FileMaterial' + '_' + moment(new Date()).format('DDMMMYYYY') + '_' + Date.now() + '_' + text + '.' + fileExtension
    return fileName
  }



module.exports = {
    getMeterial,
    addMaterial,
    deleteMaterial,
    changeMaterialStatus,
    editMaterial
}