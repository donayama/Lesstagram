var exports = exports || this;
exports.LoginWindow = (function(global) {
    var K = function() {
    };

    var LoginWindow = function(options) {
        var self;

        if(this instanceof LoginWindow) {
            self = this;
        } else {
            self = new K();
        }
        return self;
    };

    K.prototype = LoginWindow.prototype;
    LoginWindow.prototype.createWindow = function(options) {
        var self = this;
        self.window = Ti.UI.createWindow({
            backgroundColor : '#000',
            barColor : '#000',
            title : 'Login',
            tabBarHidden : true
        });
        if(options.title) {
            self.window.title = options.title;
        }

        self.username = Ti.UI.createTextField({
            height : 35,
            top : 10,
            left : 40,
            width : 240,
            hintText : 'mailaddress',
            keyboardType : Ti.UI.KEYBOARD_DEFAULT,
            returnKeyType : Ti.UI.RETURNKEY_DEFAULT,
            borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
        });
        self.password = Ti.UI.createTextField({
            height : 35,
            top : 70,
            left : 40,
            width : 240,
            hintText : 'password',
            passwordMask : true,
            keyboardType : Ti.UI.KEYBOARD_DEFAULT,
            returnKeyType : Ti.UI.RETURNKEY_DEFAULT,
            borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
        });
        self.login = Ti.UI.createButton({
            title : 'Enter',
            height : 35,
            top : 120,
            left : 40,
            width : 240
        });

        self.window.add(self.username);
        self.window.add(self.password);
        self.window.add(self.login);

        self.cancel = Ti.UI.createButton({
            systemButton : Ti.UI.iPhone.SystemButton.CANCEL
        });
        self.cancel.addEventListener('click', function() {
            self.window.close();
        });
        self.window.leftNavButton = self.cancel;
        return self;
    }

    LoginWindow.prototype.open = function() {
        var self = this;
        self.window.open({
            modal : true,
            modalTransitionStyle : Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle : Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN
        });

    };

    return LoginWindow;
})(this);
