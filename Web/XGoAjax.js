; (function (win, doc, undefined) {
    //��ǰ�������ģ���ŵ���
    var _templates = {};

    //Ĭ��ģ����
    var defaultTemplate = {
        name: "",//ģ����
        before: function () { return true;},//����ǰ���������false������ֹ����ִ�С�
        error: null,//ʧ�ܺ�
        success: null,//�ɹ���
        complete: null,//��ɺ�
        templateOption: {}//ģ���Զ���ѡ��
    };

    //���Ĭ��ѡ��
    var defaults = {
        templateName: "default",//ģ����
        templateOption: {},//ģ���Զ���ѡ��
        ajaxOption:{
            url: "",
            dataType: "JSON",
            type: "",
            data: null
        }
    };

    var $form = $("form:first");

    //��չjquery
    $.extend({
        XGoAjax: function (ops) {
            ops = $.extend({}, defaults, ops || {});
            var tp = _templates[ops.templateName];//��ǰģ��
            ops.ajaxOption.url = (ops.ajaxOption.url ? ops.ajaxOption.url : $form.attr("action")) || win.location.href;
            ops.ajaxOption.data = ops.ajaxOption.data ? ops.ajaxOption.data : $form.serialize();
            ops.ajaxOption.type = (ops.ajaxOption.type ? ops.ajaxOption.type : $form.attr("method")) || "POST";
            ops.templateOption = $.extend({}, ops.templateOption, tp.templateOption);

            //���ص�ǰ����״̬
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

    //����Զ���ģ��
    $.XGoAjax.addTemplate = function (model) {
        if (model.name) {
            _templates[model.name] = $.extend({}, defaultTemplate, model);
        }
    };
})(window, document);



//Ĭ��ģ��
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
        //�¼��������󣬱����������ж�����õȲ���
        obj: null,
        //Ϊtrue�����ֹ�û��ٴδ���������
        isWaitComplete:true,
        //����ǰҪ��ʾ����Ϣ
        beforeSendMsg: "",
        //true:��alert�ķ�ʽ������Ϣ����ȷ����ر�ִ��ˢ�»�����������false:��tips������Ϣ
        isAlertShowMsg: false
    }
});