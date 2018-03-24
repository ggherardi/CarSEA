<?php
include 'PHPConst.php';
include 'DBConnection.php';
include 'models\Models.php';
include 'TokenGenerator.php';
use Logger;
use Models;
use TokenGenerator;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);

class MessageService {
    private $dbContext;

    function __construct() {
    }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    /** */
    private function InsertNewMessage(){
        TokenGenerator::ValidateToken();
        Logger::Write("Processing InsertNewMessage request", $GLOBALS["CorrelationID"]);
        try {
            $message = json_decode($_POST["message"]);
            $userId = $message->userId;

            $this->dbContext->StartTransaction();

        }
        catch(Throwable $ex) {
            Logger::Write("Error while creating new message: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            $this->dbContext->RollBack();
            exit(json_encode($ex->getMessage()));
        }
    }
  
    private function InsertNewConversation(){
        Logger::Write("Creating new conversation", $GLOBALS["CorrelationID"]);
        try {
            $this->dbContext->StartTransaction();
            $conversation = json_decode($_POST["conversation"]);

            $query = 
                "INSERT INTO conversation (ConversationID, ConversationArchived)
                VALUES (DEFAULT, DEFAULT)";
            self::ExecuteQuery($query);
            $conversationID = $this->dbContext->GetLastID();

            foreach($conversation->participants as $participantID){
                $values .= "(DEFAULT, $participant, $conversationID),";
            }
            $values = rtrim($values, ",");
            $query =  
                "INSERT INTO conversation_participant (ConversationParticipantID, UserID, ConversationID)
                VALUES $values";
            self::ExecuteQuery($query);
            $this->dbContext->CommitTransaction();
            exit(json_encode($conversationID));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while creating new conversation: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            $this->dbContext->RollBack();
            exit(json_encode($ex->getMessage()));
        }
    }

    // Switcha l'operazione richiesta lato client
    function Init(){
        switch($_POST["action"]){
            case "insertNewMessage":
                self::InsertNewMessage();
            break;
            case "getMessages":
                // self::GetTrips();
                break;
            default: 
                exit(json_encode($_POST));
                break;
        }
    }
}
Logger::Write("Reached MessageService API", $GLOBALS["CorrelationID"]);   
// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
$MessageService = new MessageService();
$MessageService->Init();
?>