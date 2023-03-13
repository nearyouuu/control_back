import Firebird from 'node-firebird'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path: path.resolve(__dirname, '../.env')})

var options = {}

options.host = process.env.SCUD_IP
options.port = process.env.SCUD_PORT
options.database = process.env.SCUD_PATH
options.user = process.env.SCUD_LOGIN
options.password = process.env.SCUD_PASSWORD
options.lowercase_keys = false // set to true to lowercase keys


export const findInBaseByKey = async (key, callback) => {
    Firebird.attach(options, function(err, db) {
        if (err){
            db.detach()
            return callback('error')
        }

        db.query("SELECT * FROM PERSONNEL WHERE KLUCH='" + key + "'", function(err, result) {
            if (err){
                db.detach()
                return callback('error')
            }
            db.detach()
            return callback(result[0])
        })
    })
}



// function sleep(ms) {
//     return new Promise((resolve) => {
//       setTimeout(resolve, ms)
//     })
//   }

// function blobToFile(theBlob, fileName){
//     //A Blob() is almost a File() - it's just missing the two properties below which we will add
//     theBlob.lastModifiedDate = new Date()
//     theBlob.name = fileName
//     return theBlob
// }
