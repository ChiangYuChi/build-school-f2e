import {$g,$c,$ctn} from '../Modules/helpers.js';
let today = new Date();

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let months = ['Jan', 'Feb', 'Mar', "Apr", "May", "June", "July", "Aug", "Sep", "Oct", 'Nov', 'Dec'];
let days = ['Sunday', 'Monday', 'Tuesday', 'Wedensday', 'Thursday', 'Friday', 'Saturday'];
let monthAndYear = $g('#monthAndYear');
let prev = $g('.prev');
let next = $g('.next');
let notes;


showCalendar(currentMonth,currentYear);

function showCalendar(month, year) {

let firstDay = new Date(year, month).getDay();
let daysInMonth = 32 - new Date(year, month, 32).getDate();
let tbl = $g('#calendar-body');
tbl.innerHTML = '';
monthAndYear.innerHTML=months[month]+' '+year;

let date = 1;
for (let i = 0; i < 6; i++) {
 let row = document.createElement('tr');
 for(let j=0;j<7;j++){
     if(i==0&&j<firstDay){
         let cell = $c('td');
         let cellText = $ctn('');
         cell.appendChild(cellText);
         row.appendChild(cell);
     }else if(date>daysInMonth){
         break;
     }else{
         let cell = $c('td');
   
         let cellText = $ctn(date);
         cell.classList.add('showEvent')
         if(date==today.getDate()&&year==today.getFullYear()&&month==today.getMonth()){
             cell.classList.add('bg-info');
         }
         cell.appendChild(cellText);
         row.appendChild(cell);
         date++
     }
 }
 tbl.appendChild(row);
}
} 

function showEvent(eventDate){

let storedEvents = JSON.parse(localStorage.getItem('events'));
let eventsToday = storedEvents.filter(eventsToday => eventsToday.eventDate === eventDate);
let eventsList = Object.keys(eventsToday).map(k => eventsToday[k]);
$g('.events-today').innerHTML='';

eventsList.forEach(function(event){

let div = $c('div');
div.setAttribute('class','alert alert-danger alert-dismissible fade show');
div.setAttribute('role','alert ')
let newTxt = $c('p');
newTxt.innerHTML=`${event.eventText}`;
div.appendChild(newTxt);
let btn = $c('button');
btn.setAttribute('class','close remove-event primary');
btn.setAttribute('data-event-id',`${event.id}`);
btn.setAttribute('data-dismiss','alert');
btn.setAttribute('aria-label',"Close");
let span = $c('span');
let spanText =$ctn('x');
span.appendChild(spanText);
btn.appendChild(span);

div.appendChild(btn);
$g('.events-today').appendChild(div);
})                
}


function removeEvent(id){
let storedEvents = JSON.parse(localStorage.getItem('events'));
if(storedEvents!=null){
 storedEvents=storedEvents.filter(ev=>ev.id!=id);
 localStorage.setItem('events',JSON.stringify(storedEvents));
}
}

$g('.remove-event').forEach(function(removeEvt){
removeEvt.addEventListener('click',function(){
 let eventId = this.dataset.data-event-id;
 removeEvent(eventId);
})
})


prev.addEventListener('click',function(){
currentYear = (currentMonth===0)?currentYear-1:currentYear;
currentMonth = (currentMonth===0)?11:currentMonth-1;
showCalendar(currentMonth,currentYear);
})      

next.addEventListener('click',function(){
currentYear = currentMonth===11?currentYear+1:currentYear;
currentMonth =(currentMonth+1)%12;
console.log(currentMonth);
showCalendar(currentMonth,currentYear);
});

$g('.showEvent').forEach(
function(item){
 item.addEventListener('click',function(){
   $g("#event").classList.remove("d-none");
   let todaysDate = this.innerHTML+' '+months[currentMonth]+ " "+currentYear;
   let eventDay=days[new Date(currentYear,currentMonth,this.innerHTML).getDay()];
   let eventDate = this.innerHTML+currentMonth+currentYear
   $g('.event-date').innerHTML=todaysDate;
   $g('.event-date').setAttribute('data-eventdate',`${eventDate}`);
   $g('.event-day').innerHTML=eventDay;
   showEvent(eventDate);
 })
}
)
$g('.hide').addEventListener('click',function(){
$g("#event").classList.add("d-none");
})
$g('#createEvent').addEventListener('click',function(){
let span = $c('span');
span.classList.remove('error');
$g('.form-control').classList.remove('.data-invalid');
let events = localStorage.getItem('events');
let obj=[];
if (events) {
         obj = JSON.parse(events);
     }



let eventDate = $g('.event-date').dataset.eventdate;
let eventText = $g('#eventTxt').value;
let valid = true;


// if(eventText==" "){
//     let span = $c('span');
//     let textNode = $ctn('Please enter event')
//     span.appendChild(textNode);
//     span.classList.add('error');
//     $g('.events-input').append(span);
//     $g('#eventTxt').classList.add('data-invalid');
// }else if(eventText.length<3){
//     $g('#eventTxt').classList.add('data-invalid');
//     let span = $c('span');
//     let textNode = $ctn('please enter at least three characters')
//     span.appendChild(textNode);
//     span.classList.add('error');
// }else{
//     valid = true;

// }

if(valid){
let id = 1;
if(obj.length>0){
 id = $g('.event-date').dataset.eventdate;
}else{
 id=1;
}
obj.push({
 "id":id,
 "eventDate":eventDate,
 "eventText":eventText
});
localStorage.setItem("events",JSON.stringify(obj));
showEvent(eventDate);
console.log(eventDate);
}
});
