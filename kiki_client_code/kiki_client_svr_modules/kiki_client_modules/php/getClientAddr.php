<?php
 header("Access-Control-Allow-Origin: *");
 header('Access-Control-Allow-Credentials: true');
echo('{"ipInfo" : "'.$_SERVER['REMOTE_ADDR'].'"}');
?>

