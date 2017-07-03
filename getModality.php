<?php 

try{
	require 'vendor/autoload.php';//Gets the MongoDB driver

	$client = new MongoDB\Client;//Connects to MongoDB

	$demodb = $client-> DemoDB2;//Select the database
	
	$collection = $demodb-> modality;//Select the collection
	
	$getModality = $collection->find();//Does the query
	
	/* This funtion transform each strings into JSON objects store them into an array and the array is transformed into a string JSON object*/
	function array_to_object($getModality) {
		foreach($getModality as $modality){
			$resModality = (object) json_decode(json_encode($modality),true);
			$modalityArr[] = clone $resModality;
		}
		$jsonModalityArr = json_encode($modalityArr);
		echo $jsonModalityArr;
	}
	array_to_object($getModality);
}catch (MongoDB\Driver\Exception\Exception $e) {

    $filename = basename(getModality.php);
    
    echo "The getModality.php script has experienced an error.\n"; 
    echo "It failed with the following exception:\n";
    
    echo "Exception:", $e->getMessage(), "\n";
    echo "In file:", $e->getFile(), "\n";
    echo "On line:", $e->getLine(), "\n";       
}

?>