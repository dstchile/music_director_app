// JavaScript Document

document.addEventListener("deviceready", iniciando_servidor, false);
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
	wsserver.stop(function onStop(addr, port) {
		console.log('Stopped listening on %s:%d', addr, port);
		});
	setTimeout(function()
		{
		wsserver.start(puerto, {
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
				mensajes_servidor(wsserver,conn,msg,nombre_usuario,numero_telefono);
				},
				'onClose' : function(conn, code, reason, wasClean) {
					console.log('A user disconnected from %s', conn.remoteAddr);
				}
			}, function onStart(addr, port) {
				console.log('Listening on %s:%d', addr, port);
				alert("servidor iniciado en:"+addr+" por:"+port+"---");
			}, function onDidNotStart(reason) {
				console.log('Did not start. Reason: %s', reason);
				alert("error no iniciado:"+reason)
			});
		
	
		},1000);
			
	
	}
function cierre_servidor()
	{
	var wsserver = cordova.plugins.wsserver;	
	var puerto=8888;
	wsserver.stop(function onStop(addr, port) {
		console.log('Stopped listening on %s:%d', addr, port);
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
					var send_data = JSON.stringify({"direccion":result[interface].ipv4Addresses , "nombre_usuario":nombre_usuario});
					wsserver.send({'uuid':conn.uuid}, send_data);
					}
				}
			})
		}
	if (msg=='002')
		{
		wsserver.send({'uuid':conn.uuid}, numero_telefono);
		}
	if (msg=='003')
		{
		////////////////codigo lectura base de datos
		////////////////codigo lectura base de datos
		var titulo=document.getElementById('t-can').textContent;
		var velocidad=document.getElementById('text-velocidad').value;
		var letra_cancion=document.getElementById('cancion').value;
		var estado=document.getElementById('estado').value;
		var n_cantante=document.getElementById('ncantante').value;
		var pos_scroll = $('#cancion').scrollTop();			
			
		////////////////codigo lectura base de datos
		////////////////codigo lectura base de datos
		
		
		var send_data = JSON.stringify({"titulo":titulo, "velocidad":velocidad,"letra":letra_cancion,"estado":estado,"posicion":pos_scroll,"cantante":n_cantante});
		wsserver.send({'uuid':conn.uuid}, send_data);
		}
	}