function turuneuy() {
    var atas = document.querySelector(".tolonglah");
    var atasStyle = getComputedStyle(atas);
    
    if(atasStyle.height == "0px"){
        atas.style.height = "187px";
    }
    else{
        atas.style.height = "0px";
    }
}
window.onscroll = changePos;
        function changePos() {
            var navbar = document.querySelector(".semuaheader");
            var screenSmartStyle = getComputedStyle(navbar);
            if(screenSmartStyle.display == "block") {
                var smartOffset = 0;
            }
            else {
                var smartOffset = 17;
            }
            if (window.pageYOffset > 130) {
                navbar.style.position = "absolute";
                navbar.style.top = (pageYOffset - smartOffset) + "px";
            } else {
                navbar.style.position = "";
                navbar.style.top = "";
            }
        }