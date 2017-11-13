<?
$orgMeta = file_get_contents("metaData.json");
$metadata = $_REQUEST["metaData"];
$orgMetaJSON = json_decode($orgMeta);

 $obj = json_decode('[{"title" : "a", "content" : "b"},{"title" : "a", "content" : "b"}]');
foreach($obj as $item) {
	$content = $item->content;
	$isExist = false;
	foreach($orgMetaJSON as $orgItem){
		echo("<br>title is $content org is ".$orgItem->content."<br>");
		if($content == $orgItem->content){
			echo("<br>is same<br>");
			$orgItem->cnt = intval($orgItem->cnt)+1;
			$isExist=true;
		}
	}
	if(!$isExist){
		 $item->cnt = "0";
		 array_push( $orgMetaJSON,$item);
	}
	
}
var_dump($orgMetaJSON);

//$m2 = json_encode($_REQUEST["metadata"],JSON_UNESCAPED_UNICODE); // {"korean":"안녕","english":"hi"}

echo($_GET['callback'] . '(' . "$metadata" . ')');
?>