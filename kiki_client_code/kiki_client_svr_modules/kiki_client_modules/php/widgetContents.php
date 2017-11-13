<?php
header('content-type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$fileName = $_REQUEST["filename"] ? $_REQUEST["filename"] : "kikiWebWidget.html";
$pbDiv = file_get_contents("http://www.gamekiki.com/kiki_client_modules/html/$fileName");
echo $pbDiv
?>