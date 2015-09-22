# XGoAjax简介
统一对ajax请求的结果进行处理，包括消息提示、错误处理等操作，这样可以保证我们的项目有一个统一的风格，同时也简化了大量的代码。
#属性
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
<td>mode</td>
<td>"exclusive"</td>
<td>默认请求模式</td>
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
<td></td>
<td>发起请求的标识，可以随意指定，主要是便于判断该请求为同一类型的操作。比如，一个按钮来触发一个或一组ajax请求，就可以通过指定的id来判断这个按钮上一次触发的请求是否已执行完毕</td>
</tr>
<tr>
<td>templateName</td>
<td>【全局设置】中的templateName属性</td>
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
<td>mode</td>
<td>【全局设置】中的mode属性</td>
<td>
请求模式，exclusive：独占请求，要想再发起同样的一个请求，必须等待上次请求结束。；greedy：贪婪请求，不限制重复请求
</td>
</tr>
<tr>
<td>ajax</td>
<td>[]</td>
<td>$.ajax选项，数组的每一项代表一个ajax请求，可以有多个ajax请求。默认值请参考【ajax默认选项】</td>
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
成功后执行，datas为数组。
<br/>
ops:当前插件选项
<br/>
datas:请求返回的数据
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
<td>null</td>
<td>发送的数据</td>
</tr>

</table>

#方法
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

#基本使用示例
- 每次单击发出一个ajax请求（当前必须只有一个请求，独占模式）

        $.XGoAjax({
            id: "btnSave1",
            ajax: [{
                url: "data.aspx"
            }]
        });

- 每次单击发出一个ajax请求（可以发出多个请求，贪婪模式）

        $.XGoAjax({
            id: "btnSave2",
            mode: "greedy",
            ajax: [{
                url: "data.aspx"
            }]
        });

- 每次单击发出多个ajax请求（当前必须只有一组请求，独占模式）

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

- 每次单击发出多个ajax请求（可以发出多组请求，贪婪模式）

        $.XGoAjax({
            id: "btnSave4",
            mode: "greedy",
            ajax: [{
                type: "get",
                url: "data.aspx"
            }, {
                type: "post",
                url: "data.aspx"
            }]
        });