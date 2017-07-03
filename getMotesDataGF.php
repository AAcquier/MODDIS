<?php 

try{
	require 'vendor/autoload.php';//Gets the MongoDB driver

	$client = new MongoDB\Client;//Connects to MongoDB

	$demodb = $client-> DemoDB2;//Select the database
	
	$collection = $demodb-> moteData;//Select the collection//$getMoteData = $collection->find();//Does the query
	
	$moteID= json_decode($_COOKIE["mote_IDGF"]);
	
	/* This funtion transform each strings into JSON objects store them into an array and the array is transformed into a string JSON object*/
	function array_to_object($moteID, $collection) {
		foreach ($moteID as $moteData){
			$cursor = $collection->find(array("mote_id"=>(int)$moteData));//Does the query
			foreach($cursor as $doc){
				$resMoteData =(object) json_decode(json_encode($doc),true);
				$moteDataArr[] = clone $resMoteData;
			}
		}
		$jsonMoteDataArr = json_encode($moteDataArr);
		echo $jsonMoteDataArr;
	}
	array_to_object($moteID, $collection);
	
	
}catch (MongoDB\Driver\Exception\Exception $e) {

    $filename = basename(getMoteData.php);
    
    echo "The getMoteData.php script has experienced an error.\n"; 
    echo "It failed with the following exception:\n";
    
    echo "Exception:", $e->getMessage(), "\n";
    echo "In file:", $e->getFile(), "\n";
    echo "On line:", $e->getLine(), "\n";       
}

?>