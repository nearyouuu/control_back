import { DB_USER } from "../config/db.js"
import { schema_req_user } from "../model/schema_req.js"
import Ajv from "ajv"
import crypto from "crypto"

const ajv = new Ajv()

export const addUser = async(req, res) => {
    let obj = req.body
    obj.password = crypto.createHash('sha256').update(obj.password).digest('base64')
    const validate = ajv.compile(schema_req_user)
    const valid = validate(obj)
    if (!valid) {
        return res.code(205).send({'message': 'Validate error'})
    }

    await DB_USER.findOne({
        login: obj.login
    }).then(async e => {
        if (e) {
            return res.code(204).send({'message': 'User already exists'})
        }
        obj.reg = new Date()
 
        const user = new DB_USER({...obj, token: tokenGen() })
        await user.save()
        return res.send({"success": true})
    })
}

export const getUsers = async(req, res) => {
    await DB_USER.find().then(e => {
        return res.send(e)
    })
}


export const getUser = async(req, res, id) => {
    await DB_USER.findById(id).then(e => {
        delete e.refreshToken
        return res.send(e)
    })
}


export const editUser = (req, res, id) => {
    let obj = req.body
    const validate = ajv.compile(schema_req_user)
    const valid = validate(obj)
    if (!valid) {
        return res.code(205).send({'message': 'Validate error'})
    }
    if (!obj.id) {
        return res.code(205).send({'message': 'No user ID'})
    }
    DB_USER.findByIdAndUpdate(id, obj).then(e => {
        return res.send(e)
    })
}

export const deleteUser = (req, res) => {
    let obj = req.body
    DB_USER.deleteOne({_id:obj.id}).then(e => {
        return res.send(e)
    })
}
