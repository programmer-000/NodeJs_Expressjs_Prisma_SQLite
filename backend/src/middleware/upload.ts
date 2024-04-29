import multer from 'multer';
import moment from 'moment';

/**
 *Define storage settings for multer
 */
const storage = multer.diskStorage({
    // Define destination folder for uploaded files
    destination(req, file, cb) {
        cb(null, 'src/uploads/');
    },
    // Define filename for uploaded files
    filename(req, file, cb) {
        const date = moment().format('DDMMYYYY-HHmmss');
        const filename = `${date}-${file.originalname}`;
        cb(null, filename);
    }
});

/**
 *Define file filter function for multer
 */
const fileFilter = (req: any, file: any, cb: any) => {
    // Check if the file mimetype includes 'jpeg', 'png', or 'jpg'
    if (file.mimetype.includes('jpeg') || file.mimetype.includes('png') || file.mimetype.includes('jpg')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

/**
 *Define upload limits for multer
 */
const limits = {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
};

/**
 *Create multer instance with defined settings
 */
let upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

export default upload.single('ProfilePicture');
