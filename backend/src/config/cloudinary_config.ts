import { v2 as cloudinary } from 'cloudinary';
import { cldnApiKey, cldnApiSecret, cldnCloudName } from './constants_config.js';

cloudinary.config({
    cloud_name: cldnCloudName,
    api_key: cldnApiKey,
    api_secret: cldnApiSecret,
    secure: true
})

export default cloudinary