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
				
	consultando();
}
function consultando()
	{
	var id_director = getParameterByName('v1');
	
	console.log("CONSULTANDO");
	console.log("id_director:"+id_director+" --")
	
	var dato="CONSULTANDO";
	var formData = new FormData();
	formData.append("dato", dato);
	formData.append("id_director", id_director);
	$.ajax({
		type: 'POST',
		url: servidor+'conexion_app.php',
		data: formData,
		processData: false,
		contentType: false,
		timeout: 2000,//5 segundos
		success: function (resultx) 
			{
			console.log(resultx);
			var obj = JSON.parse(resultx);
			
			var x_anterior=document.getElementById('boton-pause').value;
			if (obj.titulo=='')
				{
				document.getElementById('mensajeria').style.display='';
				document.getElementById('mensajeria').innerHTML="Esperando";
				document.getElementById('cancion').innerHTML="";
				document.getElementById('cancion').value="";
				letra_cancion=obj.letra;
				velocidad=obj.velocidad;
				tono=obj.tono;
				compas=obj.compas;
				document.getElementById('t-can').textContent="";
				}
			else
				{
				document.getElementById('mensajeria').style.display='none';
				document.getElementById('mensajeria').innerHTML="";
				document.getElementById('t-can').textContent=obj.titulo;
				document.getElementById('text-velocidad').value=obj.velocidad;
				
				
				var letra_cancion='<div style="display:block; width:100%; text-align:center"><span style=" font-weight: bold; font-size:16px">'+obj.titulo+'</span><br><br>';
				letra_cancion+='<span style=" font-weight: bold;  font-size:16px">'+obj.cantante+'</span></div><br><br><br><br><br>';
				var letra0=obj.letra.replace(/ /gi,"&nbsp;");
				var letra1=letra0.replace(/\n/gi,"<br>");
				var letra2=letra1.replace(/\t/gi,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
				letra_cancion+="<br>"+letra2;
				document.getElementById('cancion').innerHTML=letra_cancion;
				
				if (tamano_l=='')
					{
					var db = window.openDatabase("music_director_app", "1.0", "music_director_app", 2000000);
					db.transaction(queryDB,errorCB);
					function queryDB(tx)
						{
						tx.executeSql('SELECT * FROM canciones WHERE titulo_cancion="'+obj.titulo+'" and cantante="'+obj.cantante+'"',[],querySuccess,errorCB);
						console.log( "Leyendo datos guardados." );
						}
					function errorCB(err) 
						{
						alert("Error processing SQL: "+err.code);
						}
					function querySuccess(tx,result)
						{
						console.log( "generando query." );
						if (result.rows.length>=1) 
							{
							var row = result.rows.item(0);
							tamano_l=row['tamano_letra']
							document.getElementById('cancion').style.fontSize=tamano_l+"px";	
							}
						else
							{
							tamano_l=14;
							document.getElementById('cancion').style.fontSize=tamano_l+"px";	
							}
						}
					}
				//document.getElementById('cancion').value=obj.titulo+'\n\n'+obj.cantante+'\n\n\n\n\n\n'+obj.letra;
				letra_cancion_ori=obj.letra;
				velocidad=obj.velocidad;
				tono=obj.tono;
				compas=obj.compas;
				document.getElementById('ncantante').value=obj.cantante;
				//document.getElementById('boton-pause').value=obj.pause;
				}
			var estado_actual=document.getElementById('estado').value;
			var x=document.getElementById('boton-pause').value;
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
			}
		})
	.fail(function(resultx)
		{
		$('body').append('<div id="con_pop"><span id="disco"></span>Error de conexión</div>');
		setTimeout(function (){$('#con_pop').fadeOut(1500);},3000);
		setTimeout(function(){$('#con_pop').remove()},5000);
		console.log("ERROR DE COMUNICACION");	
		});
	
	
	setTimeout(function ()
		{
		console.log("////////////////");
		console.log("////////////////");
		console.log("reiniciando");
		console.log("////////////////");
		console.log("////////////////");
		consultando();
		},5000)
	}
