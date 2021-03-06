var  Popup = (function(){
    var _this = {};
    var _host = document.location.host;
    var _ex_status = 'open';

    _this.init = function (current_url) {
        var urlArr = current_url.split("/");
        var hostname = urlArr[2];

        _this.EX = chrome.extension.getBackgroundPage().Background;
        _host = hostname;
        console.log('popup init ==> ' + _host);
        chrome.storage.local.get(['xg'], function(data){
            _ex_status = data.xg;
            _this.switch('global', _ex_status);

            if(_ex_status == 'close' ){
                _this.switch('current', _ex_status);
                return;
            }else{
                chrome.storage.local.get([_host], function(data){
                    // alert(_host + ' [popup]: ' + data[_host]);
                    if(data[_host] == 'close'){
                        _this.switch('current', 'close');
                    }else{
                        _this.switch('current', 'open');
                    }
                })
            }
        });

        chrome.storage.local.get(['style'], function(data){
            $("div[name='bg-style']").removeClass('x-selected');
            $("div[x_style='" + data.style + "']").addClass('x-selected');
        });
    }

    _this.switch = function(id, sw) {
        var target = $('#' + id);
        var old_status = target.attr('status');
        if (sw == 'open') {
            target.attr('status','open');
            target.children(".x-front").css("left", (target.children(".x-back").outerWidth() - target
                .children(".x-front").outerWidth()) + "px");
            target.children(".x-front").css("background-color", "#7ba7f7");
            target.children(".x-back").css("background-color", "#8787ec");

        } else {
            target.attr('status','close');
            target.children(".x-front").css("left", 0);
            target.children(".x-front").css("background-color", "#8f9490");
            target.children(".x-back").css("background-color", "lightgrey");
        }
    }

    return _this;
}());

$(document).ready(function () {
    try{
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            debugger
            var current_url  = tabs[0].url;
            Popup.init(current_url);
        });
    }catch(e){
        console.log(e);
    }

    $(document).on("click", "#current", function () {
        var global_status = $('#global').attr('status');
        if (global_status == 'open') {
            var next_status = $('#current').attr('status') == 'open' ? 'close' : 'open';
            Popup.switch('current', next_status);
            Popup.EX.set_current_page(next_status);
        } else {
            console.log('global_status=' + global_status + ',  so can not set open for current');
        }
    });

    $(document).on("click", "#global", function () {
        var next_status = $(this).attr('status') == 'open' ? 'close' : 'open';
        Popup.switch('global', next_status);
        Popup.EX.set_global_page(next_status);

        Popup.switch('current', next_status);
        Popup.EX.set_current_page(next_status);
    });

    $(document).on("click", "div[name='bg-style']", function () {
        $("div[name='bg-style']").removeClass('x-selected');
        $(this).addClass('x-selected');
        var x_style = $(this).attr('x_style');
        Popup.EX.set_global_style(x_style);

        var current_status = $('#current').attr('status');
        if (current_status == 'open') {
            Popup.EX.set_current_page('setx');
        }
    });

    $(document).on("click", "#x-div-bottom div", function () {
        $("#x-alipay").show();
    });
});




