var Messages = {
     directorBoton: "MIS CANCIONES",
     musicoBoton: "CONECTARME",
	 ordenar_porText: "Ordenar por",
	 busquedaText: "Canción / Cantante / Grupo / Letra",
	 eliminar_cancionText : "Eliminar Canción?",
	 eliminar_grupoText : "Eliminar Grupo?",
	 boton_si : "Si",
	 boton_no : "No",
     headerText: "Default header",
     actionsLabel: "Default action label",
     sampleText: "Default sample text",
     englishLanguage: "English",
     frenchLanguage: "French",
     russianLanguage: "Russian",
     hebrewLanguage: "Hebrew"
};
document.addEventListener("deviceready", checkLanguage, false);
function checkLanguage() {
    try	{
	  	navigator.globalization.getPreferredLanguage
			(
        	function (language) 
				{
				cambio_lenguaje('en-US')
				//alert('language: ' + language.value + '\n');
				},
        	function () 
				{
				//alert('Error getting language\n');
				cambio_lenguaje('en-US')
				}
      		);
		}
	catch(err)
		{
		console.log("funcion deshabilitada")
		cambio_lenguaje('en-US')
		//cambio_lenguaje('es-CL')
		}
    }
	
function cambio_lenguaje(lang) 
	{
    console.log("lenguaje:"+lang);
	 if (typeof(lang)!="string") 
         lang = $("#languages").val();
        
     switch (lang) 
	 	{
         case "en-US":
             setEnglish();
             break;
         case "es-CL":
             setEspañol();
             break;
         case "french":
             setFrench();
             break;
         case "russian":
             setRussian();
             break;
         case "hebrew":
             setHebrew();
             break;
     	}
               
     if ($("#languages").val()=="hebrew")
         $("#wrapper").css({direction: 'rtl'});
     else
         $("#wrapper").css({direction: 'ltr'});
      
     $("#director").html(Messages.directorBoton);
     $("#musico").html(Messages.musicoBoton);
     $("#ordenar_por_titulo").html(Messages.ordenar_porText);
     $("#busqueda").attr("placeholder", Messages.busquedaText);
     $(".eliminar_cancion_texto").text(Messages.eliminar_cancionText);
     $(".eliminar_grupo_texto").text(Messages.eliminar_grupoText);
     $(".boton_si").text(Messages.boton_si);
     $(".boton_no").text(Messages.boton_no);
}
function setEspañol()
	{
     Messages.directorBoton = "MIS CANCIONES";
     Messages.musicoBoton= "CONECTARME";
	 Messages.busquedaText="Canción / Cantante / Grupo / Letra";
	 Messages.eliminar_cancionText="Eliminar canción?";
	 Messages.eliminar_grupoText="Eliminar grupo?";
	 Messages.boton_si="Si";
	 Messages.boton_no="No";
    }
function setFrench()
	{
     Messages.headerText = "Traduction";
     Messages.actionsLabel = "Sélectionnez une langue:";
     Messages.sampleText = "Ceci est un exemple de texte en français.";
	}
function setEnglish()
	{
     Messages.directorBoton = "MY SONGS";
     Messages.musicoBoton= "CONNECT ME";
	 Messages.ordenar_porText="Order by";
	 Messages.busquedaText="Song / Singer / Group / Lyrics";
     Messages.eliminar_cancionText="Delete song?";
     Messages.eliminar_grupoText="Delete group?";
	 Messages.boton_si="Yes";
	 Messages.boton_no="No";
    }