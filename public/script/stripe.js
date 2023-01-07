Stripe.setPublishableKey('pk_test_51HirQGDaw0JmpBrujc5bgWbImeOiOTmIcqOqtg9G3qHyNR3ewmt8krljCoBvBt70dvdoOe2kMfYQViKZm2ntj4Gd004U0IgoaU');
// var form = $('#check');
// form.submit(function(){
//     form.find('button').prop('disabled', true);
//     form.find('#err').addClass('hidden');
//     Stripe.card.createToken({
//         number:$('#card-number').val,
//         cvc:$('#card-cvc').val,
//         exp_month:$('#card-exp-month').val,
//         exp_year:$('#card-exp-year').val,
//         name:$('#card-name').val
//     }, stripeResposeHandler)

//     return false;
// });

// var stripeResposeHandler = (status, response)=>{
//     if(response.error){
//         form.find('.err').text(response.error.message);
//         form.find('#err').removeClass('hidden');
//         form.find('button').prop('disabled', false);
//     }else{
//         var token = response.id;
//         form.append($('<input type="hidden" name="stripeToken"/>').val(token))
//     form.get(0).submit();
//     }
// }




var $form = $('#checkout-form');

$form.submit(function(event) {
    $('#charge-errors').addClass('hidden');
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
      number: $('#card-number').val(),
      cvc: $('#card-cvc').val(),
      exp_month: $('#card-expiry-month').val(),
      exp_year: $('#card-expiry-year').val(),
      name: $('#card-name').val()
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) { // Problem!

    // Show the errors on the form
    $('#charge-errors').text(response.error.message);
    $('#charge-errors').removeClass('hidden');
    $form.find('button').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // Submit the form:
    $form.get(0).submit();
  }
};