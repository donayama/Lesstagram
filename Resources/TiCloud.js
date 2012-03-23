// https://github.com/aaronksaunders/Appcelerator-Cocoafish-Native-Module
// base on https://gist.github.com/2037040
var exports = exports || this;
exports.TiCloud = (function(global) {
    var K = function() {
    };

    var TiCloud = function(options) {
        var self;

        if(this instanceof TiCloud) {
            self = this;
        } else {
            self = new K();
        }

        self.loginUser = null;

        if(!options) {
            options = {};
        }


        if(Ti.Platform.name == "android") {
            self.module = require('com.ci.cocoafish').createCocoaFishMgr(options);
        } else {
            self.module = require('com.ci.cocoafish').create(options);
        }

        return self;
    };

    K.prototype = TiCloud.prototype;

    TiCloud.prototype.isLoggedIn = function() {
        var self = this;
        return (self.loginUser != null)
    };

    TiCloud.prototype.login = function(params, successCallback, errorCallback) {
        var self = this;
        self.module.apiCall({
            "baseUrl" : "users/login.json",
            "httpMethod" : "POST",
            "params" : {
                "login" : params.username,
                "password" : params.password
            },
            success : function(d) {
                var user = (JSON.parse(d.responseText)).response.users[0];
                self.loginUser = user;
                if(successCallback) {
                    successCallback(JSON.parse(d.responseText).response, JSON.parse(d.metaDataText).meta);
                }
            },
            error : function(d) {
                Ti.API.error("error is => " + d.errorText);
            }
        });
    };

    TiCloud.prototype.createUser = function(params, successCallback, errorCallback) {
        var self = this;
        if(!params || !params.username || !params.password) {
            return;
        }
        params["password_confirmation"] = params.password;

        self.module.apiCall({
            "baseUrl" : "users/create.json",
            "httpMethod" : "POST",
            "params" : params,
            success : function(d) {
                var user = (JSON.parse(d.responseText)).response.users[0];
                self.loginUser = user;
                if(successCallback) {
                    successCallback(JSON.parse(d.responseText).response, JSON.parse(d.metaDataText).meta);
                }
            },
            error : function(d) {
                Ti.API.error("error is => " + d.errorText);
                if(errorCallback) {
                    errorCallback(JSON.parse(d.errorText));
                }
            }
        });
    }

    TiCloud.prototype.uploadPhoto = function(params, successCallback, errorCallback) {
        var self = this;
        if(!params || !params.photo) {
            return;
        }
        self.module.apiCall({
            "baseUrl" : "photos/create.json",
            "httpMethod" : "POST",
            "params" : params,
            success : function(d) {
                if(successCallback) {
                    successCallback(JSON.parse(d.responseText).response, JSON.parse(d.metaDataText).meta);
                }
            },
            error : function(d) {
                Ti.API.error("error is => " + d.errorText);
                if(errorCallback) {
                    errorCallback(JSON.parse(d.errorText));
                }
            }
        });
    }

    TiCloud.prototype.queryPhotos = function(params, successCallback, errorCallback) {
        var self = this;
        if(!params) {
            params = {
                "page" : 1,
                "per_page" : 20,
                "order" : '-reviews_count,-created_at'
            };
        }
        self.module.apiCall({
            "baseUrl" : "photos/query.json",
            "httpMethod" : "GET",
            "params" : params,
            success : function(d) {
                if(successCallback) {
                    successCallback(JSON.parse(d.responseText).response, JSON.parse(d.metaDataText).meta);
                }
            },
            error : function(d) {
                Ti.API.error("error is => " + d.errorText);
                if(errorCallback) {
                    errorCallback(JSON.parse(d.errorText));
                }
            }
        });
    };

    TiCloud.prototype.queryPhotoReview = function(params, successCallback) {
        var self = this;
        if(!params.photo_id) {
            return;
        }

        self.module.apiCall({
            "baseUrl" : "reviews/query.json",
            "httpMethod" : "GET",
            "params" : params,
            success : function(d) {
                if(successCallback) {
                    successCallback(JSON.parse(d.responseText).response, JSON.parse(d.metaDataText).meta);
                }
            },
            error : function(d) {
                Ti.API.error("error is => " + d.errorText);
                alert(d.errorText);
            }
        });
    };
    TiCloud.prototype.postPhotoReview = function(params, successCallback) {
        var self = this;
        if(!params.photo_id) {
            return;
        }
        params.content = 'like';
        params.rating = 5;
        self.module.apiCall({
            "baseUrl" : "reviews/create.json",
            "httpMethod" : "POST",
            "params" : params,
            success : function(d) {
                if(successCallback) {
                    successCallback(JSON.parse(d.responseText).response, JSON.parse(d.metaDataText).meta);
                }
            },
            error : function(d) {
                Ti.API.error("error is => " + d.errorText);
                alert(d.errorText);
            }
        });
    };
    TiCloud.prototype.updatePhotoReview = function(params, successCallback) {
        var self = this;
        if(!params.photo_id) {
            return;
        }
        params.content = 'like';
        params.rating = 5;
        self.module.apiCall({
            "baseUrl" : "reviews/update.json",
            "httpMethod" : "PUT",
            "params" : params,
            success : function(d) {
                if(successCallback) {
                    successCallback(JSON.parse(d.responseText).response, JSON.parse(d.metaDataText).meta);
                }
            },
            error : function(d) {
                Ti.API.error("error is => " + d.errorText);
                alert(d.errorText);
            }
        });
    };
    return TiCloud;
})(this);
