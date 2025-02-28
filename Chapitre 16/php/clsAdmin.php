<?php
	class clsAdmin
	{
		function read($command, $record, $bd)
		{
			$result = new stdClass();
			if (method_exists($this, $command))
			{
				$commandResult = $this->$command($record, $bd);
				$result->error = $commandResult->error;
				if ($result->error != 0)
				{
					$result->errorMessage = $commandResult->errorMessage;
				}
				else
				{
					$result->data = $commandResult->data;
				}
			}
			else
			{
				$result->error = -2;
				$result->errorMessage = "Commande inconnue...($command)";
			}
			return $result;
		}

		private function getData($sqlString, $bd, $paramArray)
		{
			$result = new stdClass();
			$sql = $bd->prepare($sqlString);
			try
			{
				$sql->execute($paramArray);
				$data = $sql->fetchAll(PDO::FETCH_OBJ);
				$result->error = 0;
				$result->data = $data;
			}
			catch (Exception $err)
			{
				$result->error = -3;
				$result->errorMessage = "Erreur SQL (".$err->getMessage().")";
			}
			return $result;
		}

		private function getCollectionList($record, $bd)
		{
			return $this->getData('Select COL_id, COL_label, COL_description, COL_type From col_collection', $bd, array());
		}

		private function getCollectionDetail($record, $bd)
		{
			$return = $this->getData('Select COL_id, COL_label, COL_description, COL_type From col_collection Where COL_id = :id', $bd, array('id' => $record));
			$fieldList = $this->getData('Select FLD_id, FLD_COL_id, FLD_name, FLD_label, FLD_type, FLD_description, FLD_minimum, FLD_maximum, FLD_length, FLD_image, FLD_choiceList From FLD_field Where FLD_COL_id = :id', $bd, array('id' => $record));
			$return->data[0]->dataFields = $fieldList->data;
			return $return;
		}

		function write($command, $allData, $bd)
		{
			$result = new stdClass();
			if (method_exists($this, $command))
			{
				$commandResult = $this->$command($allData, $bd);
				$result->error = $commandResult->error;
				if ($result->error != 0)
				{
					$result->errorMessage = $commandResult->errorMessage;
				}
				else
				{
					$result->data = $commandResult->data;
				}
			}
			else
			{
				$result->error = -2;
				$result->errorMessage = "Commande inconnue...($command)";
			}
			return $result;
		}

		private function setData($sqlString, $bd, $paramArray)
		{
			$result = new stdClass();
			$sql = $bd->prepare($sqlString);
			try
			{
				$sql->execute($paramArray);
				$data = $bd->lastInsertId();
				$result->error = 0;
				$result->data = $data;
			}
			catch (Exception $err)
			{
				$result->error = -3;
				$result->errorMessage = "Erreur SQL (".$err->getMessage().")";
			}
			return $result;
		}

		private function createCollection($allData, $bd)
		{
			$result = $this->setData('Insert Into col_collection (COL_label) Values ("Nouvelle collection")', $bd, array());
		 	if ($result->error == 0)
		 	{
		 		try
		 		{
		 			$sqlRequest = $bd->prepare('Create Table COR_collectionRecord_'.$result->data.' (COR_id int not null auto_increment primary key)');
					$sqlRequest->execute();
				}
		 		catch (Exception $err)
		 		{
			 	}
		 	}
		 	return $result;
		}

		private function updateCollectionProperty($allData, $bd)
		{
			$paramArray = array($allData->fieldName => $allData->fieldValue, 'colId' => $allData->record);
			return $this->setData('Update col_collection Set '.$allData->fieldName.' = :'.$allData->fieldName.' Where COL_id = :colId', $bd, $paramArray);
		}

		private function deleteCollection($allData, $bd)
		{
			$result = new stdClass();
			$sql = $bd->prepare('Delete From col_collection Where COL_id = :id');
			try
			{
				$sql->execute(array('id' => $allData->record));
				$result->error = 0;
				$result->data = $data;
				$sql = $bd->prepare('Drop Table COR_collectionRecord_'.intval($allData->record));
				$sql->execute();
			}
			catch (Exception $err)
			{
				$result->error = -5;
				$result->errorMessage = "Erreur SQL (".$err->getMessage().")";
			}
			return $result;
		}

	}
?>
