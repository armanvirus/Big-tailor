$(document).ready(function () {
  
  /* the new and modified content*/
  
  //  liking ajax request
  $('#like').on('click', function (event) {
    event.preventDefault();
    var imgId = $(this).data('id');
    $.post('/images/like/' + imgId ).done(function (data) {
      console.log(data);
      if(data.likes >= 1){
        $('.likes-count').text(data.likes);
      }else if(data.likes == 0){
        $('.likes-count').text(0);
      }else{
        $('.like-err').css({display:"flex"});
        $('.like-erra').text(data.msg);
        $('.cancel').text('x');
      }
    });
});

$('.cancel').click(function(){
  $('.like-err').css({display:'none'});
})
  
 $('#account').hover(function(){
   $('.log-hide').attr('class', 'log')
 });

 var isClicked =false;
 $('.manu').click(function(){
  isClicked =! isClicked;
  if(isClicked){
    $('.down-hide').attr('class', 'down');
  }else{
    $('.down').attr('class', 'down-hide');
  }

  $('.drop-down').click(function(){
    console.log(this.next())
  })
  

 });



  /*end of the modified content*/




            $(".add").click(function () {
             console.log('is clicked')
                            $(".hid").attr("class", "sho");
            });
    
          //for(i = 0; i< $('.cart').length; i++){
            $('.cart').click(function(e){
              const productId = e.target.id;
     console.log(e.target.id)
     $.post('/addCart',{id:productId},(data, status)=>{

     })
            })
            
           // }
          /* search implimentation*/
          var displayer = $('#displayer');
          displayer.css({display:'none'});
          $('#searcher').keyup(function(){
      
            var field = $(this).val();
            $.get('/products',(data, status)=>{
              let  matches = data.filter(products =>{
                      const regex = new RegExp(`^${field}`, 'gi');
                      return products.name.match(regex) || products.description.match(regex);
                    });
                    console.log(matches)

        if(field.length === 0){
      matches = [];
      displayer.html('').css({display:'none'});
    }else{
  if(matches.length > 0){
      matches.forEach(match =>{
        var uniqueId = match.filename.split('.')[0];
        console.log(uniqueId)
        displayer.css({display:'flex'}).append(` <div class=" displayer-inner">
        <a href="/images/${ uniqueId }"> <img src="public/upload/${match.filename}" alt="" class="img img-fluid im " style='height:35px; width:35px;'> ${match.name} </a>
     </div>`)
    });
  }
}

            })  
          })
          })

// raw html
var acc = document.getElementsByClassName("accordion");
var i;
for (i = 0; i < acc.length; i++) {
  acc[i].onclick = function() {
    this.classList.toggle("active");
    this.nextElementSibling.classList.toggle("show");
  }
}

//styles for tutorials page
var open = document.getElementsByClassName("toClick");

for (i = 0; i < acc.length; i++) {
  open[i].onclick = function() {
    this.classList.toggle("isOpen");
    this.nextElementSibling.classList.toggle("opened");
  }
}


// var search = document.getElementById('search-product');
// var matchList = document.getElementById('match-display');

// var searchProducts =  (searchText) =>{
   
//   fetch('http://localhost:300/products').then((res) =>{
//     res.json();
//   }).then(function(matchProducts){

//     let matches = matchProducts.filter(products =>{
//       const regex = new RegExp(`^${searchText}`, 'gi');
//       return products.name.match(regex) || products.description.match(regex);
//     });
  
//     if(searchText.length === 0){
//       matches = [];
//     }else{
//       outputHTML(matches);
//     }
//   }).catch(function(err){
//     console.log(err)
//   });
  
  
// }
 
// const outputHTML = matches => {
//   if(matches.length > 0){
//     const html = matches.map(match =>{
//       ` <div class="card card-body mb-1">
//       <h5>${match.name} ${match.color}</h5>
//       </div>`
//     }).join('');
//     matchList.innerHTML = html;
//     console.log(matchList)
//   }
// }

// search.addEventListener('input', ()=> searchProducts(search.value))







