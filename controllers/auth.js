import mysql from 'mysql';
import bcrypt from 'bcryptjs';
import { configDB } from '../configDB.js';
import { upload } from '../cloudinary.js';

const db = mysql.createConnection(configDB)

//IDEIGLENES LOGIN:
/*export const login=(request,response)=>{
    console.log(request.body)
    const {username,password} = request.body
    db.query('SELECT count(*) nr FROM users WHERE username=? and password=?',[username,password],(error,result)=>{
        if(error){
            console.log("Hiba",error)
        }
        else{
            response.send({rowCount:result[0].nr,username:username})
        }
    })
}*/

export const login=(request,response)=>{
    console.log(request.body)
    const {username,password} = request.body
    db.query('SELECT id,password FROM users WHERE username=?',[username],(error,result)=>{
        if(error){
            console.log("Hiba",error)
        }
        else{
            //console.log(result[0].password)
            bcrypt.compare(password,result[0].password,(error,resultCompare)=>{
                if(error){
                    response.send({error:"Hibás jelszó!"})
                }
                else{
                    response.send({username:username,userId:result[0].id})
                }
            })
        }
    })
}

export const checkEmail=(request,response)=>{
    console.log(request.body)
    const {email} = request.body
    db.query('SELECT count(*) nr FROM users WHERE email=?',[email],(error,result)=>{
        if(error){
            console.log("Hiba",error)
        }
        else{
            response.send({rowCount:result[0].nr,email:email})
        }
    })
}

export const checkUsername=(request,response)=>{
    console.log(request.body)
    const {username} = request.body
    db.query('SELECT count(*) nr FROM users WHERE username=?',[username],(error,result)=>{
        if(error){
            console.log("Hiba",error)
        }
        else{
            response.send({rowCount:result[0].nr,username:username})
        }
    })
}

const saltRound=10
export const register=(request,response)=>{
    const {username,email,password} = request.body
    bcrypt.hash(password,saltRound,(error,hashedPassword)=>{
        if(error){
            console.log("bcrypt hiba: ",error)
        }
        else{
        db.query('INSERT INTO users (username,email,password) VALUES (?,?,?)',[username,email,hashedPassword],(error,result)=>{
            if(error){
                console.log("Hiba az insertnél!",error)
                response.send({msg:"Sikertelen regisztráció!"})
            }
            else{
                response.send({msg:"Sikeres regisztráció!",id:result.insertId})
            }
        })
    }
    })

}

export const updateAvatar=async(request,response)=>{
    const [username] = request.body
    if(request.files){
        const {selFile} = request.files
        const cloudFile = await upload(selFile.tempFilePath)
        console.log(cloudFile)
        db.query('update users set avatar=?,avatar_id=? where username=?',[cloudFile.url,cloudFile.public_id,username],(error,result)=>{
            if(error){
                console.log(error)
            }
            else{
                response.send({msg:"Sikeres módosítás!",avatar:cloudFile.url})
            }
        })
    }
}