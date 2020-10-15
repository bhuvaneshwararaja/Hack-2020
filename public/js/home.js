
$(window).load(function() {
$(".se-pre-con").fadeOut("slow");;
});

AOS.init();
$(document).ready(function(){
SNButton.init("mybtn",{
fields: ["name", "contact", "email", "regtype", "eventtype", "ticket"],
enabletext: "Register",
disabletext: "submit"
})
SNButton.init("mybtn1", {
fields: ["email1", "text1"],
enabletext: "Ask",
disabletext: "Ask"
})

$(window).scroll(function(){
var scroll = $(window).scrollTop();
if(scroll > 675){
$("header").css("background", "rgba(0, 0, 0, 0.5)");
$(".nav-links a").css("color", "white")
  $(".logo-container a").css("color", "white")

}
else{
$("header").css("background", "transparent");
$(".nav-links a").css("color", "white");
$(".logo-container a").css("color", "white")
$("header").css("box-shadow", "none")
}
})
})

function GetDisplay(){
var name = document.getElementById("name").value;
var mobile = document.getElementById("contact").value
var email = document.getElementById("email").value
var reg = document.getElementById("regtype").value;
var events = document.getElementById("eventtype").value
var ticket = document.getElementById("ticket").value
document.getElementById("name_value").innerHTML = name;
document.getElementById("contact_value").innerHTML = mobile;
document.getElementById("email_value").innerHTML = email;

document.getElementById("reg_value").innerHTML = reg;
document.getElementById("event_value").innerHTML = events;
document.getElementById("ticket_value").innerHTML = ticket;

}
function showImage(){
if(this.files && this.files[0]){
var obj = new FileReader();
obj.onload = function(data){
  var image = document.getElementById("image");
  image.src = data.target.result;

}
obj.readAsDataURL(this.files[0]);
}
}
function Test(){
  if(document.getElementById("name").value = ""){
    alert("please fill the form first");
  }
}
