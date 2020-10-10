$(document).ready(function() {
    $(document).on('click', '.card .activator', function (e) {
        $(this).parent().parent().attr('original-height', $(this).parent().parent().css('height'));
        $(this).parent().parent().css('height', '500px');
        console.log('test')
    });
    $(document).on('click', '.card-reveal .card-title', function (e) {
        $(this).parent().parent().css('height', $(this).parent().parent().attr('original-height'));
        console.log('test2')
    });

});
