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
            } else {
                textbox.setCustomValidity('');
            }

        }
       /* function post(){
            var request;
            if(window.XMLHttpRequest){
				request=new XMLHttpRequest();
			}else{
				try{
					request=new ActiveObject('Microsoft.XMLHTTP');
					}
				catch(faild){
					alert('Error:Ajax request faild');
				}
            }

            if(request!=null){		
				request.onreadystatechange=function(){
					if(request.readyState==4&&request.status==200){
						document.getElementById('msg').innerText=request.responseText;
					}		
				}
				request.open('POST','/login/failed',true);
				request.send();	
			}
        }*/

