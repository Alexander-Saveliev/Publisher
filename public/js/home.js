$( "#logout" ).click(function() { logout() });


$('.jq-send-form').submit(function(e) {
    var $form = $(this);
    $.ajax({
      type: $form.attr('method'),
      url: $form.attr('action'),
      data: $form.serialize()
    }).done(function() {
      console.log("success");
    }).fail(function( data ) {
      console.log("failure");
    });
    e.preventDefault();
});
