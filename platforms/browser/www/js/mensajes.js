// JavaScript Document

function mensaje_texto(valor)
	{
	navigator.notification.alert(
						valor,  // message
						callback,				//llamada a funcion
						'Mensaje',            // title
						'OK'                  // buttonName
					);
	
	}
function callback(){};
				