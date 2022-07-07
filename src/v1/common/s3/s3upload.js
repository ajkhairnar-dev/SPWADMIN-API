const AWS = require('aws-sdk');
const { Promise } = require('q');
const config = require('../../config/config.json');

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
              reject(new Error("s3 upload error"))
            } else {
              const final = _.omit(obj,'fileData');
              resolve(final)
            }
        });
    })
}


module.exports = {
    s3Fileupload:s3Fileupload
}