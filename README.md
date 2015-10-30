# XGoAjax简介
统一对ajax请求的结果进行处理，包括消息提示、错误处理等操作，这样可以保证我们的项目有一个统一的风格，同时也简化了大量的代码。
# 使用场景
1. ajax回调信息提示响应处理，比如提示成功或失败等消息。
2. 提交按钮需要在ajax请求中阻止提交（防止多次提交）
3. 同时发起多次ajax请求


# 属性
**插件全局设置：**
<table>
<tr>
<td>属性名</td>
<td>默认值</td>
<td>说明</td>
</tr>
<tr>
<td>templateName</td>
<td>"default"</td>
<td>默认模板名</td>
</tr>
<tr>
<td>isExclusive</td>
<td>true</td>
<td>独占请求</td>
</tr>
</table>

**插件选项：**

<table>
<tr>
<td>属性名</td>
<td>默认值</td>
<td>说明</td>
</tr>
<tr>
<td>id</td>
<td>""</td>
<td>发起请求的标识，可以随意指定，主要是便于判断该请求为同一类型的操作。比如，一个表单提交按钮来触发一个或一组ajax请求的情况，我们可以指定id来标识用户单击这个提交按钮时的请求，这样，如果是在独占模式情况下，本插件就会通过这个id，判断上一次请求是否已经结束，如果未结束，则不做任何处理，如果已结束，则可以再重新发起请求。这样做的好处是，防止用户在短时间内，多次单击提交按钮。（以往旧的做法是，在请求时，禁用这个按钮。）注意：如果未指定则默认为贪婪模式；在独占请求时，必须指定有效的值。</td>
</tr>
<tr>
<td>templateName</td>
<td>【全局设置】中的templateName属性。如果未指定，则为"default"</td>
<td>
指定结果消息处理所使用的模板
</td>
</tr>

<tr>
<td>before</td>
<td>null</td>
<td>请求前function，如果未指定，则执行模板中的before函数</td>
</tr>
<tr>
<td>error</td>
<td>null</td>
<td>失败后function，如果未指定，则执行模板中的error函数</td>
</tr>
<tr>
<td>success</td>
<td>null</td>
<td>成功后function，如果未指定，则执行模板中的success函数</td>
</tr>
<tr>
<td>complete</td>
<td>null</td>
<td>完成后function，如果未指定，则执行模板中的complete函数</td>
</tr>
<tr>
<td>templateOption</td>
<td>{}</td>
<td>
模板自定义选项，此属性完全由用户在不同的模板中根据需要自定义，详细请参考【模板选项】
</td>
</tr>
<tr>
<td>isExclusive</td>
<td>【全局设置】中的isExclusive属性</td>
<td>
true:独占请求，要想再发起同样的一个请求，必须等待上次请求结束；false:贪婪请求，不限制重复请求。 
</td>
</tr>
<tr>
<td>ajax</td>
<td>[]</td>
<td>$.ajax选项，数组的每一项代表一个ajax请求，可以有多个ajax请求。如果只有一个请求，可以不用数组，直接用{...}替代。如果没有传递此参数或数组项长度为0，则使用默认的ajax行为。默认值请参考【ajax默认选项】。</td>
</tr>
</table>

**模板选项：**
<table>
<tr>
<td>属性名</td>
<td>默认值</td>
<td>说明</td>
</tr>
<tr>
<td>name</td>
<td></td>
<td>模板名</td>
</tr>
<tr>
<td>before</td>
<td>function (ops)</td>
<td>
请求前，如果返回false，则阻止后续执行。
<br/>
ops:当前插件选项
</td>
</tr>
<tr>
<td>error</td>
<td>function (ops)</td>
<td>
失败后执行的函数。
<br/>
ops:当前插件选项
</td>
</tr>
<tr>
<td>success</td>
<td>function(ops, datas)</td>
<td>
成功后执行，datas为数组或对象。
<br/>
ops:当前插件选项
<br/>
datas:请求返回的数据，如果有多个ajax请求，则为数组，否则直接为输出的对象值。
</td>
</tr>
<tr>
<td>complete</td>
<td>function (ops)</td>
<td>完成后执行。
<br/>
ops:当前插件选项
</td>
</tr>
<tr>
<td>templateOption</td>
<td>{}</td>
<td>模板自定义选项</td>
</tr>
</table>

**ajax默认选项:**
<table>
<tr>
<td>属性名</td>
<td>默认值</td>
<td>说明</td>
</tr>
<tr>
<td>url</td>
<td>如果没有指定，则为第一个form的action,如果还没有指定，则为location.href</td>
<td>ajax请求路径</td>
</tr>
<tr>
<td>dataType</td>
<td>"JSON"</td>
<td>数据格式</td>
</tr>
<tr>
<td>type</td>
<td>"get"</td>
<td>请求方式</td>
</tr>
<tr>
<td>data</td>
<td>第一个form序列化值（jquery的serialize()方法）</td>
<td>发送的数据</td>
</tr>

</table>

# 方法
<table>
<tr>
<td>方法名</td>
<td>说明</td>
</tr>
<tr>
<td>$.XGoAjax.addTemplate(model)</td>
<td>给该插件添加一个新的模板，model请参考【模板选项】</td>
</tr>
<tr>
<td>$.XGoAjax.getAjaxList()</td>
<td>获取当前正在处理的ajax对象</td>
</tr>
<tr>
<td>$.XGoAjax.getTemplate(name)</td>
<td>根据模板名获取模板对象</td>
</tr>
<tr>
<td>$.XGoAjax.globalSettings({...})</td>
<td>本插件全局设置，可设置templateName、mode...</td>
</tr>
<tr>
<td>$.XGoAjax.getGlobalSettings()</td>
<td>获取本插件全局设置</td>
</tr>
</table>

# 基本使用示例

            /**************默认模板：*******************/

            //每次单击发出一个ajax请求（当前必须只有一个请求，独占模式）
            $("#btnSave1").on("click", function () {
                $.XGoAjax({
                    id: "btnSave1",
                    ajax: { url: "data.aspx" }
                });
            });

            //每次单击发出一个ajax请求（可以发出多个请求，贪婪模式）
            $("#btnSave2").on("click", function () {
                $.XGoAjax({
                    isExclusive: false,
                    ajax: { url: "data.aspx" }
                });
            });

            //每次单击发出多个ajax请求（当前必须只有一组请求，独占模式）
            $("#btnSave3").on("click", function () {
                $.XGoAjax({
                    id: "btnSave3",
                    ajax: [{
                        type: "get",
                        url: "data.aspx"
                    }, {
                        type: "post",
                        url: "data.aspx"
                    }]
                });
            });

            //每次单击发出多个ajax请求（可以发出多组请求，贪婪模式）
            $("#btnSave4").on("click", function () {
                $.XGoAjax({
                    isExclusive: false,
                    ajax: [{
                        type: "get",
                        url: "data.aspx"
                    }, {
                        type: "post",
                        url: "data.aspx"
                    }]
                });
            });

            /**************artdialog模板：*******************/

            //每次单击发出一个ajax请求（当前必须只有一个请求，独占模式）
            $("#btnSaveArtdialog1").on("click", function () {
                $.XGoAjax({
                    templateName: "artdialog",
                    id: "btnSaveArtdialog1",
                    ajax: { url: "data.aspx" }
                });
            });

            //每次单击发出一个ajax请求（可以发出多个请求，贪婪模式）
            $("#btnSaveArtdialog2").on("click", function () {
                $.XGoAjax({
                    templateName: "artdialog",
                    isExclusive: false,
                    ajax: { url: "data.aspx" }
                });
            });

            //每次单击发出一个ajax请求（可以发出多个请求，贪婪模式）
            $("#btnSaveArtdialog3").on("click", function () {
                $.XGoAjax({
                    templateName: "artdialog",
                    id: "btnSaveArtdialog3",
                    ajax: [{
                        type: "get",
                        url: "data.aspx"
                    }, {
                        type: "post",
                        url: "data.aspx"
                    }]
                });
            });

            //每次单击发出多个ajax请求（可以发出多组请求，贪婪模式）
            $("#btnSaveArtdialog4").on("click", function () {
                $.XGoAjax({
                    templateName: "artdialog",
                    isExclusive: false,
                    ajax: [{
                        type: "get",
                        url: "data.aspx"
                    }, {
                        type: "post",
                        url: "data.aspx"
                    }]
                });
            });


**具体Demo请参见源码中的：XGoAjax\Web\Index.html**
