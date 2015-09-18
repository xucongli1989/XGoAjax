; (function (win, doc, undefined) {
    //当前插件所有模板存放的区
    var _templates = {};

    /*默认模板项*/
    var defaultTemplate = {
        //模板名
        name: "",
        //请求前，如果返回false，则阻止后续执行。
        before: function () { return true; },
        //失败后
        error: null,
        //成功后
        success: null,
        //完成后
        complete: null,
        //请求模式，exclusive：独占请求，要想再发起同样的一个请求，必须等待上次请求结束。；greedy：贪婪请求，不限制重复请求
        mode: "exclusive",
        //模板自定义选项
        templateOption: {}
    };

    /*插件默认选项*/
    var defaults = {
        //模板名
        templateName: "default",
        //模板自定义选项
        templateOption: {},
        //$.ajax选项
        ajax: {
            url: "",
            dataType: "JSON",
            type: "",
            data: null
        }
    };

    var $form = $("form:first");

    /*扩展jquery*/
    $.extend({
        XGoAjax: function (ops) {
            ops = $.extend({}, defaults, ops || {});
            var dfd = null;
            var tp = _templates[ops.templateName];//当前模板
            ops.ajax.url = (ops.ajax.url ? ops.ajax.url : $form.attr("action")) || win.location.href;
            ops.ajax.data = ops.ajax.data ? ops.ajax.data : $form.serialize();
            ops.ajax.type = (ops.ajax.type ? ops.ajax.type : $form.attr("method")) || "POST";
            ops.templateOption = $.extend({}, ops.templateOption, tp.templateOption);
            
            if (tp.before.call(this, ops)) {
                //只有当before返回true时，才执行请求
                dfd = $.when($.ajax(ops.ajax)).done(function (data) {
                    if (data && !(data instanceof Object)) {
                        data = $.parseJSON(data);
                    }
                    tp.success.call(this, ops, data);
                }).always(function () {
                    tp.complete.call(this, ops);
                }).fail(function () {
                    tp.error.call(this, ops);
                });
            }

            //返回当前请求状态
            ops.getState = function () {
                return dfd ? dfd.state() : null;
            };

            return dfd ? dfd.promise() : dfd;
        }
    });

    /*添加自定义模板*/
    $.XGoAjax.addTemplate = function (model) {
        if (model.name) {
            _templates[model.name] = $.extend({}, defaultTemplate, model);
        }
    };
})(window, document);



/*默认模板，如果需要自定义模板，参照下面的模板方法即可！*/
$.XGoAjax.addTemplate({
    name: "default",
    before: function (ops) {
        return true;
    },
    error: function (ops) {
        console.log("error");
    },
    success: function (ops, data) {
        console.log("success:" + ops.getState());
        if (data.Message != "") {
            console.log(data.Message);
        }
    },
    complete: function (ops) {
        console.log("complete:" + ops.getState());
    },
    templateOption: {
        //事件触发对象，便于在请求中对其禁用等操作
        obj: null,
        //为true，则防止用户再次触发该请求
        isWaitComplete: true,
        //请求前要提示的信息
        beforeSendMsg: "正在处理中，请稍后...",
        //true:以alert的方式弹出消息，点确定或关闭执行刷新或其它函数。false:以tips弹出消息
        isAlertShowMsg: false
    }
});