import multer from 'multer'
import { __dirname } from '../utils/utils.js'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname === 'profile'){
            cb(null, __dirname+'/public/img/profiles')
        }
        if(file.fieldname === 'product'){
            cb(null, __dirname+'/public/img/products')
        }
        if(file.fieldname === 'identification' || file.fieldname === 'address' || file.fieldname === 'account'){
            cb(null, __dirname+'/public/img/documents')
        }
    },
    filename: function (req, file, cb) {
        if(file.fieldname === 'profile' || file.fieldname === 'product'){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9 )+ '.jpg'
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }else{
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9 )+ '.pdf'
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
    }
})

export const upload = multer({storage})

