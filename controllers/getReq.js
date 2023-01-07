
const Products = require('../models/products');
const Oders = require('../models/Oders');
const Cart = require('./cart');
module.exports = {
    main: (req,res)=>{
        Products.find({},function(err,product){
            if(err) throw err;
             res.render("Home", {product})
        })
    },

   login:(req,res)=>{
    res.render("login")
},

    signUp:(req,res)=>{
    res.render("signUp")
},

    forgot:(req,res)=>{
        res.render('forgot1');
    },

    changeP:(req,res)=>{
        var user = req.params.id;
        res.render('changeP', {id:user});

    },
    products:(req,res)=>{
    Products.find({},function(err,product){
if(err) throw err;
// res.render("products", {product})
res.send(product)
    })
    

   
},

carts:(req,res)=>{
    Oders.find({user:req.user}, (err,oders)=>{
        var cart;
        console.log(oders)
        // if(oders){
            oders.forEach(oder => {
                cart = new Cart(oder.cart);
                oder.items = cart.generateArray();
            });
        // }

        res.render('carts',{oders})
    })
    

},


singleProduct: function (req, res) {
    // var viewModel = {
    //     image: {}

    // };

    Products.find({
            filename: {
                $regex: req.params.product_id
            }
        },
        function (err, images) {
            if (err) {
                throw err;
            }
            if (images) {
                var picker= [];
                var random; 
                Products.find({}, (err, All)=>{
                    if (err) throw err;
                    if(All){
                       for(let i = 0; i < 3; i++){
                        random = Math.floor(Math.random() * All.length);
                        picker.push(All[random]);

                       }
                       
                       const image = images[0]
                                   res.render('image', {image, picked:picker});
                           

                    }
                })
                    
            } else {
                res.redirect('/');
            }
        });


}

}