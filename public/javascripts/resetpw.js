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