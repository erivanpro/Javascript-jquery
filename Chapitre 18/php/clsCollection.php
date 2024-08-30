<?php
	class clsCollection
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

		private function getCollectionData($record, $bd)
		{
			$result = new stdClass();
			$result->data = new stdClass();
			$tmp = $this->getData('Select * From COR_collectionRecord_'.intval($record), $bd, array());
			$result->data->collectionRecords = $tmp->data;
			$tmp = $this->getData('Select * From FLD_field Where FLD_COL_id = :id', $bd, array('id' => $record));
			$result->data->columnsDefinitions = $tmp->data;
			return $result;
		}

		private function saveElement($allData, $bd)
		{
			$result = new stdClass();
			$fieldValue = json_decode($allData->fieldValue);
			$fieldsList = join(array_keys(get_object_vars($fieldValue)), ',');
			if ($fieldValue->COR_id == '')
			{
				$varList = ':'.str_replace(',', ', :', $fieldsList);
				$valuesList = join(array_values(get_object_vars($fieldValue)), '|');
				$sqlString = 'Insert Into COR_collectionRecord_'.intval($allData->record).' ('.$fieldsList.') Values ('.$varList.')';
				$result = $this->setData ($sqlString, $bd, get_object_vars($fieldValue));
			}
			else
			{
				$sqlString = "Update COR_collectionRecord_".intval($allData->record).' Set';
				$sqlValues = array();
				foreach ($fieldValue as $k => $field)
				{
					if (substr($k, 0, 4) == 'FLD_')
					{
						$sqlString .= ' '.$k." = :".$k.',';
						$sqlValues[$k] = $field;
					}
					else
					{
						$sqlValues['id'] = $field;
					}
				}
				$sqlString = substr($sqlString, 0, strlen($sqlString) - 1).' Where COR_Id = :id';
				$result = $this->setData ($sqlString, $bd, $sqlValues);
			}
			return $result;
		}

		private function deleteElement($allData, $bd)
		{
			$paramArray = array('id' => $allData->fieldValue);
			return $this->setData('Delete From COR_collectionRecord_'.intval($allData->record).' Where COR_id = :id', $bd, $paramArray);
		}

	}

?>

