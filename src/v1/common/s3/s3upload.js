const AWS = require('aws-sdk');
const config = require('../../config/config.json');
const ecode = require("./error_code.json");

AWS.config.update({
    accessKeyId: config.s3.keyid,
    secretAccessKey: config.s3.accesskey,
    region: config.s3.region 
});
const s3 = new AWS.S3({ params: {Bucket: config.s3.bucketname} });

const s3Fileupload = (obj)=>{
    const buffer = Buffer.from(obj.fileData.replace(/^data:image\/\w+;base64,/, ""),'base64');
    var s3object = {
        Key: obj.folderName+'/'+obj.fileName, 
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: obj.fileFormat   //'image/jpeg'
    };
    return new Promise((resolve,reject)=>{
        s3.putObject(s3object, function(err, data){
            if (err) { 
              reject(new Error({ success:false,message:ecode.SYSA0701.msg,errorCode:ecode.SYSA0701.code, data:{} }))
            } else {
              const final = _.omit(obj,'fileData');
              resolve(final)
            }
        });
    })
}

const s3FilereadStaticURL = (path) =>{
   return `https://${config.s3.bucketname}.s3.${config.s3.region}.amazonaws.com/${path}`   
}

const s2Filedelete = (obj) => {
    var s3object = {
        Key : obj.fileName
    }
    return new Promise((resolve,reject)=>{
        s3.deleteObject(s3object,function(err,data){
            if (err) { 
                reject(new Error({ success:false,message:ecode.SYSA0702.msg,errorCode:ecode.SYSA0702.code, data:{} }))
              } else {
                console.log(data)
                resolve(true)
              }
        })
    })
}

// const s3Fileread=(obj)=>{
//     var s3object = {
//         Key: obj.fileName, 
//     }
//     s3.getObject(s3object,function(err,data){
//         if (err) { 
//             console.log(err)
//           } else {

//             const body = Buffer.from(data.Body).toString('utf8');
//             console.log(body)
//           }
//     })
// }


module.exports = {
    s3Fileupload:s3Fileupload,
    s3FilereadStaticURL:s3FilereadStaticURL,
    s2Filedelete:s2Filedelete
}