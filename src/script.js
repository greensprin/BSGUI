$(function() {
    $(".run_script_btn").on("click", function() {
        const cmd = $(this).text();
        console.log(cmd);
        const res = window.api.run_script(cmd);
    })
})