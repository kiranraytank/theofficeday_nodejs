'use strict';
const express       = require('express');
const router        = express.Router();
const { pool }      = require('./../startup/db');
const bcrypt        = require('bcryptjs');
const formidable    = require('formidable');
const path          = require('path');
const fs            = require('fs');


/*** TASK 1 ***/
router.post('/signup',  async(req, res) => {
    console.log('calling signuooooo')
    try{
        var form = new formidable.IncomingForm();
        form.parse(req,async(err, fields, files) => {

            let file = files.profile_pic;
            let size = file.size;
            let filename = "";
 
            if(size != 0){
                var ext = file.originalFilename.split('.').pop();
                ext=`.${ext}`
                ext = ext.toLowerCase();
                if(ext == '.jpeg' || ext == '.png' || ext == '.jpg'){
                    let parsed = file.originalFilename.split('.');
                    let random = Math.floor(1000000000 + Math.random() * 9000000000);
                    filename = parsed[0].replace(/[^A-Za-z_ ]/g, "").trim().replace(/ /g,"_") + "_" + random + ext;
                    let new_path = path.join(__dirname, '../uploads') + '/' + filename;
                    let raw_data = fs.readFileSync(file.filepath);
                    
                    await new Promise((resolve, reject) => {
                        fs.writeFile(new_path, raw_data, function(err){
                            if(err) console.log(err)
                            resolve();
                        })
                    })
                    
                }else{
                    return res.send({
                        success: 0,
                        errorMessage: 'Please upload PNG, JPG or JPEG image only'
                    });
                }
            }

            let name        = fields.name;
            let age         = fields.age;
            let gender      = fields.gender;
            let email       = fields.email;
            const salt      = await bcrypt.genSalt(10);
            const password  = await bcrypt.hash(fields.password, salt);
            let city        = fields.city;
            let state       = fields.state;
            let hobbies     = fields.hobbies;

            if((name == '' || name == undefined || name == 'undefined') || (email == '' || email == undefined || email == 'undefined') || (password == '' || password == undefined || password == 'undefined')){
                return res.send({ success : 0, message : 'Enter user required data' });
            }
        
            pool.query("SELECT * FROM public.users WHERE email = '" + email + "'", async(se_err,se_res) => {  
                if(se_err){ 
                    console.error(se_err.message); 
                }else{
                    // console.log({name,age,gender,email,password,city,state,hobbies,filename})
                    if(se_res.rows.length == 0) {
                        let ins_query = `INSERT INTO users (name,age,gender,email,password,city,state,hobbies,profile_pic) values($1,$2,$3,$4,$5,$6,$7,$8,$9)`
                        pool.query(ins_query, [name,age,gender,email,password,city,state,hobbies,filename], (error,result) => {
                            if(error){
                                console.error('Insert time error: ' + error.message);
                                return res.send({ success : 0, message : 'Something want wrong' });
                            }else{
                                console.log('Users data insert successfully.');
                                return res.send({ success : 1, message : 'Users data insert successfully.' });
                            }
                        })  
                    }else{
                        return res.send({ success: 0, errorMessage: "Account already exist" });
                    }
                }
            })
        });
    }catch(error){
        console.log('Somthing want wrong catch time error: ' + error.message);
        return res.send({ success : 0, message : 'Somthing want wrong' });
    }

})


/*** TASK 2 ***/
router.post('/signin',  async(req, res) => {
    try{
        if(req.body != undefined){
            let email    = req.body.email;
            let password = req.body.password;
            pool.query(`SELECT id, password, email, name from public.users WHERE email='${email.toLowerCase()}'`, async (error, result) => {
                if(error){
                    console.error("Sign In : ");
                    console.error(error);
                }else{
                    if(result.rows.length > 0){
                        const valid = await bcrypt.compare(password, result.rows[0].password);
                        if(!valid) {
                            return res.send({
                                success: 0,
                                errorMessage: "Password is wrong"
                            });
                        }

                        return res.send({
                            success : 1,
                            message    : 'User signin proper'
                        });
    
                    }else{
                        return res.send({
                            success: 0,
                            errorMessage: "Email or Password is wrong"
                        });
                    } 
                }
            })

        }else{
            console.log('Set user detail for login');
            return res.send({ success : 0, message : 'Set user detail for login'});
        }
    }catch(error){
        console.log('Somthing want wrong catch time error login: ' + error.message);
        return res.send({ success : 0, message : 'Somthing want wrong'});
    }
})


/*** TASK 4 ***/
router.post('/update_users_detail',  async(req, res) => {
    try{
        var form = new formidable.IncomingForm();
        form.parse(req,async(err, fields, files) => {

            let file = files.profile_pic;
            let size = file.size;
            let filename = "";
            if(size != 0){
                var ext = file.originalFilename.split('.').pop();
                ext=`.${ext}`
                ext = ext.toLowerCase();
                if(ext == '.jpeg' || ext == '.png' || ext == '.jpg'){
                    let parsed = file.originalFilename.split('.');
                    let random = Math.floor(1000000000 + Math.random() * 9000000000);
                    filename = parsed[0].replace(/[^A-Za-z_ ]/g, "").trim().replace(/ /g,"_") + "_" + random + ext;
                    let new_path = path.join(__dirname, '../uploads') + '/' + filename;
                    let raw_data = fs.readFileSync(file.filepath);
                    
                    await new Promise((resolve, reject) => {
                        fs.writeFile(new_path, raw_data, function(err){
                            if(err) console.log(err)
                            resolve();
                        })
                    })
                    
                }else{
                    return res.send({
                        success: 0,
                        errorMessage: 'Please upload PNG, JPG or JPEG image only'
                    });
                }
            }

            let name        = fields.name;
            let age         = fields.age;
            let gender      = fields.gender;
            let email       = fields.email;
            let city        = fields.city;
            let state       = fields.state;
            let hobbies     = fields.hobbies;

            pool.query(`SELECT id, email, profile_pic from public.users WHERE email='${email.toLowerCase()}'`, async (error, result) => {
                if(error){
                    console.error("Sign In : ");
                    console.error(error);
                }else{
                    if(result.rows.length > 0){
                        let user_id = result.rows[0]['id'];
                        if(name != undefined && name != ''){
                            pool.query(`UPDATE public.users SET name = '${name}' WHERE id = ${user_id}`);
                        }if(age != undefined && age != ''){
                            pool.query(`UPDATE public.users SET age = '${age}' WHERE id = ${user_id}`);
                        }if(gender != undefined && gender != ''){
                            pool.query(`UPDATE public.users SET name = '${name}' WHERE id = ${user_id}`);
                        }if(city != undefined && city != ''){
                            pool.query(`UPDATE public.users SET city = '${city}' WHERE id = ${user_id}`);
                        }if(state != undefined && state != ''){
                            pool.query(`UPDATE public.users SET name = '${name}' WHERE id = ${user_id}`);
                        }if(hobbies != undefined && hobbies != ''){
                            pool.query(`UPDATE public.users SET name = '${name}' WHERE id = ${user_id}`);
                        }if(filename != ""){
                            fs.unlinkSync(path.join(__dirname, '../uploads') + '/' + result.rows[0].profile_pic);
                            pool.query(`UPDATE public.users SET profile_pic = '${filename}' WHERE id = ${user_id}`);
                        }
                        return res.send({
                            success : 1,
                            message    : 'User update success'
                        });
                    }else{
                        return res.send({
                            success: 0,
                            errorMessage: "User not found"
                        });
                    } 
                }
            })                
        });
    }catch(error){
        console.log('Somthing want wrong catch time error login: ' + error.message);
        return res.send({ success : 0, message : 'Somthing want wrong'});
    }
})


/*** TASK 6 ***/
router.post('/get_all_users_data',  async(req, res) => {
    try{
        pool.query(`SELECT name, age, gender, email, password, city, state, hobbies, profile_pic from public.users`, async (error, result) => {
            if(error){
                console.error("Sign In : ");
                console.error(error);
            }else{
                if(result.rows.length > 0){
                    return res.send({ success : 1, total_users : result.rowCount, users_list : result.rows });
                }else{
                    return res.send({ success : 0, message : 'No recode found' });
                }
            }
        })
    }catch(error){
        console.log('Somthing want wrong catch time gte_all_users_data error: ' + error.message);
        return res.send({ success : 0, message : 'Somthing want wrong'});
    }
})

module.exports = router;