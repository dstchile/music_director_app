// JavaScript Document
document.addEventListener("deviceready", iniciando_servidor, false);
var sesiones=new Array;
var existe=false;
var id_sesion=0;
var conversacion=new Array;
var conta=0;
var conej=0;
var coner=0;
var concl=0;
var ip_servidor='';
function getParameterByName(name) 
	{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

function iniciando_servidor()
	{	
	try{
		window.plugins.insomnia.keepAwake();
		}
	catch(err){
	
	function onSuccess( ipInformation ) 
		{
		//ipInformation.ip
		//ipInformation.subnet
		ip_servidor=ipInformation.ip;
		}
	function onError( error ) 
		{
		// Note: onError() will be called when an IP address can't be found. eg WiFi is disabled, no SIM card, Airplane mode etc.
		//alert( error );
		}
	networkinterface.getWiFiIPAddress( onSuccess, onError );
	networkinterface.getCarrierIPAddress( onSuccess, onError );	
	}
	//busca el nombre y numero de telefono del director
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
		  var correo_electronico=row['correo_electronico'];
		  inicio_proceso(nombre_usuario,correo_electronico)
		  }
		}
			
	}
function inicio_proceso(nombre_usuario,correo_electronico)
	{
		
	var puerto=45000;
	llamada_inicio(puerto,nombre_usuario,correo_electronico)					
	function llamada_inicio(puerto,nombre_usuario,correo_electronico)
		{
			$('body').append('<div id="con_pop">Espere un momento<span id="disco"></span></div>');
			setTimeout(function (){$('#con_pop').fadeOut(500);},2000);
			setTimeout(function(){$('#con_pop').remove()},2000);
		try
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
					mensajes_servidor(wsserver,conn,msg,nombre_usuario,correo_electronico);
					},
					'onClose' : function(conn, code, reason, wasClean) {
					console.log('A user disconnected from %s', conn.remoteAddr);			
					}
				}, function onStart(addr, port) {
					console.log('Listening on %s:%d', addr, port);
					$('body').append('<div id="con_pop">Director listo</div>');
					$('#pelicula').remove()
					setTimeout(function (){$('#con_pop').fadeOut(1500);},3000);
					setTimeout(function(){$('#con_pop').remove()},5000);
		
				}, function onDidNotStart(reason) {
					console.log('Did not start. Reason: %s', reason);
					//////////mensaje de falla/////////
					$('body').append('<div id="con_pop">'+reason+'<span id="disco"></span></div>');
					setTimeout(function (){$('#con_pop').fadeOut(1500);},3000);
					setTimeout(function(){$('#con_pop').remove()},5000);
				});
			}
		catch(err)
			{
			//alert("WSSERVER no disponible")
			console.log("WSSERVER no disponible")
			}
			
	
		}
	}

function cierre_servidor(ruta)
	{
		
		//alert("servidor iniciado en:"+addr+" por:"+port+"---");
		$('body').append('<div id="pelicula" style=" z-index:1000;background-color:transparent; height:100%; width:100%; position:absolute; top:1px;"></div>');
		$('body').append('<div id="con_pop">Espere un momento<span id="disco"></span></div>');
		setTimeout(function(){$('#con_pop').remove()},3000);
		try
			{
					//var wsserver = localStorage.getItem('wsserver');
					//alert("ws VALOE22:"+Object.values(wsserver)+"--"+wsserver+"--");
					//var wsserver = wsserver;
					//var wsserver = cordova.plugins.wsserver;	
					wsserver.stop(function onStop(addr, port) {
					console.log('Stopped listening on %s:%d', addr, port);
					setTimeout(function(){
						window.open(ruta,'_parent');
						//location.href=ruta 
						},100);
										});
			}
		catch(err)
			{
				window.open(ruta,'_parent');
				//location.href=ruta;
			}
		
	}
	
	
function mensajes_servidor(wsserver,conn,msg,nombre_usuario,correo_electronico)
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
					
					var send_data = JSON.stringify({"direccion":result[interface].ipv4Addresses , "nombre_usuario":nombre_usuario});
					wsserver.send({'uuid':conn.uuid}, send_data);
					wsserver.close({'uuid':conn.uuid});
					
					}
				}
			})
		}
	if (msg=='002')
		{
		
		wsserver.send({'uuid':conn.uuid}, correo_electronico);
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


	