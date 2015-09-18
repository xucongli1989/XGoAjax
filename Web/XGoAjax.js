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
        //模板自定义选项
        templateOption: {}
    };

    /*插件默认选项*/
    var defaults = {
        id: "",
        //模板名
        templateName: "default",
        //模板自定义选项
        templateOption: {},
        //请求模式，exclusive：独占请求，要想再发起同样的一个请求，必须等待上次请求结束。；greedy：贪婪请求，不限制重复请求
        mode: "exclusive",
        //$.ajax选项，数组的每一项代表一个ajax请求，可以有多个ajax请求
        ajax: [{
            url: "",
            dataType: "JSON",
            type: "",
            data: null
        }]
    };

    /*ajax请求列表*/
    var _workList = [];
    var workItemModel = function (id, promise) {
        this.id = id;
        this.promise = promise;
    };
    var _addWork = function (item) {
        _workList.push(item);
    };
    var _getWorkById = function (id) {
        var result = null;
        $.each(_workList, function (i, n) {
            if (($.trim(id)).toUpperCase() === n.id.toUpperCase()) {
                result = n;
                return false;
            }
        });
        return result;
    };
    var _removeById = function (id) {
        _workList = $.map(_workList, function (n) {
            return ($.trim(id)).toUpperCase() === id.toUpperCase() ? null : n;
        });
    };

    var $form = $("form:first");

    /*扩展jquery*/
    $.extend({
        XGoAjax: function (ops) {
            ops = $.extend({}, defaults, ops || {});
            var dfd = null, isAllowRun = true;
            var tp = _templates[ops.templateName];//当前模板

            var action = $form.attr("action"), data = $form.serialize(), method = $form.attr("method");

            $.each(ops.ajax, function (i, n) {
                n.url = (n.url ? n.url : action) || win.location.href;
                n.data = n.data ? n.data : data;
                n.type = (n.type ? n.type : method) || "POST";
            });

            ops.templateOption = $.extend({}, ops.templateOption, tp.templateOption);

            if (!tp.before.call(this, ops)) {
                //只有当before返回true时，才执行请求
                isAllowRun = false;
            }
            if (ops.mode === "exclusive") {
                //独占只能允许一个请求正在执行
                var item = _getWorkById(ops.id);
                if (item && item.promise && item.promise.state() === "pending") {
                    isAllowRun = false;
                }
            }

            if (isAllowRun) {
                var ajaxDeferred = [];
                $.each(ops.ajax, function (i, n) {
                    ajaxDeferred.push($.ajax(n));
                });
                dfd = $.when.apply($, ajaxDeferred).done(function (data) {
                    if (data && !(data instanceof Object)) {
                        data = $.parseJSON(data);
                    }
                    tp.success.call(this, ops, data);
                }).always(function () {
                    _removeById(ops.id);
                    tp.complete.call(this, ops);
                }).fail(function () {
                    tp.error.call(this, ops);
                });
                _addWork(new workItemModel(ops.id, dfd.promise()));
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

    $.XGoAjax.getAjaxList = function () {
        return _workList;
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
    },
    complete: function (ops) {
        console.log("complete:" + ops.getState());
    },
    templateOption: {
        //请求前要提示的信息
        beforeSendMsg: "正在处理中，请稍后...",
        //true:以alert的方式弹出消息，点确定或关闭执行刷新或其它函数。false:以tips弹出消息
        isAlertShowMsg: false
    }
});