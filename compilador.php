<?

//unlink('compilado.zip');
echo "compilando";
$doc= new DOMdocument();
$doc->load( 'config.xml' );
$books = $doc->getElementsByTagName( "widget" );
foreach( $books as $book )
	{
	$authors = $book->getElementsByTagName( "name" );
	$author = $authors->item(0)->nodeValue;
	$valueID = $book->getAttribute('version');  
	$version= explode(".",$valueID);
	$valor1=$version[2];
	$valor2=$version[1];
	$valor3=$version[0];
	
	$valor1++;
	if ($valor1==10)
		{
			$valor1=0;
			$valor2++;
			if ($valor2==10)
				{
					$valor2=0;
					$valor3++;
				}
			
		}
	$book->setAttribute("version", "$valor3.$valor2.$valor1");
	$valuexmlns = $book->getAttribute('xmlns');  
	$version=explode(".",$valueID);
	echo "$title - $author - $valuexmlns -- $valueID ---- $version[0]-$version[1]-$version[2]  *****<br>";
}
$html=$doc->save('config.xml');
echo $html;
echo "compilando";
$doc= new DOMdocument();
$doc->load( 'config.xml' );
$books = $doc->getElementsByTagName( "widget" );
foreach( $books as $book )
	{
	$authors = $book->getElementsByTagName( "name" );
	$author = $authors->item(0)->nodeValue;
	$valueID = $book->getAttribute('version');  
	echo "nueva version -- $valueID ---- ***** <br>";
}
$html=$doc->save('config.xml');
echo $html;

/*  require_once('pclzip-2-8-2/pclzip.lib.php');
   $archive = new PclZip('compilado.zip');
   $v_dir = getcwd(); // or dirname(__FILE__);
   $v_remove = $v_dir;
   echo $v_remove;
   // To support windows and the C: root you need to add the 
   // following 3 lines, should be ignored on linux
   if (substr($v_dir, 1,1) == ':') {
     $v_remove = substr($v_dir, 2);
   }
   echo '\n';
   echo $v_remove;
   $v_list = $archive->create($v_remove, PCLZIP_OPT_REMOVE_PATH, $v_remove);
   echo $v_list;
   $v_list = $archive->delete(PCLZIP_OPT_BY_NAME, 'compilado.zip');
   $v_list = $archive->delete(PCLZIP_OPT_BY_NAME, 'compilador.php');
   $v_list = $archive->delete(PCLZIP_OPT_BY_NAME, 'pclzip2-8-2');
   if ($v_list == 0) {
     die("Error : ".$archive->errorInfo(true));
   }
   
*/     
//require('pclzip-2-8-2/pclzip.lib.php');
//$zip = new PclZip('compilado.zip');
//$v_list = $zip->add('www/*',PCLZIP_OPT_REMOVE_PATH, 'www');
//$zip->create('a.txt,b.txt');
?>