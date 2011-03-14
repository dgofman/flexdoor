using System.Windows;
using System.Windows.Browser;
using System.Threading;

namespace FlexDoorSL
{
    public partial class App : Application
    {

        public App()
        {
            InitializeComponent();
            HtmlPage.RegisterScriptableObject("App", this);
        }

        [ScriptableMember]
        public void Sleep(int mlsec)
        {
            Thread.Sleep(mlsec);
        }
    }
}
