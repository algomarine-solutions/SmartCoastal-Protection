var teori = document.getElementById("kontenteori")
var deskripsi = document.getElementById("kontendeskripsi")
var kk = document.getElementById("kontenkk")
var cara = document.getElementById("kontencara")

function bukateori(){
    if(teori.style.display="block"){
        teori.style.display="block";
        deskripsi.style.display="none";
        kk.style.display="none";
        cara.style.display="none"
    }
    else{
        teori.style.display="block";
    }
}
function bukadeskripsi(){
    if(deskripsi.style.display="none"){
        teori.style.display="none";
        deskripsi.style.display="block";
        kk.style.display="none";
        cara.style.display="none"
    }
    else{
        deskripsi.style.display="block";
    }
}
function bukakk(){
    if(kk.style.display="none"){
        teori.style.display="none";
        deskripsi.style.display="none";
        kk.style.display="block";
        cara.style.display="none"
    }
    else{
        kk.style.display="block";
    }
}
function bukacara(){
    if(cara.style.display="none"){
        teori.style.display="none";
        deskripsi.style.display="none";
        kk.style.display="none";
        cara.style.display="block"
    }
    else{
        cara.style.display="block";
    }
}

var isinya = document.querySelector(".tombolbaru");
menuStyle = getComputedStyle(isinya);
function turunyok(){
    if(menuStyle.height == "0px"){
        isinya.style.height = "120px"
    }
    else{
        isinya.style.height = "0px";
    }
}

function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
}

var videolist = document.querySelectorAll(".media oembed");
videolist.forEach(function(devideo) {
    var videoId = getId(devideo.getAttribute("url"));
    devideo.innerHTML = '<iframe style="width: 100%; height: 35vw" src="//www.youtube.com/embed/' 
    + videoId + '" frameborder="0" allowfullscreen></iframe>';
})