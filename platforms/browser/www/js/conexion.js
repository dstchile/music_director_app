// JavaScript Document

var servidor='http://servidordstchile.ddns.net/music_director_servidor/';

//var servidor='https://www.sistemalodis.cl';


momentoActual = new Date() 
var hora = momentoActual.getHours() 
var minuto = momentoActual.getMinutes() 
var segundo = momentoActual.getSeconds() 
//diasemana= momentoActual.getDay()
var mes_actual=momentoActual.getMonth();
var mes_actual=mes_actual+1;
var dia_actual = momentoActual.getDate();
var ano_actual = momentoActual.getFullYear();

if (hora<10){hora="0"+hora;}  
if (minuto<10){minuto="0"+minuto;}  
if (segundo<10){segundo="0"+segundo;}  
if (mes_actual<10){mes_actual="0"+mes_actual;}  
if (dia_actual<10){dia_actual="0"+dia_actual;}  

	

