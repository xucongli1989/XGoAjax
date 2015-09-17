//Ä¬ÈÏÄ£°å
$.XGoAjax.addTemplate({
    name: "default",
    before: function () {
        console.log("before");
    },
    after: function () {
        console.log("after");
    },
    error: function () {
        console.log("error");
    },
    success: function () {
        console.log("success");
    },
    complete: function () {
        console.log("complete");
    },
    isMustWaitComplete: true
});