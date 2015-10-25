/**
 * ******************************************************************************************
 * 1：基本信息：
 * 开源协议：https://github.com/xucongli1989/XGoAjax/blob/master/LICENSE
 * 项目地址：https://github.com/xucongli1989/XGoAjax
 * 电子邮件：80213876@qq.com
 * Create By: XCL @ 2015.09 in Shenzhen. China
 ********************************************************************************************
 * 2：使用说明：
 *                      统一对ajax请求的结果进行处理，包括消息提示、错误处理等操作，这样可以保证我们的项目有一个统一的风格，同时也简化了大量的代码。
 * 3：使用场景：
 *                      a：ajax回调信息提示响应处理，比如提示成功或失败等消息。
 *                      b：提交按钮需要在ajax请求中阻止提交（防止多次提交）
 *                      c：同时发起多次ajax请求
 * 当前版本：v1.0.2
 * 更新时间：2015-10-25
 */
; (function (win, doc, undefined) {
    "use strict";

    var _version = "v1.0.2，https://github.com/xucongli1989/XGoAjax";

    //全局设置
    var _globalSettings = {};

    //当前插件所有模板存放的区
    var _templates = {};

    /*默认模板项*/
    var defaultTemplate = {
        //模板名
        name: "",
        //请求前，如果返回false，则阻止后续执行。
        before: function (ops) { return true; },
        //失败后
        error: function (ops) { },
        //成功后，data为数组
        success: function (ops, datas) { },
        //完成后
        complete: function (ops) { },
        //模板自定义选项，此属性完全由用户在不同的模板中根据需要自定义
        templateOption: {}
    };

    /*插件默认选项*/
    var defaults = {
        /*
        发起请求的标识，可以随意指定，主要是便于判断该请求为同一类型的操作。
        比如，一个表单提交按钮来触发一个或一组ajax请求的情况，我们可以指定id来标识用户单击这个提交按钮时的请求，
        这样，如果是在独占模式情况下，本插件就会通过这个id，判断上一次请求是否已经结束，如果未结束，则不做任何处理，
        如果已结束，则可以再重新发起请求。这样做的好处是，防止用户在短时间内，多次单击提交按钮。
        （以往旧的做法是，在请求时，禁用这个按钮。）注意：如果未指定则默认为贪婪模式；在独占请求时，必须指定有效的值。
        */
        id: "",
        //模板名，默认值在_globalSettings中设置
        templateName: "",
        //请求前function，如果未指定，则执行模板中的before函数
        before: null,
        //失败后function，如果未指定，则执行模板中的error函数
        error: null,
        //成功后function，如果未指定，则执行模板中的success函数
        success: null,
        //完成后function，如果未指定，则执行模板中的complete函数
        complete: null,
        //模板自定义选项，此属性完全由用户在不同的模板中根据需要自定义
        templateOption: {},
        //true:独占请求，要想再发起同样的一个请求，必须等待上次请求结束；false:贪婪请求，不限制重复请求。 默认值在_globalSettings中设置
        isExclusive:true,
        //$.ajax选项，数组的每一项代表一个ajax请求，可以有多个ajax请求。如果只有一个请求，可以不用数组，直接用{...}替代。如果没有传递此参数或数组项长度为0，则使用默认的ajax行为
        ajax: []
    };

    /*$.ajax的默认选项*/
    var ajaxDefaults = {
        url: "",
        dataType: "JSON",
        type: "get",
        data: null
    };

    /*ajax请求列表*/
    var _workList = {};
    var _addWork = function (id, defer) {
        if (id) {
            _workList[id] = defer;
        }
    };
    var _getWorkById = function (id) {
        return _workList[id] || null;
    };
    var _removeById = function (id) {
        delete _workList[id];
    };

    /*扩展jquery*/
    $.extend({
        XGoAjax: function (ops) {
            ops = $.extend({}, defaults, ops || {});
            var dfd = null, isAllowRun = true;
            var tp = _templates[ops.templateName];//当前模板
            var $form = $("form:first");
            var action = $form.attr("action"), data = $form.serialize(), method = $form.attr("method");

            //如果ajax参数不是数组，则把该值设置为数组的第一项
            if (ops.ajax && !($.isArray(ops.ajax))) {
                ops.ajax = [ops.ajax];
            }

            if(!ops.ajax || ops.ajax.length==0){
                //如果没有传ajax参数，则使用默认值
                ops.ajax=[{
                    url : action || win.location.href,
                    data : data,
                    type : method || "get"
                }];
                ops.ajax[0] = $.extend({}, ajaxDefaults, ops.ajax[0]);
            }else{
                //如果有传ajax参数，则对参数进行进一步的处理
                $.each(ops.ajax, function (i, n) {
                    n.url = (n.url ? n.url : action) || win.location.href;
                    n.data = n.data ? n.data : data;
                    n.type = (n.type ? n.type : method) || "get";
                    ops.ajax[i] = $.extend({}, ajaxDefaults, n);
                });
            }

            ops.templateOption = $.extend({}, ops.templateOption, tp.templateOption);

            if (ops.isExclusive) {
                if (!ops.id) {
                    throw new Error('Error：独占请求必须指定有效的id！');
                }
                //独占只能允许一个请求正在执行
                var item = _getWorkById(ops.id);
                if (item && item.state() === "pending") {
                    isAllowRun = false;
                }
            }

            var beforeResult = false;

            if (isAllowRun) {
                if (ops.before) {
                    beforeResult = ops.before.call(this, ops);
                } else {
                    beforeResult = tp.before.call(this, ops);
                }
            }

            if (isAllowRun && beforeResult) {
                //只有当before返回true时，才执行请求
                var ajaxDeferred = [];
                $.each(ops.ajax, function (i, n) {
                    ajaxDeferred.push($.ajax(n));
                });
                dfd = $.when.apply($, ajaxDeferred).done(function () {
                    var datas = [], args = arguments, d = null;

                    for (var i = 0; i < ops.ajax.length; i++) {
                        d = ops.ajax.length > 1 ? args[i][0] : args[0];
                        if (ops.ajax[i].dataType.toUpperCase() === "JSON" && !(d instanceof Object)) {
                            //如果请求类型为json，但是返回的不是一个对象，则将返回值转为json
                            datas.push($.parseJSON(d));
                        } else {
                            datas.push(d);
                        }
                    }

                    if (ops.success) {
                        ops.success.call(this, ops, datas);
                    } else {
                        tp.success.call(this, ops, datas);
                    }
                }).always(function () {
                    _removeById(ops.id);

                    if (ops.complete) {
                        ops.complete.call(this, ops);
                    } else {
                        tp.complete.call(this, ops);
                    }
                }).fail(function () {
                    if (ops.error) {
                        ops.error.call(this, ops);
                    } else {
                        tp.error.call(this, ops);
                    }
                });
                _addWork(ops.id, dfd);
            }

            //返回当前请求状态
            ops.getState = function () {
                return dfd ? dfd.state() : null;
            };

            return dfd ? dfd : null;
        }
    });

    /*版本号*/
    $.XGoAjax.version = _version;

    /*添加自定义模板*/
    $.XGoAjax.addTemplate = function (model) {
        if (model.name) {
            _templates[model.name] = $.extend({}, defaultTemplate, model);
        }
    };

    /*获取当前的ajax列表对象*/
    $.XGoAjax.getAjaxList = function () {
        return _workList;
    };

    /*根据模板名获取模板对象*/
    $.XGoAjax.getTemplate = function (name) {
        return _templates[name] || null;
    };

    /*本插件全局设置*/
    $.XGoAjax.globalSettings = function (setting) {
        _globalSettings = $.extend({
            //默认模板名
            templateName: "default",
            //是否独占请求
            isExclusive: true
        }, setting || {});
        defaults.templateName = _globalSettings.templateName;
        defaults.isExclusive = _globalSettings.isExclusive;
    };
    $.XGoAjax.globalSettings();

    /*获取本插件全局设置*/
    $.XGoAjax.getGlobalSettings = function () {
        return _globalSettings || null;
    };
})(window, document);

/*
***************************************************************************************************************************************************************************************************
* 以下为模板，可根据您的项目需要，自行添加相应的模板方法即可。
***************************************************************************************************************************************************************************************************
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
        /*
        请求成功后返回的data格式：
        data={
            //提示语
            Message:"",
            //更多
            ...
        }
        */
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
        art.dialog.tips(ops.templateOption.beforeSendMsg, 99999999999);
        return true;
    },
    error: function (ops) {
        art.dialog.tips("抱歉，请求出错啦！");
    },
    success: function (ops, datas) {
        /*
        请求成功后返回的data格式：
        data={
            //提示标题
            Title:"",
            //提示语
            Message:"",
            //是否成功
            IsSuccess:false,
            //是否进行刷新
            IsRefresh:false,
            //是否需要跳转
            IsRedirect:false,
            //要跳转的url
            RedirectURL:"",
            //自定义输出对象
            CustomObject:null,
            //更多
            ...
        }
        */

        var data = datas[0];
        //artdialog图标
        var dialogIcon = "succeed";

        //如果失败且有提示语，则以alert方式弹出消息
        if (data && data.Message && !data.IsSuccess) {
            ops.templateOption.isAlertShowMsg = true;
            dialogIcon = "error";
        }

        //关闭窗口中正在提示的tips
        var list = art.dialog.list["Tips"];
        if (null != list) {
            list.close();
        }

        //定义刷新函数
        var refresh = function () {
            //跳转
            if (data.IsRedirect && data.RedirectURL) {
                location.href = data.RedirectURL;
                return;
            }
            //刷新
            if (data.IsRefresh) {
                setTimeout(function () {
                    ops.templateOption.refreshFunction.apply(this, arguments);
                }, ops.templateOption.isAlertShowMsg ? 0 : 700);//延迟0.7s的目的是在tips提示的场景下，让用户多看一下提示语
            }
        };

        if (data.Message != "" && data.Message != null) {
            if (ops.templateOption.isAlertShowMsg) {
                //以对话框方式显示消息
                art.dialog({
                    icon: dialogIcon,
                    content: "<div style='max-width:500px;'>" + data.Message + "</div>",
                    cancelVal: '知道了',
                    cancel: function () {
                        refresh();
                    }
                });
            } else {
                //以tips方式显示消息
                art.dialog.tips(data.Message);
                refresh();
            }
        }
    },
    complete: function (ops) {
        //关闭窗口中正在提示的tips
        var list = art.dialog.list["Tips"];
        if (null != list) {
            list.close();
        }
    },
    templateOption: {
        //请求前要提示的信息
        beforeSendMsg: "正在处理中，请稍后...",
        //true:以alert的方式弹出消息，点确定或关闭执行刷新或其它函数。false:以tips弹出消息
        isAlertShowMsg: true,
        //刷新函数
        refreshFunction: function () {
            art.dialog.open.origin.location.reload();
        }
    }
});