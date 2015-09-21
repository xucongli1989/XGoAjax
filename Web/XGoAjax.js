/**
 * ******************************************************************************************
 * 1��������Ϣ��
 * ��ԴЭ�飺https://github.com/xucongli1989/XGoAjax/blob/master/LICENSE
 * ��Ŀ��ַ��https://github.com/xucongli1989/XGoAjax
 * �����ʼ���80213876@qq.com
 * Create By: XCL @ 2015.09 in Shenzhen. China
 ********************************************************************************************
 * 2��ʹ��˵����
 * ���е�ajax�������ʹ�ô˷������ã��������Ա�֤��Ŀ�е�ajaxͳһ����������ʾ�������ȡ������ڹܵ����ܣ����ջ���ʹ�õ�jquery.ajax��
 * ��ǰ�汾��v1.0
 * ����ʱ�䣺2015-09-18
 */
; (function (win, doc, undefined) {
    //��ǰ�������ģ���ŵ���
    var _templates = {};

    /*Ĭ��ģ����*/
    var defaultTemplate = {
        //ģ����
        name: "",
        //����ǰ���������false������ֹ����ִ�С�
        before: function (ops) { return true; },
        //ʧ�ܺ�
        error: function (ops) { },
        //�ɹ���dataΪ����
        success: function (ops, datas) { },
        //��ɺ�
        complete: function (ops) { },
        //ģ���Զ���ѡ���������ȫ���û��ڲ�ͬ��ģ���и�����Ҫ�Զ���
        templateOption: {}
    };

    /*���Ĭ��ѡ��*/
    var defaults = {
        //��������ı�ʶ����������ָ������Ҫ�Ǳ����жϸ�����Ϊͬһ���͵Ĳ��������磬һ����ť������һ����һ��ajax���󣬾Ϳ���ͨ��ָ����id���ж������ť��һ�δ����������Ƿ���ִ�����
        id: "",
        //ģ����
        templateName: "default",
        //ģ���Զ���ѡ��
        templateOption: {},
        //����ģʽ��exclusive����ռ����Ҫ���ٷ���ͬ����һ�����󣬱���ȴ��ϴ������������greedy��̰�����󣬲������ظ�����
        mode: "exclusive",
        //$.ajaxѡ������ÿһ�����һ��ajax���󣬿����ж��ajax����
        ajax: []
    };

    /*$.ajax��Ĭ��ѡ��*/
    var ajaxDefaults = {
        url: "",
        dataType: "JSON",
        type: "get",
        data:null
    };

    /*ajax�����б�*/
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

    /*��չjquery*/
    $.extend({
        XGoAjax: function (ops) {
            ops = $.extend({}, defaults, ops || {});
            var dfd = null, isAllowRun = true;
            var tp = _templates[ops.templateName];//��ǰģ��

            var action = $form.attr("action"), data = $form.serialize(), method = $form.attr("method");

            $.each(ops.ajax, function (i, n) {
                n.url = (n.url ? n.url : action) || win.location.href;
                n.data = n.data ? n.data : data;
                n.type = (n.type ? n.type : method) || "get";
                ops.ajax[i]=$.extend({},ajaxDefaults,n);
            });

            ops.templateOption = $.extend({}, ops.templateOption, tp.templateOption);

            if (ops.mode === "exclusive") {
                //��ռֻ������һ����������ִ��
                var item = _getWorkById(ops.id);
                if (item && item.promise && item.promise.state() === "pending") {
                    isAllowRun = false;
                }
            }

            if (isAllowRun && tp.before.call(this, ops)) {
                //ֻ�е�before����trueʱ����ִ������
                var ajaxDeferred = [];
                $.each(ops.ajax, function (i, n) {
                    ajaxDeferred.push($.ajax(n));
                });
                dfd = $.when.apply($, ajaxDeferred).done(function () {
                    var datas = [], args = arguments,d=null;

                    for (var i = 0; i < ops.ajax.length; i++) {
                        d = ops.ajax.length > 1 ? args[i][0] : args[0];
                        if (ops.ajax[i].dataType.toUpperCase() === "JSON" && !(d instanceof Object)) {
                            //�����������Ϊjson�����Ƿ��صĲ���һ�������򽫷���ֵתΪjson
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

            //���ص�ǰ����״̬
            ops.getState = function () {
                return dfd ? dfd.state() : null;
            };

            return dfd ? dfd.promise() : null;
        }
    });

    /*����Զ���ģ��*/
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
***************************************************************************************************************************************************************************************************
* ����Ϊģ�壬�ɸ���������Ŀ��Ҫ�����������Ӧ��ģ�巽�����ɡ�
***************************************************************************************************************************************************************************************************
*/


/*Ĭ��ģ��*/
$.XGoAjax.addTemplate({
    name: "default",
    before: function (ops) {
        console.log("����ִ���У����Ժ�...");
        return true;
    },
    error: function (ops) {
        console.log("����ʧ�ܣ�");
    },
    success: function (ops, datas) {
        /*
        ����ɹ��󷵻ص�data��ʽ��
        data={
            //��ʾ��
            Message:"",
            //����
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
        console.log("��������ɣ�");
    }
});





/*artdialogģ��*/
$.XGoAjax.addTemplate({
    name: "artdialog",
    before: function (ops) {
        art.dialog.tips(ops.templateOption.beforeSendMsg,99999999999);
        return true;
    },
    error: function (ops) {
        art.dialog.tips("��Ǹ�������������");
    },
    success: function (ops, datas) {
        /*
        ����ɹ��󷵻ص�data��ʽ��
        data={
            //��ʾ����
            Title:"",
            //��ʾ��
            Message:"",
            //�Ƿ�ɹ�
            IsSuccess:false,
            //�Ƿ����ˢ��
            IsRefresh:false,
            //�Ƿ���Ҫ��ת
            IsRedirect:false,
            //Ҫ��ת��url
            RedirectURL:"",
            //�Զ����������
            CustomObject:null,
            //����
            ...
        }
        */

        if (ops.templateOption.successFunction) {
            ops.templateOption.successFunction.apply(this, arguments);
            if (ops.templateOption.afterSuccessFunction) {
                ops.templateOption.afterSuccessFunction.apply(this, arguments);
            }
            return;
        }

        var data = datas[0];
        //artdialogͼ��
        var dialogIcon = "succeed";
        //����ˢ�º���
        var refresh = function () {
            var time = 700;
            if (ops.templateOption.isAlertShowMsg) {
                time = 0;
            }
            if (data.IsRefresh) {
                setTimeout(function () {
                    ops.templateOption.refreshFunction.apply(this, arguments);
                }, time);
            }
        };

        //���ʧ��������ʾ�����alert��ʽ������Ϣ
        if (data && data.Message && !data.IsSuccess) {
            ops.templateOption.isAlertShowMsg = true;
            dialogIcon = "error";
        }
        
        if (data.Message != "") {
            if (ops.templateOption.isAlertShowMsg) {
                art.dialog({
                    icon: dialogIcon,
                    content: "<div style='max-width:500px;'>" + data.Message + "</div>",
                    cancelVal: '֪����',
                    cancel: function () {
                        refresh();
                    }
                });
            } else {
                //��tips��ʽ��ʾ��Ϣ
                art.dialog.tips(data.Message);
                refresh();
            }
        }

        if (ops.templateOption.afterSuccessFunction) {
            ops.templateOption.afterSuccessFunction.apply(this, arguments);
            return;
        }

    },
    complete: function (ops) {
        var list = art.dialog.list["Tips"];
        if (null != list) {
            list.close();
        }
    },
    templateOption: {
        //����ǰҪ��ʾ����Ϣ
        beforeSendMsg: "���ڴ����У����Ժ�...",
        //����ɹ���ִ�еĺ������˷����Ḳ��ģ���е�success����
        successFunction: null,
        //ִ��Ĭ�ϵĳɹ�������Ҫִ�е�����
        afterSuccessFunction: null,
        //true:��alert�ķ�ʽ������Ϣ����ȷ����ر�ִ��ˢ�»�����������false:��tips������Ϣ
        isAlertShowMsg: false,
        //ˢ�º���
        refreshFunction: function () {
            art.dialog.open.origin.location.reload();
        }
    }
});