$( "#logout" ).click(function() { logout() });

$('.jq-send-form').submit(function(e) {
    var $form = $(this);
    $.ajax({
      type: $form.attr('method'),
      url: $form.attr('action'),
      data: $form.serialize()
  }).done(function( data ) {
      $("body").html(data);
  }).fail(function( reason ) {
      console.log("failure " + reason.responseText);
    });
    e.preventDefault();
});
