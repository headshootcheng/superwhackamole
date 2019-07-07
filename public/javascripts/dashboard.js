function openNav() {
    document.getElementById("mySidenav").style.width = "10%";
    document.getElementById("main").style.marginLeft = "10%";
  }

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";

  }
  window.onclick = function (event) {
    if ((event.target == document.getElementById("main")||event.target == document.getElementById("topbar") )&& document.getElementById("main").style.marginLeft ==
      "10%") {
      closeNav();
    }
  }