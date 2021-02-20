var profilebtn = document.getElementById("profilebtn");
var profilesec = document.querySelector(".setting-logout-pane");
var maintag = document.querySelector("main");
var headertag = document.querySelector("header");
var footertag = document.querySelector("footer");
var styleprofilesec = getComputedStyle(profilesec);

maintag.addEventListener("click", function() {
    if(styleprofilesec.height == "60px") {
        profilesec.style.height = "0px";
        profilesec.style.border = "0px solid #bdbdbd";
    }
})

headertag.addEventListener("click", function() {
    if(styleprofilesec.height == "60px") {
        profilesec.style.height = "0px";
        profilesec.style.border = "0px solid #bdbdbd";
    }
})

footertag.addEventListener("click", function() {
    if(styleprofilesec.height == "60px") {
        profilesec.style.height = "0px";
        profilesec.style.border = "0px solid #bdbdbd";
    }
})

function openProfileSec() {
    if(styleprofilesec.height == "0px") {
        profilesec.style.height = "60px";
        profilesec.style.border = "1px solid #bdbdbd";
    }
    else{
        profilesec.style.height = "0px";
        profilesec.style.border = "0px solid #bdbdbd";
    }
}

function openae() {
    var btnText = document.getElementById("tombolkiri");
    var isisamping = document.querySelector("aside");
    var isikanan = document.querySelector(".kumpulanbangunan")
    var sampingStyle = getComputedStyle(isisamping);
    
    if(sampingStyle.width == "0px"){
        isisamping.style.width = "275px";
        btnText.innerHTML = "←"; 
        isikanan.style.marginLeft = "275px"
        isikanan.style.marginRight = "-275px"
    }
    else{
        isisamping.style.width = "0px";
        btnText.innerHTML = "→";
        isikanan.style.display = "block"
        isikanan.style.marginLeft = "0px"
        isikanan.style.marginRight = "0px"
    }
}

function deleteBP(theID, type) {
    if(confirm("Are you sure you want to delete this item?")) {
        $.ajax({
			type: 'POST',
            async: false,
			url: "/admin/delete?id=" + theID + "&type=" + type,
			success: function() {
				location.reload();
			},
			error: function(err) {
                alert(err.responseText);
                return false
			}
        });
    }
}