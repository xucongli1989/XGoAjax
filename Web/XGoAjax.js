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
        //����ģʽ��exclusive����ռ����Ҫ���ٷ���ͬ����һ�����󣬱���ȴ��ϴ������������greedy��̰�����󣬲������ظ�����
        mode: "exclusive",
        //ģ���Զ���ѡ��
        templateOption: {}
    };

    /*���Ĭ��ѡ��*/
    var defaults = {
        //ģ����
        templateName: "default",
        //ģ���Զ���ѡ��
        templateOption: {},
        //$.ajaxѡ��
        ajax: {
            url: "",
            dataType: "JSON",
            type: "",
            data: null
        }
    };

    var $form = $("form:first");

    /*��չjquery*/
    $.extend({
        XGoAjax: function (ops) {
            ops = $.extend({}, defaults, ops || {});
            var dfd = null;
            var tp = _templates[ops.templateName];//��ǰģ��
            ops.ajax.url = (ops.ajax.url ? ops.ajax.url : $form.attr("action")) || win.location.href;
            ops.ajax.data = ops.ajax.data ? ops.ajax.data : $form.serialize();
            ops.ajax.type = (ops.ajax.type ? ops.ajax.type : $form.attr("method")) || "POST";
            ops.templateOption = $.extend({}, ops.templateOption, tp.templateOption);
            
            if (tp.before.call(this, ops)) {
                //ֻ�е�before����trueʱ����ִ������
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
        if (data.Message != "") {
            console.log(data.Message);
        }
    },
    complete: function (ops) {
        console.log("complete:" + ops.getState());
    },
    templateOption: {
        //�¼��������󣬱����������ж�����õȲ���
        obj: null,
        //Ϊtrue�����ֹ�û��ٴδ���������
        isWaitComplete: true,
        //����ǰҪ��ʾ����Ϣ
        beforeSendMsg: "���ڴ����У����Ժ�...",
        //true:��alert�ķ�ʽ������Ϣ����ȷ����ر�ִ��ˢ�»�����������false:��tips������Ϣ
        isAlertShowMsg: false
    }
});