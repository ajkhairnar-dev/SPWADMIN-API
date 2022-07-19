const {s3Fileupload,s3FilereadStaticURL,s2Filedelete} = require('../../common/s3/s3upload')
const moment = require('moment');
const { async } = require('q');


const addMaterialRate = async() =>{
    try{
        
    }catch(error){

    }
}


const getMaterialsRate = async(req,res) =>{
    try{
        const {rows} = await conn.query(`select materialrate_id,mm.materialname,mm.materialicon,mr.rate,mr.isactive, ma.accounttype, mc."name" as "cityname",ms."name" as "statename" from mst_material_rate mr
        inner join mst_material mm on mr.material_id  = mm.material_id 
        inner join mst_accounttype ma on mr.accounttype_id  = ma.accounttype_id
        inner join mst_cities mc on mr.city_id = mc.city_id 
        inner join mst_states ms on mc.state_id = ms.state_id
        where mm.isactive = $1 and ma.isactive = $2 and mm.isactive = $3`,[1,1,1]);
        let staticFile = '/material/static.png'

        rows.forEach(obj => obj.materialicon = obj.materialicon ? s3FilereadStaticURL(obj.materialicon) : s3FilereadStaticURL(staticFile));
        if(_.isEmpty(rows)){
            return res.status(200).send({ success:true,message:"Material Rate Not Found.",data:{material:rows}})
        }
        res.status(200).send({ success:true,message:"Material Rate fetch successfully..",data:{material:rows}})
    }catch (error) {
        console.log(error)
        // return res.status(400).send({ success:false,message:ecode.SYSA0301.msg,errorCode:ecode.SYSA0301.code, data:{} })
    }
}

const changeStatusMaterialRate = async(req,res) =>{
    try{
        let materialrate_id = req.body.materialrate_id
        let isactive = req.body.isactive
        console.log(materialrate_id)
        console.log(isactive)
        await conn.query(`update mst_material_rate set isactive=$1,updatedate=$2 where materialrate_id=$3`,[isactive,moment().format("YYYY-MM-DD hh:mm:ss"),materialrate_id]);
        res.status(200).send({ success:true,message:"Material Rate Status changed.",data:{}})
    }catch (error) {
        // return res.status(400).send({ success:false,message:ecode.SYSA0301.msg,errorCode:ecode.SYSA0301.code, data:{} })
    }
}



module.exports = {
    addMaterialRate,
    getMaterialsRate,
    changeStatusMaterialRate
}