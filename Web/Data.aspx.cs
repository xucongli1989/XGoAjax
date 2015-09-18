using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Web
{
    public partial class Data : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            System.Threading.Thread.Sleep(3000);
            Response.Clear();
            Response.Write(@"{ ""IsSuccess"": true,""Message"": ""保存成功！""}");
            Response.End();
        }
    }
}