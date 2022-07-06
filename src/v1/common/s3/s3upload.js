const AWS = require('aws-sdk');
const config = require('../../config/config.json');

const s3Fileupload = async(obj)=>{
    const buffer = Buffer.from(obj.fileData.replace(/^data:image\/\w+;base64,/, ""),'base64');
    var s3object = {
        Key: obj.folder+'/'+obj.filename, 
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: fileFormat   //'image/jpeg'
    };

    AWS.config.update({
        accessKeyId: config.s3.keyid,
        secretAccessKey: config.s3.accesskey,
        region: config.s3.region 
    });
    const s3 = new AWS.S3({ params: {Bucket: config.s3.bucketname} });

    await s3.putObject(s3object, function(err, data){
        if (err) { 
          console.log(err);
        } else {
          res.json({path:"https://s3.amazonaws.com/<S3 Bucket Name>/"+name});
        }
    });
}


module.exports = {
    s3Fileuplod
}