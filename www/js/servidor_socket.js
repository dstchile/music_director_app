// JavaScript Document

document.addEventListener("deviceready", iniciando_servidor, false);
var sesion_cerrada=true;

function iniciando_servidor()
	{	
	//busca el nombrey numero de telefono del director
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
	var wsserver = cordova.plugins.wsserver;	
	var puerto=8888;
	setTimeout(function()
		{		
		wsserver.start(puerto, {
				'onFailure' :  function(addr,port, reason) {
					console.log('Server detenido Rason:', addr, port, reason);
					//////////mensaje de falla/////////
					$('body').append('<div id="con_pop">Servidor no iniciado "'+reason+'" <span id="disco"></span></div>');
					setTimeout(function (){$('#con_pop').fadeOut(1500);},3000);
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
				//alert("servidor iniciado en:"+addr+" por:"+port+"---");
				
			}, function onDidNotStart(reason) {
				console.log('Did not start. Reason: %s', reason);
				//////////mensaje de falla/////////
				$('body').append('<div id="con_pop">Servidor no iniciado "'+reason+'"<span id="disco"></span></div>');
				setTimeout(function (){$('#con_pop').fadeOut(1500);},3000);
			});
		
	
		},500);
			
	
	}
var con=0;
function cierre_servidor(ruta)
	{
	if(sesion_cerrada)
		{
			alert("salida 1")
			var wsserver = cordova.plugins.wsserver;	
			wsserver.stop(function onStop(addr, port) {
				setTimeout(location.href=ruta,2000)
				console.log('Stopped listening on %s:%d', addr, port);
				});
		}
	else
		{
			if(con<=20)
				{
					setTimeout(function (){
						con++;
						cierre_servidor(ruta)
						},50)
				}
			else
				{
					alert("salida 2: "+con)
					setTimeout(location.href=ruta,2000)
				}
		}
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
					sesion_cerrada=false;
					var send_data = JSON.stringify({"direccion":result[interface].ipv4Addresses , "nombre_usuario":nombre_usuario});
					wsserver.send({'uuid':conn.uuid}, send_data);
					wsserver.close({'uuid':conn.uuid});
					setTimeout(sesion_cerrada=true,100)
					}
				}
			})
		}
	if (msg=='002')
		{
		sesion_cerrada=false;
		wsserver.send({'uuid':conn.uuid}, numero_telefono);
		wsserver.close({'uuid':conn.uuid});
		setTimeout(sesion_cerrada=true,100)
		}
	if (msg=='003')
		{
		sesion_cerrada=false;
		////////////////codigo lectura base de datos
		////////////////codigo lectura base de datos
		var titulo=document.getElementById('t-can').textContent;
		if(titulo==undefined){titulo='';}
		var velocidad=document.getElementById('text-velocidad').value;
		if(velocidad==undefined){velocidad='';}
		var letra_cancion=document.getElementById('cancion').value;
		if(letra_cancion==undefined){letra_cancion='';}
		var estado=document.getElementById('estado').value;
		if(estado==undefined){estado='';}
		var n_cantante=document.getElementById('ncantante').value;
		if(n_cantante==undefined){n_cantante='';}
		var x=document.getElementById('boton-pause').value;
		if(x==undefined){x='';}
		var pos_scroll = $('#cancion').scrollTop();
		if(pos_scroll==undefined){pos_scroll='';}
		alert ("tit:"+titulo+"--vel:"+velocidad+"--let:"+letra_cancion+"--est:"+estado+"--nca:"+n_cantante+"--x:"+x+"--pos:"+pos_scroll+"--");
		////////////////codigo lectura base de datos
		////////////////codigo lectura base de datos
		var send_data = JSON.stringify({"titulo":titulo, "velocidad":velocidad,"letra":letra_cancion,"estado":estado,"posicion":pos_scroll,"cantante":n_cantante,"pause":x});
		wsserver.send({'uuid':conn.uuid}, send_data);
		wsserver.close({'uuid':conn.uuid});
		setTimeout(sesion_cerrada=true,100)
		}
	}