let password=document.getElementById('password');
let newpassword1=document.getElementById('newpassword1');
let newpassword2=document.getElementById('newpassword2');
let email=document.getElementById('email');
let emailarea=document.getElementById('emailarea');
let iconarea=document.getElementById('iconarea');
function InvalidMsg1(textbox) {
    if (textbox.value == '') {
        textbox.setCustomValidity("Must be filled");
    } else {
        textbox.setCustomValidity('');
    }

}
function InvalidMsg2(textbox) {
    if (textbox.value == '') {
        textbox.setCustomValidity("Must be filled");
    } 
    else if(newpassword1.value!=newpassword2.value){
        textbox.setCustomValidity("Not Match");
    }
    else {
        textbox.setCustomValidity('');
    }

}

function InvalidMsg3(textbox) {
    let match = textbox.value.match(textbox.pattern);
    if (textbox.value == '') {
        textbox.setCustomValidity("Must be filled");
    } else if (!match) {
        textbox.setCustomValidity('Wrong Format!');
    } else {
        textbox.setCustomValidity('');
    }

}

function editprofileemail(){
  var previous=email.innerHTML;

    emailarea.innerHTML='  <form action="/users/email" method="post"><input class="inputprofile" name="email"   oninput="InvalidMsg3(this);" oninvalid="InvalidMsg2(this);" pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{3,4}$" value='+previous+'></br></br>  <input type="submit" class="submitprofile" value="Update"></button></form>'
     
}

function editprofileicon(){
  iconarea.innerHTML= '<form action="/users/icon" method="post" enctype="multipart/form-data"> <div><center><div onclick="selecticon()" class="submitprofile">Select</div></center><input name="usericon"id="files" style="visibility:hidden" type="file" onchange="showiconname(this.id)"></div><span id="iconname"></span></br>  <input type="submit" class="submitprofile" value="Upload"></form><a href="/users/dashboard?act=profile"><button class="cancelprofile">Cancel</button></a>'
}
  
function selecticon(){
document.getElementById('files').click();
}

function showiconname(x){
    let filename=document.getElementById(x).value;
    document.getElementById('iconname').innerHTML=filename;
}

let high=document.getElementById('highestscore');
var score = 0;
let highestscore=high.innerHTML;
        var t1;
        var t2;
        var timecount;
        var blockcount;
        var start=0;
       document.getElementById('bomb').volume=0.4;
       document.getElementById('laugh').volume=0.6;
        function startfunction() {
            document.getElementById('backgroundmusic').load();
            document.getElementById('backgroundmusic').play();
            timerfunction();
            blockfunction();
            start=1;
        }

        function resetfunction() {
            clearInterval(timecount);
            t1 = 60;
            clearInterval(blockcount);
            document.getElementById('time').innerHTML = t1;
            score = 0;
            document.getElementById('score').innerHTML = score;
            allblockreset();
            allblockshow();
            start=0;
            document.getElementById('backgroundmusic').pause();
        }

        function timerfunction() {
            clearInterval(timecount);
            t1 = 60;
            timecount = setInterval(function () {
                t1 = t1 - 1;
                document.getElementById('time').innerHTML = t1;
                if (t1 <= 0) {
                    clearInterval(timecount);
                    document.getElementById('time').innerHTML='60';
                    start=0;
                    document.getElementById('backgroundmusic').pause();
                }
            }, 1000);
        }

        function blockfunction() {
            clearInterval(blockcount);
            score=0;
            document.getElementById('score').innerHTML = score;
            blockcount = setInterval(function () {
                var x = Math.floor(Math.random() * 9);
                if (x == 0) {
                    allblockreset();
                    document.getElementById('block1').style.visibility = 'visible';
                    document.getElementById('laugh').load();
                    document.getElementById('laugh').play();
                }
                if (x == 1) {
                    allblockreset();
                    document.getElementById('block2').style.visibility = 'visible';
                    document.getElementById('laugh').load();
                    document.getElementById('laugh').play();
                }
                if (x == 2) {
                    allblockreset();
                    document.getElementById('block3').style.visibility = 'visible';
                    document.getElementById('laugh').load();
                    document.getElementById('laugh').play();
                }
                if (x == 3) {
                    allblockreset();
                    document.getElementById('block4').style.visibility = 'visible';
                    document.getElementById('laugh').load();
                    document.getElementById('laugh').play();
                }
                if (x == 4) {
                    allblockreset();
                    document.getElementById('block5').style.visibility = 'visible';
                    document.getElementById('laugh').load();
                    document.getElementById('laugh').play();
                }
                if (x == 5) {
                    allblockreset();
                    document.getElementById('block6').style.visibility = 'visible';
                    document.getElementById('laugh').load();
                    document.getElementById('laugh').play();
                }
                if (x == 6) {
                    allblockreset();
                    document.getElementById('block7').style.visibility = 'visible';
                    document.getElementById('laugh').load();
                    document.getElementById('laugh').play();
                }
                if (x == 7) {
                    allblockreset();
                    document.getElementById('block8').style.visibility = 'visible';
                    document.getElementById('laugh').load();
                    document.getElementById('laugh').play();
                }
                if (x == 8) {
                    allblockreset();
                    document.getElementById('block9').style.visibility = 'visible';
                    document.getElementById('laugh').load();
                    document.getElementById('laugh').play();
                }
                if (t1 <= 0) {
                    clearInterval(blockcount);
                    if(score>highestscore){
                        highestscore=score;
                        document.getElementById('highestscore').innerHTML=highestscore;
                        save();
                    }
                    allblockreset();
                    allblockshow();
                }
            }, 700);
        }

        function save(){
         let save =document.createElement('form');
         let playerdata=document.createElement('input');
         save.action="/users/game";
         save.method="post";
         save.style.display='none';
         playerdata.name='highestscore';
         playerdata.value=highestscore;
         save.appendChild(playerdata);
         document.body.appendChild(save);
         save.submit();
         document.body.removeChild(save);
        }

        function allblockreset() {
            document.getElementById('area1').innerHTML =
                '<div id="block1" onclick="molefunction(this)" class="block"><img src="../images/blackmole.png" style="width:200px;height:200px"></div>'
            document.getElementById('area2').innerHTML =
                '<div id="block2" onclick="molefunction(this)" class="block"><img src="../images/blackmole.png" style="width:200px;height:200px"></div>'
            document.getElementById('area3').innerHTML =
                '<div id="block3" onclick="molefunction(this)" class="block"><img src="../images/blackmole.png" style="width:200px;height:200px"></div>'
            document.getElementById('area4').innerHTML =
                '<div id="block4" onclick="molefunction(this)" class="block"><img src="../images/blackmole.png" style="width:200px;height:200px"></div>'
            document.getElementById('area5').innerHTML =
                '<div id="block5" onclick="molefunction(this)" class="block"><img src="../images/blackmole.png" style="width:200px;height:200px"></div>'
            document.getElementById('area6').innerHTML =
                '<div id="block6" onclick="molefunction(this)" class="block"><img src="../images/blackmole.png" style="width:200px;height:200px"></div>'
            document.getElementById('area7').innerHTML =
                '<div id="block7" onclick="molefunction(this)" class="block"><img src="../images/blackmole.png" style="width:200px;height:200px"></div>'
            document.getElementById('area8').innerHTML =
                '<div id="block8" onclick="molefunction(this)" class="block"><img src="../images/blackmole.png" style="width:200px;height:200px"></div>'
            document.getElementById('area9').innerHTML =
                '<div id="block9" onclick="molefunction(this)" class="block"><img src="../images/blackmole.png" style="width:200px;height:200px"></div>'

            document.getElementById('block1').style.visibility = 'hidden';
            document.getElementById('block2').style.visibility = 'hidden';
            document.getElementById('block3').style.visibility = 'hidden';
            document.getElementById('block4').style.visibility = 'hidden';
            document.getElementById('block5').style.visibility = 'hidden';
            document.getElementById('block6').style.visibility = 'hidden';
            document.getElementById('block7').style.visibility = 'hidden';
            document.getElementById('block8').style.visibility = 'hidden';
            document.getElementById('block9').style.visibility = 'hidden';
        }

        function allblockshow() {
            document.getElementById('block1').style.visibility = 'visible';
            document.getElementById('block2').style.visibility = 'visible';
            document.getElementById('block3').style.visibility = 'visible';
            document.getElementById('block4').style.visibility = 'visible';
            document.getElementById('block5').style.visibility = 'visible';
            document.getElementById('block6').style.visibility = 'visible';
            document.getElementById('block7').style.visibility = 'visible';
            document.getElementById('block8').style.visibility = 'visible';
            document.getElementById('block9').style.visibility = 'visible';
        }

        function molefunction(obj) {
            if(start==1){
            document.getElementById('bomb').load();
            document.getElementById('bomb').play();
            obj.innerHTML = '<img src="../images/whack.png" style="width:200px;height:200px">'
            score++;
           
            document.getElementById('score').innerHTML = score;}
        }