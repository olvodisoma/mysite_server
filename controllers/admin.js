import mysql from "mysql";
import { configDB } from "../configDB.js";
const db=mysql.createConnection(configDB)

export const books=(request,response)=>{
    db.query('SELECT * FROM books ORDER BY author',(err,result)=>{
        if(err){
            console.log('HIBA!',err)
        }
        else{
            response.send(result)
        }
    })
}