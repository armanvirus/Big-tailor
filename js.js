const express = require('express'),
      app = express(),
      hbs = require('handlebars'),
      jwt = require('jsonwebtoken'),
      bodyParser = require('body-parser'),
      exphbs = require('express-handlebars'),
      path = require('path'),
      mongoose = require('mongoose'),
      morgan = require('morgan'),
      fs = require('fs'),
      getReq = require('./controllers/getReq'),
      postReq = require('./controllers/postReq'),
      nodemailer = require('nodemailer'),
      uri = "mongodb://127.0.0.1:27017/User";
      const  session = require('express-session'),
            Cart = require('./controllers/cart'),
            flash = require('connect-flash'),
            formidable = require('express-formidable'),
            passport = require('passport'),
            mongoStore = require('connect-mongo')(session),
            Product = require('./models/products'),
            contact = require('./models/contact'),
            stripe = require('stripe')('sk_test_51HirQGDaw0JmpBru6y2PWbLADhM6WsIHDefuac8JyMkjvz6voCf4Hf4mXPzKrMbR7Hz7tRBeowFDQBK5CWJXgdcX00NrNmcEh6');
            ;
            const {forwardAuthenticated,ensureAuthenticated} = require('./config/auth');
            const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
            const Oder = require('./models/Oders');
            console.log()

require('dotenv').config()
/*connecting the mongoose*/
console.log(process.env.MONGOURI)
mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true,useUnifiedTopology: true  })
.then( console.log("mongoose is connected"));
//console.log(exphbs)

const upload = formidable({  encoding:"utf-8",
multiples:true,
keepExtensions:true,
dest: path.join(__dirname, '/public/upload/') });
/*passport config*/

require('./config/passport')(passport);

/*set static dir*/
app.use('/public/', express.static(path.join(__dirname, '/public')));
/*setting handlebars*/
app.set('views', path.join(__dirname,"/views"));

        /*body parser*/
app.use(express.json());
app.use(express.urlencoded({extended: false}));
/*session middleware*/

app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie:{maxAge: 180 * 60 * 1000}
}));

app.use(passport.initialize());
app.use(passport.session());

/*connect plash*/
app.use(flash());

/*global variables*/

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg'),
    res.locals.error= req.flash('error' );
    res.locals.session = req.session
  next()
})

 app.engine('handlebars', exphbs.create({
      handlebars: allowInsecurePrototypeAccess(hbs),
        defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials'],
//        helpers:{
//            typeCheck: function(err_msg){
//                if(ty)
//            }
//        }
    }).engine);
    app.set('view engine', 'handlebars');

app.use(morgan('dev'));

app.get("/", (req,res)=>{ res.send("<h1> hello am here watching you</h1>")})
//app.get('/', getReq.main)


app.get('/login/form', forwardAuthenticated, getReq.login)

app.post('/login', (req, res, next) => {
      passport.authenticate('local', {
          successRedirect: req.session.oldUrl ? req.session.oldUrl: '/carts',
          failureRedirect: '/login/form',
          failureFlash: true
      })(req, res, next);
      req.session.oldUrl = null;
  });

  app.get('/user/forgot1', getReq.forgot);
  app.post('/user/forgot-pass-1', postReq.forgot1);
  app.get('/changeP/user/:id', getReq.changeP);
  app.post('/user/changeP', postReq.changeP)
  app.post('/images/like/:uniqueId',postReq.like);
  app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

app.get('/singUp/form', forwardAuthenticated, getReq.signUp)

app.get('/products', getReq.products)

app.get('/images/:product_id', getReq.singleProduct)

app.get('/about', (req,res)=>{
    res.render('about');
})

/*form handling*/
app.post('/signuP/post', postReq.signUp)
/*admin*/
app.get('/admin', ensureAuthenticated,  (req,res)=>{

    if(req.user.rank == 'admin'){

        Product.find({}, function(err, products){
            res.render('admin', {products:products});
        })
        
    }else{
        res.redirect('/carts')
    }   

});

app.get('/admin/orders-view', ensureAuthenticated,  (req,res)=>{

    if(req.user.rank == 'admin'){

        Oder.find({}, function(err, oders){
            res.render('admin-oders', {oders:oders});
        })
        
    }else{
        res.redirect('/carts')
    }   

});

app.get('/admin/remove/:id', ensureAuthenticated,  (req,res)=>{

    if(req.user.rank == 'admin'){

     const id = req.params.id;

     Product.findOne({_id:id},(err,r)=>{
         fs.unlink(path.join(__dirname, `/public/upload/${r.filename}`), (erra, s)=>{
             if(erra){
                 console.log(erra)
                 req.flash('error_msg', "Error Has Occured Product not Deleted !")
                 res.redirect("/admin")
             }else{
                Product.remove({_id:id}, (err,rs)=>{
                    console.log(err)
                    req.flash('success_msg', "Product has Deleted !");
                    res.redirect('/admin')
                 });
             }
         })
     })
        
    }else{
        res.redirect('/carts')
    }   

});

app.get('/admin/remove/oder/:id', ensureAuthenticated,(req,res)=>{

    if(req.user.rank == 'admin'){
     const id = req.params.id;
        Oder.remove({_id:id}, function(err, oders){
            if(err){
                req.flash('error_msg', "Error Has Occured Order not Deleted !")
            }else{
                req.flash('success_msg', "Order has Deleted !");
                res.redirect('/admin/orders-view')
            }
        })
        
    }else{
        res.redirect('/carts')
    }

});

app.get('/stats', ensureAuthenticated,  (req,res)=>{

    if(req.user.rank == 'admin'){

        contact.find({}, function(err, contacts){
            res.render('statistic', {contacts:contacts});
        })
        
    }else{
        res.redirect('/carts')
    }   

});

app.post('/admin', ensureAuthenticated, upload , postReq.upload)
app.get('/carts', getReq.carts)
app.get('/carts/:id', (req, res, next)=>{
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function(err, doc){
        if(err){
           throw err
        }

        cart.add(doc, productId);
        req.session.cart = cart;
        console.log(req.session.cart)
        res.redirect('/');
    }); 
})

app.get('/contact', (req,res)=>{
    res.render('contact');
});

app.post('/contact', ensureAuthenticated, (req,res)=>{
    const {subject, message} = req.body;
if(!subject || !message ){
    req.flash('error_msg', "please fill out the fields");
    res.redirect('/contact');
}else{
    const newContact = new contact({
        subject:subject,
        message:message,
        userEmail:req.user.email
    });

    newContact.save((err, contactData)=>{
        if(err) throw err;
        console.log(contactData);
        req.flash('success_msg', "We recieved your message !")
        res.redirect('/contact');
    })
}

})

app.get('/purchase', ensureAuthenticated,  getReq.carts)

app.get('/cart-list', (req,res)=>{
    if(!req.session.cart){
        res.render('cart', {products:null})
    }else{

        
    var cart = new Cart(req.session.cart)

    res.render('cart', {products:cart.generateArray(), totalPrice:cart.totalPrice})
    
    }

});

app.get("/reduce/:id", (req, res)=>{
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart;
    res.redirect('/cart-list');
});

app.get("/add/:id", (req, res)=>{
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.addByOne(productId);
    req.session.cart;
    res.redirect('/cart-list');
});

app.get('/remove/:id', (req,res)=>{
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.remove(productId);
    req.session.cart;
    res.redirect('/cart-list');
})

app.get('/shop/checkout',ensureAuthenticated, (req,res)=>{
    if(!req.session.cart){
        res.redirect('/cart-list')
    }else{
        var cart = new Cart(req.session.cart);
        res.render('checkout-view', {total:cart.totalPrice})
    }
});
app.post('/shop/checkout', ensureAuthenticated, (req,res)=>{
    if(!req.session.cart){
        res.redirect('/cart-list')
    }
        var cart = new Cart(req.session.cart);
        stripe.charges.create({
        amount:cart.totalPrice * 1000,
        currency:'NGN',
        source: "tok_mastercard",
        description:'product purchase'

    }, 

    (err, charge)=>{
        if(err){
            req.flash('error', err.message);
            res.redirect('/shop/checkout');
        }else{
            const oder = new Oder({
                user:req.user,
                cart: cart,
                address: req.body.address,
                name:req.body.name,
                tel:req.body.tel,
                paymentId:charge.id
            });
            oder.save((err,savedOder)=>{
                if(err){
                    throw err
                }else{
                    console.log(savedOder)


                    var url = `${req.protocol}://${req.get('host')}/catrts`;
                    let transporter = nodemailer.createTransport({
                       service:'gmail',
                        auth:{
                            user:'abdurrahmangrema19@gmail.com',
                            pass:'malagana'
                        }
                    });
     
                    let mailOptions = {
                        from:'Outerer Collections',
                        to:req.user.email,
                        subject:'Thanks for Marketing with Us ',
                        text:'',
                        html:` <h3> Your Ordered Was successful</h3>
                        <strong> your PaymentId is ${savedOder.paymentId} </strong>
                        <a href=${url} class="sing-link">Check My Orders</a>`
                    };
     
                    transporter.sendMail(mailOptions, (err, info) => {
                        if(err){
                           return console.log(err);
                        }else{
                            req.flash('success', 'you have successifully purchase the items')
                            req.session.cart = null;
                            res.redirect('/');
                            console.log(info.response);
                        }
     
                    });
                    
                }
                
            })
    
        }
 
       

    }


)
 
})
app.post('/addCart', ensureAuthenticated,  postReq.addCart)
<<<<<<< HEAD
app.get("*", (req,res)=>{
    res.send("404 page not found")
})
const PORT = process.env.PORT || 300
app.listen(PORT, console.log(`the server is working on ${PORT}`))
=======


app.listen(process.env.PORT || 300, console.log('the server is working'))
>>>>>>> refs/remotes/origin/main
