async function createCK(classname) {
    return ClassicEditor
    .create( document.querySelector(String(classname)), {
        
        toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'fontSize',
                'superscript',
                'fontColor',
                'link',
                'bulletedList',
                'numberedList',
                'fontFamily',
                'strikethrough',
                'underline',
                '|',
                'alignment',
                'indent',
                'outdent',
                '|',
                'imageInsert',
                'imageUpload',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'undo',
                'redo'
            ]
        },
        language: 'en',
        image: {
            toolbar: [
                'imageTextAlternative',
                'imageStyle:full',
                'imageStyle:side'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableCellProperties'
            ]
        },
        ckfinder: {
            uploadUrl: '/uploadimage',
            options: {
                resourceType: 'Images'
            }
        },
        licenseKey: '',
        
    } )
    .then( editor => {
        return editor;
    } )
    .catch( error => {
        console.error( 'Oops, something went wrong!' );
        console.error( 'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:' );
        console.warn( 'Build id: j4olyq2ifx8d-cja1878so7zv' );
        console.error( error );
    } );
}
var isides; var isiteo; var isikk; var isicara;
createCK('.isideskripsi')
.then(function(edtor) {
    isides = edtor;
});
createCK('.isiteori')
.then(function(edtor) {
    isiteo = edtor;
});
createCK('.isikk')
.then(function(edtor) {
    isikk = edtor;
});
createCK('.isicara')
.then(function(edtor) {
    isicara = edtor;
});

function readmorefunction() {
    var btnText = document.getElementById("readmorebtn");
    var isiatas = document.querySelector(".yangdihide");
    var isiStyle = getComputedStyle(isiatas);
    if(isiStyle.height == "0px"){
        isiatas.style.height = "430px"
        btnText.innerHTML = "Read less"; 
    }
    else{
        isiatas.style.height = "0px";
        btnText.innerHTML = "Read more";
    }
}

function bukadeskripsi() {
    var des = document.querySelector(".deskripsi");
    var teo = document.querySelector(".teori");
    var kel = document.querySelector(".kk");
    var car = document.querySelector(".cara");
  
    if (des.style.display = "none") {
      des.style.display = "block";
      teo.style.display = "none";
      kel.style.display = "none";
      car.style.display = "none";
    } 
    else {
      des.style.display = "block";
    }
}

function bukateori() {
    var des = document.querySelector(".deskripsi");
    var teo = document.querySelector(".teori");
    var kel = document.querySelector(".kk");
    var car = document.querySelector(".cara");

    if (teo.style.display = "block") {
        des.style.display = "none";
        teo.style.display = "block";
        kel.style.display = "none";
        car.style.display = "none";
    } 
    else{
        teo.style.display = "block"
    }
}

function bukakk() {
    var des = document.querySelector(".deskripsi");
    var teo = document.querySelector(".teori");
    var kel = document.querySelector(".kk");
    var car = document.querySelector(".cara");

    if (kel.style.display = "none") {
        des.style.display = "none";
        teo.style.display = "none";
        kel.style.display = "block";
        car.style.display = "none";
    } 
    else {
        kel.style.display = "block";
    }
}

function bukacara() {
    var des = document.querySelector(".deskripsi");
    var teo = document.querySelector(".teori");
    var kel = document.querySelector(".kk");
    var car = document.querySelector(".cara");

    if (car.style.display = "none") {
        des.style.display = "none";
        teo.style.display = "none";
        kel.style.display = "none";
        car.style.display = "block";
    } 
    else {
        car.style.display = "block";
    }
}

var isinya = document.querySelector(".isian");
menuStyle = getComputedStyle(isinya);
function turuneuy(){
    if(menuStyle.height == "0px"){
        isinya.style.height = "240px"
    }
    else{
        isinya.style.height = "0px";
    }
}

function backtodashbtn() {
    if(confirm("All progress will be lost. Proceed?")) {
        return location.assign("/admin/home");
    }
}

var file;
function getFile(pict) {
    file = pict;
}

function formcheck() {
    var newID            = '';
    var characters       = 'ABCYZ123abFmnop5678DEGHQRSTUVcdJKLe456fghijkOP0123rstuvwxWX789lqyzIMN49';
    var charactersLength = characters.length;
    for ( var i = 0; i < 16; i++ ) {
        newID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    document.getElementById("tambahbangunanform").action = "/admin/tambahbp?id=" + newID;

    if(isiteo.getData() === "") {
        alert("'Teori dan Konsep' masih kosong")
        return false
    }
    else if(isides.getData() === "") {
        alert("'Deskripsi' masih kosong")
        return false
    }
    else if(isikk.getData() === "") {
        alert("'Kelebihan Kekurangan' masih kosong")
        return false
    }
    else if(isicara.getData() === "") {
        alert("'Cara Pembangunan' masih kosong")
        return false
    }
    else if(confirm("All data will be saved and published. Proceed?")) {
        var data = new FormData();
        jQuery.each(jQuery('#gambar')[0].files, function(i, ffile) {
            data.append(file.name, ffile);
        });

        $.ajax({
			type: 'POST',
            async: false,
            cache: false,
            contentType: false,
            processData: false,
			url: "/admin/addbppic?id=" + newID,
			data: data,
			success: function() {
				document.getElementById("tambahbangunanform").submit();
			},
			error: function(err) {
                alert(err.responseText);
                return false
			}
        });

        return false
    }
    else {
        return false
    }
}

function formcheckEdit(ket) {
    if(isiteo.getData() === "") {
        alert("'Teori dan Konsep' masih kosong")
        return false
    }
    else if(isides.getData() === "") {
        alert("'Deskripsi' masih kosong")
        return false
    }
    else if(isikk.getData() === "") {
        alert("'Kelebihan Kekurangan' masih kosong")
        return false
    }
    else if(isicara.getData() === "") {
        alert("'Cara Pembangunan' masih kosong")
        return false
    }
    else if(confirm("All data will be saved and published. Proceed?")) {
        var data = new FormData();
        jQuery.each(jQuery('#gambar')[0].files, function(i, ffile) {
            data.append(file.name, ffile);
        });

        if(jQuery('#gambar')[0].files.length !== 0) {
            $.ajax({
                type: 'POST',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                url: "/admin/addbppic?id=" + ket,
                data: data,
                success: function() {
                    document.getElementById("tambahbangunanform").submit();
                },
                error: function(err) {
                    alert(err.responseText);
                    return false
                }
            })

            return false
        }
        else {
            return true
        }
    }
    else {
        return false
    }
}