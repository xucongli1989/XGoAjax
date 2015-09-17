//Ä¬ÈÏÄ£°å
$.XGoAjax.addTemplate({
    name: "default",
    before: function (ops) {
        console.log("before");
        debugger;
    },
    after: function (ops) {
        console.log("after");
    },
    error: function (ops) {
        console.log("error");
    },
    success: function (ops) {
        console.log("success");
    },
    complete: function (ops) {
        console.log("complete");
    },
    templateOption: {
        isRedirect: false,
        redirectUrl:""
    }
});