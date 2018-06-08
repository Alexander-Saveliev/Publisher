$( "#logout" ).click(function() { logout() });


$('#universal-form button').click(function(ev) {
    ev.preventDefault()
    $('#create').hide();
    $('#join').hide();
    $('#login_message').html('<img src="img/loading.gif" alt="">');

    var action = "join-session";

    if ($(this).attr("id")=="create") {
        action = "create-session";
    }

    var $form = $("#universal-form");
    $.ajax({
        type: $form.attr('method'),
        url: action,
        data: $form.serialize()
    }).done(function( data ) {
        $("body").html(data);
    }).fail(function( reason ) {
         $('#create').show();
         $('#join').show();
        $("#login_message").text(reason.responseText);
    });
});
