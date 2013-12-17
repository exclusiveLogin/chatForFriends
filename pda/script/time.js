$(document).ready(function(){
    timeStart();
    })

function time(){	
	var date_and_time = new Date();
	var day = date_and_time.getDate();
	if(day<=9){day = '0'+day}
	else;
	var month=date_and_time.getMonth();
	if(month<=9){
		month++;
		month = '0'+month;}
	else;
	var hours = date_and_time.getHours();
	if(hours<=9){hours = '0'+hours}
	else;
	var minutes=date_and_time.getMinutes();
	if(minutes<=9){minutes='0'+minutes}
	else;
	var seconds=date_and_time.getSeconds();
	if(seconds<=9){seconds='0'+seconds}
	else;
	Global.day = day;
	Global.month = month;
	Global.year = date_and_time.getFullYear();
	Global.timeHours = hours;
	Global.timeMinutes = minutes;
	Global.timeSeconds = seconds;
}
function timeStart(){
	window.setInterval(time,1000);
	}