; (function (win, doc, undefined) {
    //��ǰ�������ģ���ŵ���
    var _templates = {};

    //Ĭ��ģ����
    var defaultTemplate = {
        name: "",//ģ����
        before: null,//����ǰ
        after: null,//�����
        error: null,//ʧ�ܺ�
        success: null,//�ɹ���
        complete: null,//��ɺ�
        isMustWaitComplete: true//��������������ܲ��ٷ����µ�����
    };

    //���Ĭ��ѡ��
    var defaults = {
        templateName: "default",//ģ����
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
            
            ops.ajaxOption.url = (ops.ajaxOption.url ? ops.ajaxOption.url : $form.attr("action")) || win.location.href;
            ops.ajaxOption.data = ops.ajaxOption.data ? ops.ajaxOption.data : $form.serialize();
            ops.ajaxOption.type = (ops.ajaxOption.type ? ops.ajaxOption.type : $form.attr("method")) || "POST";

            var tp = _templates[ops.templateName];//��ǰģ��

            tp.before.call(this);

            var def = $.deferred();

            def.when($.ajax(ops.ajaxOption)).pipe(function () {

            }).done(function () {
                tp.success.apply(this, arguments);
            }).always(function () {
                tp.complete.apply(this, arguments);
            }).fail(function () {
                tp.error.apply(this, arguments);
            });

        }
    });

    //����Զ���ģ��
    $.XGoAjax.addTemplate = function (model) {
        _templates[model.name] = $.extend({}, defaultTemplate, model);
    };
})(window, document);