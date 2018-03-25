<?php
require_once './vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// $NEXMO_TO= $_REQUEST['mobile'] ;
// $NEXMO_TO = '+96179151873';
//var_dump($NEXMO_TO);
$NEXMO_FROM='CarpoolingApp';
$MESSAGE='Welcome to Carpooling App';

$client = $client = new Nexmo\Client(new Nexmo\Client\Credentials\Basic('9ea9ec62', 'hqkupJC7HAcQQ0sw'));

$response = \Httpful\Request::get("https://api.nexmo.com/verify/check/json?api_key=9ea9ec62&api_secret=hqkupJC7HAcQQ0sw&code=3621&request_id=8c3fc77c268d4dd4a0b668305f45a4c8")
	->send();
var_dump($response->body);
die();
$response = \Httpful\Request::get("https://api.nexmo.com/verify/json?api_key=9ea9ec62&api_secret=hqkupJC7HAcQQ0sw&number=96179151873&brand=MyApp")
	->send();
var_dump($response->body);
// $message = $client->message()->send([
// 'to' => $NEXMO_TO,
// 'from' => $NEXMO_FROM,	
// 'text' => $MESSAGE
// ]);
//var_dump($message);


// $verification = $client->verify()->start([
//     'number' => '96179151873',
//     'brand'  => 'My App'
// ]);
// var_dump($verification);
// print("\n\n\n\n\n");
// try {
// 	var_dump($verification->responseJson->request_id);
	
// } catch (Exception $e) {
// 	print($e);
// }
//echo "Sent message to " . $message['to'] . ". Balance is now " . 
//$message['remaining-balance'] . PHP_EOL;


die();
?>
