
function Preview(){
  alert("hi");
}
  const openModalButtons = document.querySelectorAll('[data-modal-target]')
  const closeModalButtons = document.querySelectorAll('[data-close-button]')
  const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
button.addEventListener('click', () => {
const modal = document.querySelector(button.dataset.modalTarget)
openModal(modal)
})
})

overlay.addEventListener('click', () => {
const modals = document.querySelectorAll('.modal.active')
modals.forEach(modal => {
closeModal(modal)
})
})

closeModalButtons.forEach(button => {
button.addEventListener('click', () => {
const modal = button.closest('.modal')
closeModal(modal)
})
})

function openModal(modal) {
if (modal == null) return
modal.classList.add('active')
overlay.classList.add('active')
}

function closeModal(modal) {
if (modal == null) return
modal.classList.remove('active')
overlay.classList.remove('active')
}
function Test(){
var name = document.getElementById("name").value;
var mobile = document.getElementById("mobile").value
var email = document.getElementById("email").value
var reg = document.getElementById("reg").value;
var events = document.getElementById("event").value
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

const text = document.querySelector(".open-text");
const str = text.textContent;
const splitText = str.split("")
text.textContent = "";
for(let i=0; i < splitText.length;i++){
text.innerHTML += "<span>" + splitText[i] + "</span>"
}
let char = 0 ;
let timer = setInterval(onTick, 50);

function onTick(){
const span = text.querySelectorAll("span")[char];
span.classList.add("fade");
char++
if(char === splitText.length){
  complete();
  return;
}
}
function complete(){
clearInterval(timer);
timer = null;
}
