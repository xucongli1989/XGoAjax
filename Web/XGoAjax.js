; (function (win, doc, undefined) {
    //当前插件所有模板存放的区
    var _templates = {};

    //默认模板项
    var defaultTemplate = {
        name: "",//模板名
        before: function () { return true;},//请求前，如果返回false，则阻止后续执行。
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

            //返回当前请求状态
            ops.getState = function () {
                return null;
            };

            if (!tp.before.call(this, ops)) {
                return false;
            }

            var dfd=$.when($.ajax(ops.ajaxOption)).done(function (data) {
                tp.success.call(this, ops,data);
            }).always(function () {
                tp.complete.call(this, ops);
            }).fail(function () {
                tp.error.call(this, ops);
            });

            ops.getState = function () {
                return dfd.state();
            };

        }
    });

    //添加自定义模板
    $.XGoAjax.addTemplate = function (model) {
        if (model.name) {
            _templates[model.name] = $.extend({}, defaultTemplate, model);
        }
    };
})(window, document);



//默认模板
$.XGoAjax.addTemplate({
    name: "default",
    before: function (ops) {
        return true;
    },
    error: function (ops) {
        console.log("error");
    },
    success: function (ops,data) {
        console.log(ops.getState());

        if (data.Message != "") {
            console.log(data.Message);
        }

    },
    complete: function (ops) {
        console.log(ops.getState());
    },
    templateOption: {
        //事件触发对象，便于在请求中对其禁用等操作
        obj: null,
        //为true，则防止用户再次触发该请求
        isWaitComplete:true,
        //请求前要提示的信息
        beforeSendMsg: "",
        //true:以alert的方式弹出消息，点确定或关闭执行刷新或其它函数。false:以tips弹出消息
        isAlertShowMsg: false
    }
});