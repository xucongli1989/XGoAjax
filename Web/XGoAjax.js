/**
 * ******************************************************************************************
 * 1：基本信息：
 * 开源协议：https://github.com/xucongli1989/XGoAjax/blob/master/LICENSE
 * 项目地址：https://github.com/xucongli1989/XGoAjax
 * 电子邮件：80213876@qq.com
 * Create By: XCL @ 2015.09 in Shenzhen. China
 ********************************************************************************************
 * 2：使用说明：
 * 所有的ajax请求必须使用此方法调用，这样可以保证项目中的ajax统一处理，包括提示语，错误处理等。类似于管道功能，最终还是使用的jquery.ajax。
 * 当前版本：v1.0
 * 更新时间：2015-09-18
 */
; (function (win, doc, undefined) {
    //当前插件所有模板存放的区
    var _templates = {};

    /*默认模板项*/
    var defaultTemplate = {
        //模板名
        name: "",
        //请求前，如果返回false，则阻止后续执行。
        before: function (ops) { return true; },
        //失败后
        error: null,
        //成功后，data为数组
        success: function (ops, datas) { },
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
        ajax: []
    };

    /*$.ajax的默认选项*/
    var ajaxDefaults = {
        url: "",
        dataType: "JSON",
        type: "get",
        data:null
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
                ops.ajax[i]=$.extend({},ajaxDefaults,n);
            });

            ops.templateOption = $.extend({}, ops.templateOption, tp.templateOption);

            if (ops.mode === "exclusive") {
                //独占只能允许一个请求正在执行
                var item = _getWorkById(ops.id);
                if (item && item.promise && item.promise.state() === "pending") {
                    isAllowRun = false;
                }
            }

            if (isAllowRun && tp.before.call(this, ops)) {
                //只有当before返回true时，才执行请求
                var ajaxDeferred = [];
                $.each(ops.ajax, function (i, n) {
                    ajaxDeferred.push($.ajax(n));
                });
                dfd = $.when.apply($, ajaxDeferred).done(function () {
                    var datas = [], args = arguments,d=null;

                    for (var i = 0; i < ops.ajax.length; i++) {
                        d = ops.ajax.length > 1 ? args[i][0] : args[0];
                        if (ops.ajax[i].dataType.toUpperCase() === "JSON" && !(d instanceof Object)) {
                            //如果请求类型为json，但是返回的不是一个对象，则将返回值转为json
                            datas.push($.parseJSON(d));
                        } else {
                            datas.push(d);
                        }
                    }

                    tp.success.call(this, ops, datas);
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

            return dfd ? dfd.promise() : null;
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


/*
*****************************************************************
* 以下为模板，可根据您的项目需要，自行添加相应的模板方法即可。
*****************************************************************
*/


/*默认模板*/
$.XGoAjax.addTemplate({
    name: "default",
    before: function (ops) {
        console.log("正在执行中，请稍后...");
        return true;
    },
    error: function (ops) {
        console.log("请求失败！");
    },
    success: function (ops, datas) {
        var msg = "";
        $.each(datas, function (i, n) {
            msg += n.Message;
        });
        console.log(msg);
    },
    complete: function (ops) {
        console.log("请求已完成！");
    }
});


/*artdialog模板*/
$.XGoAjax.addTemplate({
    name: "artdialog",
    before: function (ops) {
        art.dialog.tips(ops.templateOption.beforeSendMsg,99999999999);
        return true;
    },
    error: function (ops) {
        art.dialog({
            icon: "error",
            content: "抱歉，出错了！",
            ok: function () { }
        });
    },
    success: function (ops, datas) {
        var msg = "";
        $.each(datas, function (i,n) {
            msg += n.Message;
        });
        art.dialog({
            icon: "succeed",
            content: msg,
            ok: function () {

            }
        });
    },
    complete: function (ops) {
        var list = art.dialog.list["Tips"];
        if (null != list) {
            list.close();
        }
    },
    templateOption: {
        //请求前要提示的信息
        beforeSendMsg: "正在处理中，请稍后..."
    }
});