// JavaScript Document

document.addEventListener("deviceready", iniciando_cliente, false);
function iniciando_cliente()
	{	
	console.log("iniciando cliente");
	
	
	var i=0;
	partida_cliente(i)
	function partida_cliente(i)
		{
		
					setTimeout(function(){
					var address_server = getParameterByName('v1');

					console.log("i= "+i);
					document.getElementById('mensajeria').innerHTML="--"+i+"--add:"+address_server+"----";
					i++;
					partida_cliente(i);
					},1000);
		}

	
	
	}
