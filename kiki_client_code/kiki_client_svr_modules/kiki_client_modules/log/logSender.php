<?
 header("Access-Control-Allow-Origin: *");
 header('Access-Control-Allow-Credentials: true');
$data = json_decode($logSettingJSON, TRUE);
$log = $_REQUEST["log"];
$appId = $_REQUEST["appId"];
$emitType = $_REQUEST["emitType"];
$emitData = $_REQUEST["logData"];
$href = $_REQUEST["href"];
$logJSON;

try{
	$logJSON = JSON_decode($emitData);
}catch(Exception $e){
	file_put_contents('./data/'.$appId.'/log_'.date("Y_n_j").'.txt',
		PHP_EOL
			."--------------------------------------------------".PHP_EOL
			."ipInfo : ".$_SERVER['REMOTE_ADDR'].' - '.date("F j, Y, g:i a").PHP_EOL
			."href : ".$href.PHP_EOL
			."emit Type : ".$emitType.PHP_EOL
			."JSON decode error : failed to decode JSON : ".$e.PHP_EOL		
	,FILE_APPEND);
	exit;
}


if (!file_exists("./data/$appId")) {
	$old = umask(0);
    mkdir("./data/$appId", 0777, true);
	umask($old); 
}

//Something to write to txt log
$log  = 
		PHP_EOL
		."--------------------------------------------------".PHP_EOL
		."ipInfo : ".$_SERVER['REMOTE_ADDR'].' - '.date("F j, Y, g:i a").PHP_EOL
		."href : ".$href.PHP_EOL
		."emit Type : ".$emitType.PHP_EOL
		."emit Data : ".$emitData.PHP_EOL
		."--------------------------------------------------".PHP_EOL
		.PHP_EOL;
//Save string to log, use FILE_APPEND to append.
file_put_contents('./data/'.$appId.'/log_'.date("Y_n_j").'.txt', $log, FILE_APPEND);

//SERVER SIDE


//header("Content-Type: application/json");
echo $_GET['callback'] . '(' . "{'result' : 'done'}" . ')';      
?>