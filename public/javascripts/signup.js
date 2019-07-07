var username = document.getElementById('username');
var email = document.getElementById('email');
var password1 = document.getElementById('password1');
var password2 = document.getElementById('password2');

function InvalidMsg1(textbox) {
    let match = textbox.value.match(textbox.pattern);
    if (textbox.value == '') {
        textbox.setCustomValidity("Must be filled");
    } else if (!match) {
        textbox.setCustomValidity('Wrong Format!');
    } else {
        textbox.setCustomValidity('');
    }

}

function InvalidMsg2(textbox) {
    let match = textbox.value.match(textbox.pattern);
    if (textbox.value == '') {
        textbox.setCustomValidity("Must be filled");
    } else if (!match) {
        textbox.setCustomValidity('Wrong Format!');
    } else {
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

function InvalidMsg4(textbox) {
    if (textbox.value == '') {
        textbox.setCustomValidity("Must be filled");
    } else if (textbox.value != password1.value) {
        textbox.setCustomValidity("Not match!!");
    } else {
        textbox.setCustomValidity('');
    }

}