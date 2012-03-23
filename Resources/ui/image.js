var exports = exports || this;
exports.ImageWindow = (function(global) {
    var K = function() {
    };

    var ImageWindow = function(options) {
        var self;

        if(this instanceof ImageWindow) {
            self = this;
        } else {
            self = new K();
        }
        self.item = options;
        return self;
    };

    K.prototype = ImageWindow.prototype;
    ImageWindow.prototype.createWindow = function(options) {
        var self = this;
        self.window = Ti.UI.createWindow({
            backgroundColor : '#000',
            barColor : '#666',
            title : 'Photo',
            backButtonTitle : 'List',
            tabBarHidden : true
        });
        self.window.add(Ti.UI.createImageView({
            top : 0,
            image : self.item.urls.medium_640,
            hires : true
        }));
        if(TiCloud.isLoggedIn()){
            self.like = Ti.UI.createButton({
                title : 'like',
                style : Titanium.UI.iPhone.SystemButtonStyle.BAR
            })
            self.like.addEventListener('click', function() {
                self.postReview();
            });
            self.window.rightNavButton = self.like;
        }

        var flex = Ti.UI.createButton({
            systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
        });
        self.reviewCount = Titanium.UI.createLabel({
            text : 'no',
            width : 240,
            textAlign : 'center'
        });
        self.toolbar = Ti.UI.iOS.createToolbar({
            items : [flex, self.reviewCount, flex],
            barColor : '#000',
            bottom : -44
        });
        self.window.add(self.toolbar);
        //
        self.window.addEventListener('open', function() {
            self.queryReview();
        });
        return self;
    };
    ImageWindow.prototype.queryReview = function() {
        var self = this;
        TiCloud.queryPhotoReview({
            photo_id : self.item.id
        }, function(response, meta) {
            var stars = '';
            if(response.reviews.length == 0) {
                return;
            }
            for(var i = 0; i < response.reviews.length; i++) {
                stars += '⭐';
            }
            self.reviewCount.text = stars;
            self.toolbar.animate({
                bottom : 0,
                duration : 500
            });
        });
    };

    ImageWindow.prototype.postReview = function() {
        var self = this;
        TiCloud.postPhotoReview({
            photo_id : self.item.id
        }, function(response, meta) {
            self.queryReview();
        });
    };

    return ImageWindow;
})(this);
