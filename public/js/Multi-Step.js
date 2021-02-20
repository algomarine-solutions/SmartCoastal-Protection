var progress = document.getElementById("progress");
var progresstext = document.getElementById("prog-text");
var kolberg = getComputedStyle(progress);
var total = document.querySelectorAll(".form");
var newwidth = 100 / total.length;
progress.style.width = String(newwidth) + "%";
var prostatus = newwidth;
progresstext.innerText = String(Math.round(prostatus)) + "%";

function nextfunc(val) {
    var Form1 = document.getElementById("Form" + String(val));
    var Form2 = document.getElementById("Form" + String(parseInt(val) + 1));

    Form1.style.left = "-450px";
    Form2.style.left = "40px";
    prostatus += newwidth;
    progress.style.width = String(prostatus) + "%";
    progresstext.innerText = String(Math.round(prostatus)) + "%";
}

function backfunc(val) {
    var Form1 = document.getElementById("Form" + String(parseInt(val) - 1));
    var Form2 = document.getElementById("Form" + String(val));

    Form1.style.left = "40px";
    Form2.style.left = "450px";
    prostatus -= newwidth;
    progress.style.width = String(prostatus) + "%";
    progresstext.innerText = String(Math.round(prostatus)) + "%";
}

function formcheck() {
    var dewaban = document.querySelectorAll(".choose");
    var valid = 1;
    dewaban.forEach(function(dareta) {
        var form = document.forms["quiz-form"][dareta.getAttribute("name")].value;
        if(form === "") {
            valid = 0;
        }
    })

    if(valid === 0) {
        alert("Terdapat jawaban yang kosong !")
    }
}