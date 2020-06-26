$(document).ready(function() {
    $('form').on('submit', function() {
        $.ajax({
            type: 'POST',
            url: '/survey',
            data: $(this).serializeArray(),
            success: function(data) {
                // disable the submit button
                $("#submitBtn").prop("disabled", "true");
                $("#submitBtn").text("Thank you!");
            }
        });
        return false;
    });
});