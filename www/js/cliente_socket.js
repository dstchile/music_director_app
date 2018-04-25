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
					
					////llamada al servidor
					var ws = new WebSocket('ws://'+address_server+':8888');
					ws.onopen = function () {
						console.log('open');
						this.send('001');         // transmit "hello" after connecting 
					};
				 
					ws.onmessage = function (event) {
						console.log(event.data);    // will be "hello" 
					
						alert (event.data);
						this.close();
					};
				 
					ws.onerror = function () {
						console.log('error occurred!');
					};
				 
					ws.onclose = function (event) {
						console.log('close code=' + event.code);
					};
					////////////////////////////////////
					
					
					console.log("i= "+i);
					document.getElementById('mensajeria').innerHTML="--"+i+"--add:"+address_server+"----";
					i++;
					partida_cliente(i);
					},5000);
		}

	
	
	}
