// JavaScript Document

document.addEventListener("deviceready", iniciando_cliente, false);
function iniciando_cliente()
	{	
	console.log("iniciando cliente");
	window.plugins.insomnia.keepAwake();
				
	
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
						this.send('003');         // transmit "hello" after connecting 
					};
				 
					ws.onmessage = function (event) {
						console.log(event.data);    // will be "hello" 
						//alert(event.data)
						var obj = JSON.parse(event.data);
						if (obj.titulo=='')
							{
							document.getElementById('mensajeria').style.display='';
							document.getElementById('mensajeria').innerHTML="Esperando";
							document.getElementById('cancion').innerHTML="";
							}
						else
							{
							document.getElementById('mensajeria').style.display='none';
							document.getElementById('mensajeria').innerHTML="";
							document.getElementById('t-can').textContent=obj.titulo;
							document.getElementById('text-velocidad').value=obj.velocidad;
							document.getElementById('cancion').value=obj.letra;
							document.getElementById('ncantante').innerHTML=obj.cantante;
							}
						var estado_actual=document.getElementById('estado').value;
						if(obj.estado=='PLAY' && estado_actual!='PLAY')
							{
							$('#cancion').scrollTop(obj.posicion);			
							repro('play')
							}
						if(obj.estado=='STOP' && estado_actual!='STOP')
							{
							repro('stop')
							}
						if(obj.estado=='PAUSE' && estado_actual!='PAUSE')
							{
							pau()
							}
						this.close();
					};
				 
					ws.onerror = function () {
						console.log('error occurred!');
							document.getElementById('mensajeria').style.display='';
							document.getElementById('mensajeria').innerHTML="Esperando";
							document.getElementById('cancion').innerHTML="";
							
					};
				 
					ws.onclose = function (event) {
						console.log('close code=' + event.code);
					};
					////////////////////////////////////
					
					
					console.log("i= "+i);
					i++;
					partida_cliente(i);
					},1000);
		}

	
	
	}
