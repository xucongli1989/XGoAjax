; (function (win, doc, undefined) {
    //��ǰ�������ģ���ŵ���
    var _templates = {};

    //Ĭ��ģ����
    var defaultTemplate = {
        name: "",//ģ����
        before: null,//����ǰ
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

    //����Զ���ģ��
    $.XGoAjax.addTemplate = function (model) {
        if (model.name) {
            _templates[model.name] = $.extend({}, defaultTemplate, model);
        }
    };
})(window, document);