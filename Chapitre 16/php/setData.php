<?php
	error_reporting(E_ALL & ~E_NOTICE);
	spl_autoload_register('autoload');
	$domain = isset($_REQUEST['domain']) ? $_REQUEST['domain'] : '';
	$command = isset($_REQUEST['command']) ? $_REQUEST['command'] : '';
	$record =  isset($_REQUEST['record']) ? $_REQUEST['record'] : '';
	$fieldName =  isset($_REQUEST['fieldName']) ? $_REQUEST['fieldName'] : '';
	$fieldValue =  isset($_REQUEST['fieldValue']) ? $_REQUEST['fieldValue'] : '';
	$return = new stdClass();
	if (file_exists("cls".ucfirst($domain).".php"))
	{
		$bd = new PDO("mysql:Server=localhost;dbname=COLLECTION", "collector", "12345");
		$bd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$RC = new ReflectionClass("cls".ucfirst($domain));
		$domainObject = $RC->newInstance();
		$allData = new stdClass();
		$allData->record = $record;
		$allData->fieldName = $fieldName;
		$allData->fieldValue = $fieldValue;
		$result = $domainObject->write($command, $allData, $bd);
		$return->error = $result->error;
		if ($result->errorMessage)
		{
			$return->errorMessage = $result->errorMessage;
		}
		else
		{
			$return->data = $result->data;
		}
	}
	else
	{
		$return->error = -1;
		$return->errorMessage = "Domaine inconnu...";
	}

	echo json_encode($return);

	function autoload($check)
	{
		$file = "$check.php";
		if (file_exists($file)) 
		{
			require_once $file;
		}
	}
?>
