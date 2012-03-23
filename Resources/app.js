// TiCloud initialize
var TiCloud = require('TiCloud').TiCloud(require('credentials').OAuth);
// UI Build
var MainWindow = require('ui/main').MainWindow().createWindow();
var App = {
    tabGroup : Titanium.UI.createTabGroup(),
    tab : Titanium.UI.createTab({
        title : 'Photos',
        window : MainWindow.window
    })
};
App.tabGroup.addTab(App.tab);
App.tabGroup.addEventListener('open',function(){
    MainWindow.updatePhotosView();
});
App.tabGroup.open();

