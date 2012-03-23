var exports = exports || this;
exports.MainWindow = (function(global) {
    var K = function() {
    };
    var MainWindow = function(options) {
        var self;
        if(this instanceof MainWindow) {
            self = this;
        } else {
            self = new K();
        }
        // properties
        self.photos = {};
        return self;
    };
    K.prototype = MainWindow.prototype;
    MainWindow.prototype.createWindow = function(options) {
        var self = this;
        self.window = Ti.UI.createWindow({
            barColor : '#666',
            title : 'MainWindow',
            tabBarHidden : true
        });

        var flex = Ti.UI.createButton({
            systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
        });

        self.login = Ti.UI.createButton({
            title : 'Login',
            style : Titanium.UI.iPhone.SystemButtonStyle.BAR
        });
        // Login
        self.login.addEventListener('click', function() {
            self.showLoginWindow(false);
        });
        self.signup = Ti.UI.createButton({
            title : 'SignUp',
            style : Titanium.UI.iPhone.SystemButtonStyle.BAR
        });
        // SignUp
        self.signup.addEventListener('click', function() {
            self.showLoginWindow(true);
        });

        self.toolbar = Ti.UI.iOS.createToolbar({
            items : [flex, self.login, self.signup, flex],
            barColor : '#666',
            bottom : 0
        });
        self.window.add(self.toolbar);

        // photoView
        self.photosView = Ti.UI.createScrollView({
            contentHeight : 'auto',
            showVerticalScrollIndicator : true,
            layout : 'horizontal',
            top : 0,
            bottom : 44
        });
        self.photosView.addEventListener('click', function(e) {
            var key = e.source.image;
            if(self.photos[key]) {
                var ImageWindow = require('ui/image').ImageWindow(self.photos[key]).createWindow();
                if(!TiCloud.loginUser == null) {
                    ImageWindow.showLikeButton();
                }
                App.tab.open(ImageWindow.window);
            }
        });
        self.window.add(self.photosView);

        // Camera
        self.camera = Ti.UI.createButton({
            systemButton : Ti.UI.iPhone.SystemButton.CAMERA
        });
        self.camera.addEventListener('click', function() {
            if(TiCloud.isLoggedIn == null) {
                alert('Not Logged in...');
                return;
            }
            var options = Titanium.UI.createOptionDialog({
                options : ['Camera', 'Photos', 'Cancel'],
                cancel : 2,
                title : 'Select'
            });
            options.addEventListener('click', function(e) {
                var opts = {
                    success : function(event) {
                        TiCloud.uploadPhoto({
                            photo : event.media
                        }, function(response, meta) {
                            self.window.fireEvent('photoUploaded', {});
                        }, null);
                    },
                    error : function(error) {
                    },
                    cancel : function() {
                    },
                    mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
                };
                if(e.index === 0) {
                    Titanium.Media.openPhotoGallery(opts);
                } else if(e.index === 1) {
                    Titanium.Media.openPhotoGallery(opts);
                }
            });
            options.show();
        });
        self.window.rightNavButton = self.camera;

        self.window.addEventListener('photoUploaded', function() {
            setTimeout(function() {
                self.updatePhotosView()
            }, 20000);
        });

        return self;
    };
    MainWindow.prototype.updatePhotosView = function() {
        var self = this;
        TiCloud.queryPhotos(null, function(response, meta) {
            self.photos = {};
            response.photos.forEach(function(item) {
                if(item.processed) {
                    self.photos[item.urls.thumb_100] = item;
                    self.photosView.add(Ti.UI.createImageView({
                        image : item.urls.thumb_100,
                        width : 100,
                        height : 100
                    }));
                }
            });
        }, null);
    };
    MainWindow.prototype.hideToolbar = function() {
        var self = this;
        self.toolbar.animate({
            bottom : -44,
            duration : 500
        }, function() {
            self.photosView.bottom = 0;
        });
    };
    MainWindow.prototype.showLoginWindow = function(isSignup) {
        var self = this;
        var LoginWindow = require('ui/login').LoginWindow().createWindow({
            title : ( isSignup ? 'SignUp' : 'Login')
        });
        LoginWindow.login.addEventListener('click', function() {
            if(isSignup) {
                TiCloud.createUser({
                    username : LoginWindow.username.value,
                    password : LoginWindow.password.value
                }, function(response, meta) {
                    var user = response.users[0];
                    LoginWindow.window.close();
                    self.hideToolbar();
                }, null);

            } else {
                TiCloud.login({
                    username : LoginWindow.username.value,
                    password : LoginWindow.password.value
                }, function(response, meta) {
                    var user = response.users[0];
                    LoginWindow.window.close();
                    self.hideToolbar();
                }, null);

            }
        });
        LoginWindow.open();
    };

    return MainWindow;
})(this);
