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
		$.each(result.rows,function(index)
			{
			var row = result.rows.item(index);
			var nombre_usuario=row['nombre_usuario'];
			var numero_telefono=row['numero_telefono'];
			inicio_proceso(nombre_usuario,numero_telefono)
			});
		}
			
	}
function inicio_proceso(nombre_usuario,numero_telefono)
	{
	var wsserver = cordova.plugins.wsserver;	
	var puerto=8888;
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
			mensajes_servidor(conn,msg);
			},
			'onClose' : function(conn, code, reason, wasClean) {
				console.log('A user disconnected from %s', conn.remoteAddr);
			}
		}, function onStart(addr, port) {
			console.log('Listening on %s:%d', addr, port);
			alert("servidor iniciado en:"+addr+" por:"+port+"---");
		}, function onDidNotStart(reason) {
			console.log('Did not start. Reason: %s', reason);
		});
	}
function mensajes_servidor(conn,msg)
	{
	if (msg=='001')
		{
		wsserver.send({'uuid':conn.uuid}, 'nick:'+nombre_usuario);
		}
	}