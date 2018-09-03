$("#soso").on("input", function() {
    $.ajax({
        url: "/api/soso?content=" + $("#soso").val(),
        dataType: "json",
        success: function(res) {
            if (res.code === 1) {
                var str = "";
                res.msg.forEach(function(item) {
                    str += "<li>" + item + "</li>"
                });
                $(".list").html(str);
            }
        }
    });
    if ($("#soso").val() === "") {
        $(".list").html("");
    }
});