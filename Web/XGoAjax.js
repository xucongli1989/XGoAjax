; (function (win, doc, undefined) {
    //��ǰ�������ģ���ŵ���
    var _templates = {};

    /*Ĭ��ģ����*/
    var defaultTemplate = {
        //ģ����
        name: "",
        //����ǰ���������false������ֹ����ִ�С�
        before: function () { return true; },
        //ʧ�ܺ�
        error: null,
        //�ɹ���
        success: null,
        //��ɺ�
        complete: null,
        //ģ���Զ���ѡ��
        templateOption: {}
    };

    /*���Ĭ��ѡ��*/
    var defaults = {
        id: "",
        //ģ����
        templateName: "default",
        //ģ���Զ���ѡ��
        templateOption: {},
        //����ģʽ��exclusive����ռ����Ҫ���ٷ���ͬ����һ�����󣬱���ȴ��ϴ������������greedy��̰�����󣬲������ظ�����
        mode: "exclusive",
        //$.ajaxѡ������ÿһ�����һ��ajax���󣬿����ж��ajax����
        ajax: [{
            url: "",
            dataType: "JSON",
            type: "",
            data: null
        }]
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
                n.type = (n.type ? n.type : method) || "POST";
            });

            ops.templateOption = $.extend({}, ops.templateOption, tp.templateOption);

            if (!tp.before.call(this, ops)) {
                //ֻ�е�before����trueʱ����ִ������
                isAllowRun = false;
            }
            if (ops.mode === "exclusive") {
                //��ռֻ������һ����������ִ��
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

            //���ص�ǰ����״̬
            ops.getState = function () {
                return dfd ? dfd.state() : null;
            };

            return dfd ? dfd.promise() : dfd;
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

/*Ĭ��ģ�壬�����Ҫ�Զ���ģ�壬���������ģ�巽�����ɣ�*/
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
        //����ǰҪ��ʾ����Ϣ
        beforeSendMsg: "���ڴ����У����Ժ�...",
        //true:��alert�ķ�ʽ������Ϣ����ȷ����ر�ִ��ˢ�»�����������false:��tips������Ϣ
        isAlertShowMsg: false
    }
});