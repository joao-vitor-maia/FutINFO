const multer = require("multer");
const path = require("path");

module.exports = {
    dest: path.resolve(__dirname, ".." , "uploads"),
    storage: multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,path.resolve(__dirname, ".." , "uploads"))
        },
        filename: (req,file,cb) => {
            cb(null,`${Date.now()}-${file.originalname}`)
        }
    }),
    fileFilter: (req,file,cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png"
        ];

        if(allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }else{
            req.fileType = "invalid";
            cb(null,true);
        };
    }
}