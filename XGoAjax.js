; (function (win, doc, undefined) {
    //当前插件所有模板存放的区
    var _templates = {};

    //默认模板项
    var defaultTemplate = {
        name: "",//模板名
        before: null,//请求前
        after: null,//请求后
        error: null,//失败后
        success: null,//成功后
        complete: null,//完成后
        isMustWaitComplete: true//所有请求结束后能才再发起新的请求
    };

    //插件默认选项
    var defaults = {
        templateName: "default",//模板名
        ajaxOption:{
            url: "",
            dataType: "JSON",
            type: "",
            data: null
        }
    };

    var $form = $("form:first");

    //扩展jquery
    $.extend({
        XGoAjax: function (ops) {
            ops = $.extend({}, defaults, ops || {});
            
            ops.ajaxOption.url = (ops.ajaxOption.url ? ops.ajaxOption.url : $form.attr("action")) || win.location.href;
            ops.ajaxOption.data = ops.ajaxOption.data ? ops.ajaxOption.data : $form.serialize();
            ops.ajaxOption.type = (ops.ajaxOption.type ? ops.ajaxOption.type : $form.attr("method")) || "POST";

            var tp = _templates[ops.templateName];//当前模板

            tp.before.call(this);

            var def = $.deferred();

            def.when($.ajax(ops.ajaxOption)).pipe(function () {

            }).done(function () {
                tp.success.apply(this, arguments);
            }).always(function () {
                tp.complete.apply(this, arguments);
            }).fail(function () {
                tp.error.apply(this, arguments);
            });

        }
    });

    //添加自定义模板
    $.XGoAjax.addTemplate = function (model) {
        _templates[model.name] = $.extend({}, defaultTemplate, model);
    };
})(window, document);