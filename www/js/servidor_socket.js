// JavaScript Document

document.addEventListener("deviceready", iniciando_servidor, false);
var sesiones=new Array;
var existe=false;
var id_sesion=0;
var conversacion=new Array;
var conta=0;

function iniciando_servidor()
	{	
	//busca el nombrey numero de telefono del director
	try{
		window.plugins.insomnia.keepAwake();
		}
	catch(err){
		
	}
	var db = window.openDatabase("music_director_app", "1.0", "music_director_app", 2000000); 
	db.transaction(queryDB,errorCB);
	function queryDB(tx)
		{
		tx.executeSql('SELECT * FROM datos_director ',[],querySuccess,errorCB);
		console.log( "Leyendo datos guardados." );
		}
	function errorCB(err) 
		{
		if (err.code!=0)
			{
			alert("1Error processing SQL: "+err.code);
			}
		}
	function querySuccess(tx,result)
		{
		console.log( "generando query." );
		for (var i=0; i<result.rows.length; i++) 
		  {
		  var row = result.rows.item(i);
		  var nombre_usuario=row['nombre_usuario'];
		  var numero_telefono=row['numero_telefono'];
		  inicio_proceso(nombre_usuario,numero_telefono)
		  }
		/*$.each(result.rows,function(index)
			{
			var row = result.rows.item(index);
			var nombre_usuario=row['nombre_usuario'];
			var numero_telefono=row['numero_telefono'];
			inicio_proceso(nombre_usuario,numero_telefono)
			});*/
		}
			
	}
function inicio_proceso(nombre_usuario,numero_telefono)
	{
		
	var puerto=45000;
	llamada_inicio(puerto,nombre_usuario,numero_telefono)					
	function llamada_inicio(puerto,nombre_usuario,numero_telefono)
		{
		var wsserver = cordova.plugins.wsserver;	
		wsserver.start(puerto, {
				'onFailure' :  function(addr,port, reason) {
				console.log('Server detenido Rason:', addr, port, reason);
				//////////mensaje de falla/////////
				$('body').append('<div id="con_pop">'+reason+'<span id="disco"></span></div>');
				setTimeout(function (){$('#con_pop').fadeOut(1500);},3000);
				setTimeout(function(){$('#con_pop').remove()},5000);
				},
				'onOpen' : function(conn) {
				//'uuid'=conn.uuid;
				//'direccion del cliente'=conn.remoteAddr;
				console.log('A user connected', conn.remoteAddr);
				},
				'onMessage' : function(conn, msg) {
				console.log(conn, msg);
				mensajes_servidor(wsserver,conn,msg,nombre_usuario,numero_telefono);
				},
				'onClose' : function(conn, code, reason, wasClean) {
				console.log('A user disconnected from %s', conn.remoteAddr);			
				}
			}, function onStart(addr, port) {
				console.log('Listening on %s:%d', addr, port);
				$('body').append('<div id="con_pop">Servidor Iniciado</div>');
				setTimeout(function (){$('#con_pop').fadeOut(1500);},3000);
				setTimeout(function(){$('#con_pop').remove()},5000);
				//alert("servidor iniciado en:"+addr+" por:"+port+"---");
				
			}, function onDidNotStart(reason) {
				console.log('Did not start. Reason: %s', reason);
				//////////mensaje de falla/////////
				$('body').append('<div id="con_pop">'+reason+'<span id="disco"></span></div>');
				setTimeout(function (){$('#con_pop').fadeOut(1500);},3000);
				setTimeout(function(){$('#con_pop').remove()},5000);
			});
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
	
function cierre_ser()
	{
		var wsserver = cordova.plugins.wsserver;	
			wsserver.stop(function onStop(addr, port) {
			console.log('Stopped listening on %s:%d', addr, port);
			$('body').append('<div id="con_pop">Servidor Cerrado</div>');
			setTimeout(function (){$('#con_pop').fadeOut(1500);},3000);
			setTimeout(function(){$('#con_pop').remove()},5000);
			});
	
	}
	
function mensajes_servidor(wsserver,conn,msg,nombre_usuario,numero_telefono)
	{
	if (msg=='001')
		{
		wsserver.getInterfaces(function(result) 
			{
			for (var interface in result) 
				{
				if (result.hasOwnProperty(interface)) 
					{
					var largo=sesiones.length;
					for(var i=0; i<=largo; i++)
					{
						if(sesiones[i]==conn.remoteAddr)
							{
								existe=true;
							}
					}
					if(existe==false)
						{
							sesiones[largo]=conn.remoteAddr;
						}
					
					alert(sesiones);
					var send_data = JSON.stringify({"direccion":result[interface].ipv4Addresses , "nombre_usuario":nombre_usuario});
					wsserver.send({'uuid':conn.uuid}, send_data);
					wsserver.close({'uuid':conn.uuid});
					
					}
				}
			})
		}
	if (msg=='002')
		{
		
		wsserver.send({'uuid':conn.uuid}, numero_telefono);
		wsserver.close({'uuid':conn.uuid});
		
		}
	if (msg=='003')
		{
		
		////////////////codigo lectura base de datos
		////////////////codigo lectura base de datos
		if(document.getElementById('t-can')!=null)
			{
			var titulo=document.getElementById('t-can').textContent;
			}	
		if(titulo==undefined){titulo='';}
		if(document.getElementById('text-velocidad')!=null)
			{
			var velocidad=document.getElementById('text-velocidad').value;
			}
		if(velocidad==undefined){velocidad='';}
		if (document.getElementById('cancion')!=null)
			{
			var letra_cancion=document.getElementById('cancion').value;
			}
		if(letra_cancion==undefined){letra_cancion='';}
		if (document.getElementById('estado')!=null)
			{
			var estado=document.getElementById('estado').value;
			}
		if(estado==undefined){estado='';}
		if (document.getElementById('ncantante')!=null)
			{
			var n_cantante=document.getElementById('ncantante').value;
			}
		if(n_cantante==undefined){n_cantante='';}
		if (document.getElementById('boton-pause')!=null)
			{
			var x=document.getElementById('boton-pause').value;
			}
		if(x==undefined){x='';}
		var pos_scroll = $('#cancion').scrollTop();
		if(pos_scroll==undefined){pos_scroll='';}
		////////////////codigo lectura base de datos
		////////////////codigo lectura base de datos
		var send_data = JSON.stringify({"titulo":titulo, "velocidad":velocidad,"letra":letra_cancion,"estado":estado,"posicion":pos_scroll,"cantante":n_cantante,"pause":x,"sesiones":sesiones.toString()});
		wsserver.send({'uuid':conn.uuid}, send_data);
		wsserver.close({'uuid':conn.uuid});
		
		}
	}
function respuesta_servidor()
			{
			WebSocket.pluginOptions = {
					maxConnectTime: 1000,
				};
			var conversacion=sesiones.length;
			conta=0;	
			for(var i=0; i<=sesiones.length; i++)
				{
					var address_cliente=sesiones[i];
					llamada(address_cliente)
				}
			//llamada al servidor
			function llamada(address_cliente)
			{
			var ws = new WebSocket('ws://'+address_cliente+':45001');
			ws.onopen = function () {
				console.log('open');				
				this.send('listo');// transmit "hello" after connecting 
				};
			ws.onmessage = function (event) {
				//alert("resp:"+event.data)
				
				if (event.data=='listo')
					{
						conta++;
					}
				else
					{
						conta++;
					}
					document.getElementById('menconta').innerHTML=conta+" -- "+conversacion+" -"+temposwitch+"--";
				if(conta==conversacion && temposwitch==true)
				{
					alert("proceso terminado")
				temposwitch=false;
				}
					
				console.log('close');
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
				console.log('close code=' + event.code);
			};
			////////////////////////////////////
			}
		}

var temposwitch=false;

function temporizador(){
	if(temposwitch==false)
	{
		temposwitch=false;
		setTimeout(function (){
			temporizador();
			respuesta_servidor();
		},1000)
		console.log("cuenta")
	}
	
}



	