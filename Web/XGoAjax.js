; (function (win, doc, undefined) {
    //当前插件所有模板存放的区
    var _templates = {};

    //默认模板项
    var defaultTemplate = {
        name: "",//模板名
        before: null,//请求前
        error: null,//失败后
        success: null,//成功后
        complete: null,//完成后
        templateOption: {}//模板自定义选项
    };

    //插件默认选项
    var defaults = {
        templateName: "default",//模板名
        templateOption: {},//模板自定义选项
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
            var tp = _templates[ops.templateName];//当前模板
            ops.ajaxOption.url = (ops.ajaxOption.url ? ops.ajaxOption.url : $form.attr("action")) || win.location.href;
            ops.ajaxOption.data = ops.ajaxOption.data ? ops.ajaxOption.data : $form.serialize();
            ops.ajaxOption.type = (ops.ajaxOption.type ? ops.ajaxOption.type : $form.attr("method")) || "POST";
            ops.templateOption = $.extend({}, ops.templateOption, tp.templateOption);

            tp.before.call(this,ops);

            $.when($.ajax(ops.ajaxOption)).done(function () {
                tp.success.call(this, ops);
            }).always(function () {
                tp.complete.call(this, ops);
            }).fail(function () {
                tp.error.call(this, ops);
            });

        }
    });

    //添加自定义模板
    $.XGoAjax.addTemplate = function (model) {
        if (model.name) {
            _templates[model.name] = $.extend({}, defaultTemplate, model);
        }
    };
})(window, document);