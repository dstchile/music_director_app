// JavaScript Document
//document.addEventListener("deviceready", iniciando_servidor, false);
//var sesiones=new Array;
//var existe=false;
//var id_sesion=0;
//var conversacion=new Array;
//var conta=0;
//var conej=0;
//var coner=0;
//var concl=0;
var nombre_usuario='';
var correo_electronico='';
var id_user_web='';
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
	catch(err){}
	//busca los dats del usuario
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
		  nombre_usuario=row['nombre_usuario'];
		  correo_electronico=row['correo_electronico'];
		  id_user_web=row['id_web'];
		  inicio_proceso(nombre_usuario,correo_electronico,id_user_web)
		  }
		}
			
	}
function inicio_proceso(nombre_usuario,correo_electronico,id_user_web)
	{
	var id_cancion = getParameterByName('v1');
	var estado=document.getElementById('estado').value;
	var titulo=document.getElementById('t-can').textContent;
	var velocidad=document.getElementById('text-velocidad').value;
	var cantante=document.getElementById('ncantante').value;
		
	if (estado==null||estado==''){estado='STOP';} 
	console.log("INICIANDO PROCESO");
	console.log("estado:"+estado);
	console.log("id_usuario_web:"+id_user_web+" --")
	console.log("titulo:"+titulo);
	
	//insertamos el grupo en la web//////		
	//insertamos el grupo en la web//////		
	//insertamos el grupo en la web//////		
	var fecha_actualizacion=""+ano_actual+"-"+mes_actual+"-"+dia_actual+" "+hora+":"+minuto+":"+segundo;

	var dato="PROCESO";
	var formData = new FormData();
	formData.append("dato", dato);
	formData.append("id_user_web", id_user_web);
	formData.append("id_cancion", id_cancion);
	formData.append("estado", estado);
	formData.append("titulo", titulo);
	formData.append("cantante", cantante);
	formData.append("velocidad", velocidad);
	formData.append("tono", tono);
	formData.append("compas", compas);
	formData.append("letra", letra);
	formData.append("fecha", fecha_actualizacion);
	$.ajax({
		type: 'POST',
		url: servidor+'conexion_app.php',
		data: formData,
		processData: false,
		contentType: false,
		timeout: 5000,//5 segundos
		success: function (resultx) 
			{
			console.log(resultx);
			var obj = JSON.parse(resultx);
			//$('body').append('<div id="con_pop">Conexión lista</div>');
			//setTimeout(function (){$('#con_pop').fadeOut(1500);},3000);
			//setTimeout(function(){$('#con_pop').remove()},5000);
	
			//mensajes_servidor(wsserver,conn,msg,nombre_usuario,correo_electronico);
			}
		})
	.fail(function(resultx)
		{
		$('body').append('<div id="con_pop"><span id="disco"></span>Error de conexión</div>');
		setTimeout(function (){$('#con_pop').fadeOut(1500);},3000);
		setTimeout(function(){$('#con_pop').remove()},5000);
		console.log("ERROR DE COMUNICACION");	
		});
	}
function proceso_en_espera(nombre_usuario,correo_electronico,id_user_web)
	{
	
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


	