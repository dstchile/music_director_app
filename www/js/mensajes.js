// JavaScript Document

function mensaje_texto(valor)
	{
	alert(valor)
	/*navigator.notification.alert(
						valor,  // message
						callback,				//llamada a funcion
						'Mensaje',            // title
						'OK'                  // buttonName
					);
	*/
	}
function callback(){};
				
				
/*$(document).ready(function(e) {

	//$('body').append("<div id='mensaje' class='mensaje'>hola mundo, esto es para probar como salen los mensaje flotantes de sistema verificano ancho y todo lo demas</div>");
    	//setTimeout(function (){$('#mensaje').fadeOut(1500);},3000);
		//setTimeout(function(){$('#mensaje').remove()},5000);
	
});*/

function ventana_mensaje(texto)
	{
		$('body').append("<div id='mensaje' class='mensaje'>"+texto+"</div>");
    	$("#mensaje").hide().fadeIn(500);
		setTimeout(function (){$('#mensaje').fadeOut(500);},3000);
		setTimeout(function(){$('#mensaje').remove()},3600);
	}


function ventana_mensaje_condicion(texto,callback)
	{
		$('body').append("<div id='mensaje' class='mensaje' style='display:block; align-items:center;justify-content: center;'>"+texto+" <br><div style='display:flex; width:100%; text-align:center; align-items:center;justify-content: center; vertical-align:middle'><input type='button' id='si' name='si' value='Si' class='botones' style='width:20%'><div style='width:30%'></div><input type='button' id='no' name='no' value='No' class='botones'  style='width:20%'></div></div>");
    	$("#mensaje").hide().fadeIn(500);
		
		$("#si").click(function(){
		$('#mensaje').fadeOut(100);
		setTimeout(function(){$('#mensaje').remove()},150);
		callback('SI');
		});
		$("#no").click(function(){
		$('#mensaje').fadeOut(100);
		setTimeout(function(){$('#mensaje').remove()},150);
		callback('NO');
		});
	
	}
function ventana_mensaje_acepta(texto,callback)
	{
		$('body').append("<div id='mensaje' class='mensaje'>"+texto+"<br><input type='button' id='aceptar' name='aceptar' value='Aceptar' class='botones' ></div>");
    	$("#mensaje").hide().fadeIn(500);
	
		$("#aceptar").click(function(){
		$('#mensaje').fadeOut(100);
		setTimeout(function(){$('#mensaje').remove()},150);
		callback();
		});
	}


var mensaje_activo='off';
function mensaje1()
	{
		mensaje_activo='on';
		$('body').append("<div id='mensaje' class='mensaje'>Si suelta la canción, será quitada de la lista.</div>");
    	$('#mensaje').fadeIn(500);
	}
function mensaje2()
	{
		$('#mensaje').fadeOut(500);
		setTimeout(function(){$('#mensaje').remove()},600);
		mensaje_activo='off';
	}
				