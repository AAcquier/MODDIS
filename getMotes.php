<?php 

try{
	require 'vendor/autoload.php';//Gets the MongoDB driver

	$client = new MongoDB\Client;//Connects to MongoDB

	$demodb = $client-> DemoDB2;//Select the database
	
	$collection = $demodb-> mote;//Select the collection
	
	$getMote = $collection->find();//Does the query

	/* This funtion transform each strings into JSON objects store them into an array and the array is transformed into a string JSON object*/
	function array_to_object($getMote) {

		foreach($getMote as $mote){
			$resMote = (object) json_decode(json_encode($mote),true);
			$moteArr[] = clone $resMote;
		}
		$jsonMoteArr = json_encode($moteArr);
		echo $jsonMoteArr;
	}
	array_to_object($getMote);
	
}catch (MongoDB\Driver\Exception\Exception $e) {

    $filename = basename(getmotes.php);
    
    echo "The getmotes.php script has experienced an error.\n"; 
    echo "It failed with the following exception:\n";
    
    echo "Exception:", $e->getMessage(), "\n";
    echo "In file:", $e->getFile(), "\n";
    echo "On line:", $e->getLine(), "\n";       
}

?>