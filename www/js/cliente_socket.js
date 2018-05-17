// JavaScript Document

document.addEventListener("deviceready", iniciando_cliente, false);
function iniciando_cliente()
	{	
	console.log("iniciando cliente");
	try
		{
			window.plugins.insomnia.keepAwake();
		}
	catch(err)
		{
		
		}
				
	
	//////////////////////////////inicio de servidor////////////////////////////////////////
	var wsserver = cordova.plugins.wsserver;	
	wsserver.start(45001, {
			'onFailure' :  function(addr,port, reason) {
				console.log('Server detenido Rason:', addr, port, reason);
			},
			'onOpen' : function(conn) {
			//'uuid'=conn.uuid;
			//'direccion del cliente'=conn.remoteAddr;
			console.log('A user connected', conn.remoteAddr);
			},
			'onMessage' : function(conn, msg) {
			console.log(conn, msg);
			if (msg=='listo')
				{
				respuesta_servidor(wsserver,conn);
				}
			else
				{
				wsserver.send({'uuid':conn.uuid}, "error");
				wsserver.close({'uuid':conn.uuid});
				}
			},
			'onClose' : function(conn, code, reason, wasClean) {
			
			console.log('A user disconnected from %s', conn.remoteAddr);
			}
		}, function onStart(addr, port) {
			console.log('Listening on %s:%d', addr, port);
			alert("servidor iniciado en:"+addr+" por:"+port+"---");
			
		}, function onDidNotStart(reason) {
			console.log('Did not start. Reason: %s', reason);
			alert("error:"+reason+"-");
			//////////mensaje de falla/////////
		});
	/////////////////fin inicio servidor////////////////////////////////////////////
	  
		
		function respuesta_servidor(wsserver,conn)
			{
			WebSocket.pluginOptions = {
					maxConnectTime: 5000,
				};
			var address_server = getParameterByName('v1');
			//var address_server = '192.168.1.35';
			////llamada al servidor
			var ws = new WebSocket('ws://'+address_server+':45000');
			ws.onopen = function () {
				console.log('open');
				this.send('003');         // transmit "hello" after connecting 
				};
			 
			ws.onmessage = function (event) {
				console.log(event.data);    // will be "hello" 
				//alert(event.data)
				var obj = JSON.parse(event.data);
				var x_anterior=document.getElementById('boton-pause').value;
				if (obj.titulo=='')
					{
					document.getElementById('mensajeria').style.display='';
					document.getElementById('mensajeria').innerHTML="Esperando";
					document.getElementById('cancion').innerHTML="";
					document.getElementById('cancion').value="";
					document.getElementById('t-can').textContent="";
					}
				else
					{
					document.getElementById('mensajeria').style.display='none';
					document.getElementById('mensajeria').innerHTML="";
					document.getElementById('t-can').textContent=obj.titulo;
					document.getElementById('text-velocidad').value=obj.velocidad;
					document.getElementById('cancion').value=obj.letra;
					document.getElementById('ncantante').value=obj.cantante;
					document.getElementById('boton-pause').value=obj.pause;
					}
				var estado_actual=document.getElementById('estado').value;
				var x=document.getElementById('boton-pause').value;
				console.log("Sesiones: "+obj.sesiones)
				if(obj.estado=='PLAY' && estado_actual!='PLAY' && x_anterior=='')
					{
						$('#cancion').scrollTop(obj.posicion);			
						repro('play')
					}
				if(obj.estado=='PLAY' && estado_actual!='PLAY' && x_anterior==1)
					{			
						pau(x)
					}
				if(obj.estado=='STOP' && estado_actual!='STOP')
					{
						repro('stop')
					}
				if(obj.estado=='PAUSE' && estado_actual!='PAUSE' && x_anterior==1)
					{
						pau(x)
					}
				console.log('close');
				wsserver.send({'uuid':conn.uuid}, "listo");
				wsserver.close({'uuid':conn.uuid});
				this.close();
				
			};
		 
			ws.onerror = function () {
					console.log('error occurred!');
					document.getElementById('mensajeria').style.display='';
					document.getElementById('mensajeria').innerHTML="Esperando";
					document.getElementById('cancion').innerHTML="";
					document.getElementById('cancion').value="";
					document.getElementById('t-can').textContent="";
					console.log('close 2');
			};
		 
			ws.onclose = function (event) {
				wsserver.send({'uuid':conn.uuid}, "error");
				wsserver.close({'uuid':conn.uuid});
				$('body').append('<div id="con_pop_3">'+event.code+'<span id="disco"></span></div>');
				setTimeout(function (){$('#con_pop_3').fadeOut(1500);},3000);
				setTimeout(function(){$('#con_pop_3').remove()},5000);
				console.log('close code=' + event.code);
			};
			////////////////////////////////////
		}

	
	
	}


function cierre_servidor(ruta)
	{
		try
			{
				var wsserver = cordova.plugins.wsserver;	
					wsserver.stop(function onStop(addr, port) {
					console.log('Stopped listening on %s:%d', addr, port);
					setTimeout(function(){location.href=ruta},100);
					});
			}
		catch(err)
			{
				location.href=ruta;
			}
		
	}