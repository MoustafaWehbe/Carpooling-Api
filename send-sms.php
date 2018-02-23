<?php
require_once './vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
$x = array('status' => 'ok', 'message' => 'verification sent');
print(json_encode($x));
die();

// $NEXMO_TO= $_REQUEST['mobile'] ;
$NEXMO_TO = '+96179151873';
//var_dump($NEXMO_TO);
$NEXMO_FROM='CarpoolingApp';
$MESSAGE='Welcome to Carpooling App';

$client = $client = new Nexmo\Client(new Nexmo\Client\Credentials\Basic('4fde44d7', 
'67654dcb6d56e004'));



$message = $client->message()->send([
'to' => $NEXMO_TO,
'from' => $NEXMO_FROM,	
'text' => $MESSAGE
]);
//var_dump($message);


$verification = $client->verify()->start([
    'number' => $NEXMO_TO,
    'brand'  => 'My App'
]);

//echo "Sent message to " . $message['to'] . ". Balance is now " . 
//$message['remaining-balance'] . PHP_EOL;

?>
