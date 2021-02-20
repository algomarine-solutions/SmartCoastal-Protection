function backtodashbtn() {
    if(confirm("All progress will be lost. Proceed?")) {
        return location.assign("/admin/home");
    }
}

var questionList = document.getElementsByClassName("pertanyaanBaru");
var pertanyaanList = document.getElementsByClassName("pertanyaan");
var jawabanList = document.getElementsByClassName("jawaban");
var olList = document.getElementsByClassName("ol2");

function addQuestionFunc() {
    var newQuestion = document.createElement("li");
    var elementList1 = questionList.length + 1;
    var list1 = pertanyaanList.length + 1;
    var urutanList = olList.length + 1;
    newQuestion.className = "pertanyaanBaru";
    newQuestion.id =  elementList1 + ".pertanyaanBaru";

    newQuestion.innerHTML = '<article class="question">' +
                                '<input class="pertanyaan" type="text" name="'+ list1 +'.pertanyaan" placeholder="Tuliskan Pertanyaannya" required>' +
                            '</article>' +
                            '<ol class="ol2" id="'+ urutanList +'.ol2" type="a">' +
                                
                            '</ol>' +
                            '<div id="add-answer" class="add-answer">' +
                                '<button type="button" class="addAnswerbtn" onclick="addAnswerFunc('+ urutanList +')">Add Answer</button>' +
                                '<button type="button" class="delAnswerbtn" onclick="deleteAnswerFunc('+ urutanList +')">Delete Answer</button>' +
                            '</div>';

    var questionGroup = document.getElementById("ol1");
    questionGroup.appendChild(newQuestion);
}

function deleteQuestionFunc() {
    var willBeRemoved1 = document.getElementById(String(questionList.length) + ".pertanyaanBaru");
    var questionGroup = document.getElementById("ol1");
    if(willBeRemoved1 !== null) {
        questionGroup.removeChild(willBeRemoved1);
    }
}

var answerList = document.getElementsByClassName("jawabanBaru");

function addAnswerFunc(add) {
    var newAnswer = document.createElement("li");
    var elementList = document.getElementById(add + ".ol2").getElementsByTagName("li");
    var list2 = elementList.length + 1;
    newAnswer.className = "jawabanBaru";
    newAnswer.id = add + ".jawabanBaru";

    $.ajax({
        type: 'POST',
        async: false,
        url: "/admin/getitems",
        success: function(data) {
            var bw = "";
            var sw = "";
            var gro = "";
            var jet = "";
            var lain = "";

            for(i = 0; i < (data["breakwater"].length / 2); i++) {
                var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["breakwater"][2*i] + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["breakwater"][2*i] + `"><label for="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["breakwater"][2*i] + `" class="tulisan2">` + data["breakwater"][2*i + 1] + `</label><br>`;
                bw += bantai;
            }

            for(i = 0; i < (data["seawall"].length / 2); i++) {
                var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["seawall"][2*i] + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["seawall"][2*i] + `"><label for="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["seawall"][2*i] + `" class="tulisan2">` + data["seawall"][2*i + 1] + `</label><br>`;
                sw += bantai;
            }
            for(i = 0; i < (data["groin"].length / 2); i++) {
                var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["groin"][2*i] + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["groin"][2*i] + `"><label for="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["groin"][2*i] + `" class="tulisan2">` + data["groin"][2*i + 1] + `</label><br>`;
                gro += bantai;
            }
            for(i = 0; i < (data["jetty"].length / 2); i++) {
                var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["jetty"][2*i] + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["jetty"][2*i] + `"><label for="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["jetty"][2*i] + `" class="tulisan2">` + data["jetty"][2*i + 1] + `</label><br>`;
                jet += bantai;
            }
            for(i = 0; i < (data["other"].length / 2); i++) {
                var bantai = `<input class="choose" id="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["other"][2*i] + `" type="checkbox" name="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["other"][2*i] + `"><label for="` + add + `.` + String.fromCharCode(96 + list2) +`.` + data["other"][2*i] + `" class="tulisan2">` + data["other"][2*i + 1] + `</label><br>`;
                lain += bantai;
            }
            newAnswer.innerHTML = `<input class="jawaban" type="text" name="` + add + `.` + String.fromCharCode(96 + list2) +`.jawaban" placeholder="Tuliskan karakteristik" required>
                                        <p class="tulisan1">Breakwater</p>
                                        ` + bw + `

                                        <p class="tulisan1">Jetty</p>
                                        ` + jet + `

                                        <p class="tulisan1">Groin</p>
                                        ` + gro + `

                                        <p class="tulisan1">Seawall</p>
                                        ` + sw + `

                                        <p class="tulisan1">Lainnya</p>
                                        ` + lain;

            var answerGroup = document.getElementById(add +".ol2");
            answerGroup.appendChild(newAnswer);
        },
        error: function(err) {
            alert(err.responseText);
            return false
        }
    });
}

function deleteAnswerFunc(add) {
    var answerGroup = document.getElementById(add + ".ol2");
    var willBeRemoved2 = document.getElementById(add + ".ol2").getElementsByTagName("li");
    if(willBeRemoved2.length !== 0) {
        answerGroup.removeChild(answerGroup.lastChild);
    }
}

function formcheck() {
    var squestion = document.querySelectorAll(".pertanyaanBaru");
    var njawaban = 0;
    var decek = 0;

    if(squestion.length !== 0) {
        squestion.forEach(function(data) {
            njawaban = 0;
            njawaban += data.children[1].childElementCount;
            if(njawaban !== 0) {
                for(i = 0; i < data.children[1].children.length; i++) {
                    var fos = data.children[1].children[i];
                    var dacheck = false;
                    for(a = 0; a < fos.children.length; a++) {
                        var assd = fos.children[a];
                        if(dacheck === false && assd.checked === true) {
                            dacheck = true;
                        }
                    }
                    if(dacheck === false) {
                        decek = 1;
                    }
                }
            }
        })
    }

    if(squestion.length === 0) {
        alert("At least there is 1 question !");
        return false
    }
    else if(njawaban === 0) {
        alert("There is a question with missing answer !");
        return false
    }
    else if(decek !== 0) {
        alert("At least 1 checklist in an answer !");
        return false
    }
    else if(confirm('All questions will be saved and publish. Proceed?')) {
       return true
    }
    else {
        return false
    }
}