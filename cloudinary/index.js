const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.Cloud_name,
    api_key:process.env.API_Key,
    api_secret:process.env.API_Secret
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"YelpCamp",
        allowedFormats:["jpeg" , "png" , "jpg"]
    }
})

module.exports = {
    cloudinary,
    storage
}