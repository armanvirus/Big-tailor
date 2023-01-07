const bcrypt = require('bcrypt'),
      user = require('../models/user'),
      path = require('path'),
      fs= require('fs'),
      formidable = require('formidable'),
      Products = require('../models/products'),
      nodemailer = require('nodemailer');
      //passport = require('passport');


   module.exports = {

    // liking a product
    like: (req, res) =>{
        let uniqueId = req.params.uniqueId;
        var like ;

        if(req.user){
            Products.findOne({_id:uniqueId}, (err,items)=>{
                if(err) throw err;
                like = items.likes;
                if(like.indexOf(req.user._id) == -1){
                    Products.findByIdAndUpdate(uniqueId,{"$push":{"likes":req.user._id}},
                    {"new":true, "upsert":true},function(err,result){
                        if(err) throw err;
                        console.log(result.likes);
                        res.json({likes:result.likes.length, msg:false});
                    })
                }else{
                    like.splice(like.indexOf(req.user_id), 1);
                    Products.findByIdAndUpdate(uniqueId, {$set:{"likes":like}},(err, success)=>{
                        if(err) throw err;
                        console.log(success.likes.length - 1);
                        res.json({likes:success.likes.length - 1, msg:false});
                    })
                }
            })
        }else{
            res.json({likes:false, msg:'you must be loged in to be able to like this'})
        }

    },
       /*adding carts */
       addCart:(req, res)=>{

          user.updateOne({email:req.user.email}, 
            {$addToSet: {carts:req.body.id}},
            function(err,data){
                 if(err) throw err;
                 console.log(data)
                 
             });
        

       },

       forgot1:(req,res)=>{
           user.findOne({email:req.body.email}, {}, function(err, result){
               if(err){
                   console.log(err);
               }
           if(!result){
               res.send(`user with account ${req.body.email} does not exist`);
               
           }else{
               var url = `${req.protocol}://${req.get('host')}/changeP/user/${result._id}`;
               let transporter = nodemailer.createTransport({
                  service:'gmail',
                   auth:{
                       user:'abdurrahmangrema19@gmail.com',
                       pass:'malagana'
                   }
               });

               let mailOptions = {
                   from:'Bigtailor shopping mall',
                   to:result.email,
                   subject:'here your forgot password from bigtailor',
                   text:'',
                   html:`<a href=${url} class="sing-link">click here to change your password</a>`
               };

               transporter.sendMail(mailOptions, (err, info) => {
                   if(err){
                      return console.log(err);
                   }else{
                       res.send('mail was sent to you ');
                       console.log(info.response);
                   }

               });
           }
           })
           
       },

       /*change password*/
       changeP:(req,res)=>{
           if(req.body.password1 == req.body.password2 && req.password1 !=='' && req.body.password1.length >= 6){
            bcrypt.hash(req.body.password1, 10, (err, hash)=>{
                user.update({_id:req.body.id}, {$set:{password:hash}},
                    function(err, result){
                        res.redirect('/login/form');
                    })
            });
           
           }else{
               console.log(' the passwords are not matched');
           }
       },
       /*registration system*/
       signUp:(req,res)=>{


           const {email, password,name} = req.body;

           let err_msg = [];
           if(!email || !password || !name ){
               err_msg.push({msg:"please fill out the required fields"})
           }

           if(password.length < 6){
               err_msg.push({msg:"the password should be at least 6 characters long"})
           }

         user.findOne({email:req.body.email}, {},(err, found)=>{
             if(err) throw err;
             if(found){
                 err_msg.push({msg:`user with email ${found.email} do exist`})
             }

             if(err_msg.length > 0){
               console.log(err_msg)
               res.render("signUp", {err_msg})

           }else{

            bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if(err) throw err;

     const newUser = new user({
               email:req.body.email,
               password:hash,
               name:req.body.name

           });
           /*saving to the database*/
  newUser.save(function (err, person) {
     req.flash('success_msg', "you are now registered and can login");
    console.log('Successfully account was created ');
    res.redirect('/login/form');

             });

           /*end of the saving*/
           })

           }


         }
            );


   },

   upload: function (req, res, next) {

     
      var saveImage = function () {
        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
            imgUrl = '';
        for (var i = 0; i < 6; i += 1) {
            imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        /* Start new code: */
        // search for an image with the same filename by performing a find:
        Products.find({
            filename: imgUrl
        }, function (err, products) {
            if (products.length > 0) { // if a matching image was found, try again (start over):
                saveImage();
            } else {
                /* end new code:*/

                var tempPath = req.files.image.path,
                    ext = path.extname(req.files.image.name).toLowerCase(),
                    targetPath = path.resolve('./public/upload/' + imgUrl + ext);
                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                    fs.rename(tempPath, targetPath, function (err) {
                        if (err) throw err;

                        var newProduct = new Products({
                            filename: imgUrl + ext,
                            name: req.fields.name,
                            price: req.fields.price,
                            type: req.fields.type,
                            colors: req.fields.colors,
                            description: req.fields.description,
                            
                        });
                        console.log(newProduct);
                        newProduct.save((err,product)=> {
                            if(err){
                                req.flash('error_msg', "Error Has Occured Product not Deleted !")
                                res.redirect('/admin');
                            }else{

                                req.flash('success_msg', "Product Upload successful");
                               res.redirect('/admin')
                            }
                        });

                    });
                } else {
                    fs.unlink(tempPath, function () {
                        if (err) throw err;
                        res.json(500, {
                            error: 'Only image files are allowed.'
                        });
                    });
                }

            }
        }); /* End new code: */





    };

    saveImage();





           
       

}


       /*login system*/


   }


