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
        try {
            Logger::Write("Processing InsertNewMessage request", $GLOBALS["CorrelationID"]);
            $message = json_decode($_POST["message"]);
            $userId = $message->userId;
            self::InsertMessage($message->ConversationID, $message->ConversationParticipantID, $message->ConversationMessage);
            self::GetMessages($message->ConversationID);
        }
        catch(Throwable $ex) {
            Logger::Write("Error while creating new message: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }
  
    private function InsertMessage($conversationID, $conversationParticipantID, $conversationMessage) {
        $slashedMessage = addslashes($message);
        if(strlen($slashedMessage < 1)) {
            return;
        }
        $query = 
            "INSERT INTO conversation_message (ConversationMessageID, 
                        ConversationID, 
                        ConversationParticipantID, 
                        ConversationMessage, 
                        ConversationTimestamp)
            VALUES(DEFAULT,
                    $conversationID,
                    $conversationParticipantID, 
                    '$slashedMessage', 
                    NOW())";
        $this->ExecuteQuery($query);
    }

    private function InsertNewConversation(){
        try {
            Logger::Write("Creating new conversation", $GLOBALS["CorrelationID"]);
            $this->dbContext->StartTransaction();
            $newConversation = json_decode($_POST["newConversation"]);

            $query = 
                "INSERT INTO conversation (ConversationID, ConversationTitle, ConversationArchived)
                VALUES (DEFAULT, '$newConversation->Title', DEFAULT)";
            $res = self::ExecuteQuery($query);
            Logger::Write("Insert new conversation result -> $res", $GLOBALS["CorrelationID"]);
            $conversationID = $this->dbContext->GetLastID();

            foreach($newConversation->Participants as $userID){
                $query =  
                "INSERT INTO conversation_participant (ConversationParticipantID, UserID, ConversationID)
                VALUES (DEFAULT, $userID, $conversationID)";
                Logger::Write("$query", $GLOBALS["CorrelationID"]);
                $res = self::ExecuteQuery($query);
                Logger::Write("Insert conversation participants result -> $res", $GLOBALS["CorrelationID"]);
            }
            $values = rtrim($values, ",");
            $messageSenderParticipantID = $this->dbContext->GetLastID();
            Logger::Write("messageSenderParticipantID -> $messageSenderParticipantID", $GLOBALS["CorrelationID"]);
            self::InsertMessage($conversationID, $messageSenderParticipantID, $newConversation->Message);

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

    private function GetConversations() {
        TokenGenerator::ValidateToken();
        try {
            Logger::Write("Retrieving conversations", $GLOBALS["CorrelationID"]);
            $userId = $_POST["userId"];
            if($userId == null ) {
                throw new Exception("Required parameter userId is missing");
            }

            $query = 
                "SELECT c.ConversationID,
                c.ConversationTitle,
                c_p.ConversationParticipantID
                FROM conversation_participant as c_p
                LEFT JOIN conversation as c
                ON c.ConversationID = c_p.ConversationID
                WHERE c_p.UserID = $userId";
                Logger::Write("$query", $GLOBALS["CorrelationID"]);
            $res = $this->dbContext->ExecuteQuery($query);
            $results = array();
            if($res) {
                while($row = $res->fetch_assoc()) {
                    $results[] = $row;
                }
            }
            exit(json_encode($results));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while retrieving conversations: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }

    private function GetExistingConversation() {
        TokenGenerator::ValidateToken();
        try {
            Logger::Write("Retrieving existing conversation", $GLOBALS["CorrelationID"]);
            $senderId = $_POST["senderId"];
            $receiverId = $_POST["receiverId"];
            if($senderId == null || $receiverId == null) {
                throw new Exception("Required parameter userId or receiver is missing");
            }

            $query = 
                "SELECT c.ConversationID,
                c.ConversationTitle,
                c_p.ConversationParticipantID
                FROM conversation_participant as c_p
                LEFT JOIN conversation as c
                ON c.ConversationID = c_p.ConversationID
                WHERE c_p.UserID = $senderId
                AND c_p.ConversationID = (SELECT ConversationID 
                                         FROM conversation_participant
                                         WHERE UserID = $receiverId)";
            Logger::Write("query: $query", $GLOBALS["CorrelationID"]);
            $res = $this->dbContext->ExecuteQuery($query);
            $results = array();
            if($res) {
                while($row = $res->fetch_assoc()) {
                    $results[] = $row;
                }
            }
            exit(json_encode($results));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while retrieving existing conversation: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }

    private function GetMessages($conversationID) {
        TokenGenerator::ValidateToken();
        try {
            Logger::Write("Retrieving messages", $GLOBALS["CorrelationID"]);
            $conversationID = isset($_POST["conversationID"]) ? $_POST["conversationID"] : $conversationID;
            if($conversationID == null ) {
                throw new Exception("Required parameter conversationID is missing");
            }

            $query = 
                "SELECT *
                FROM conversation_message as c_m
                WHERE c_m.ConversationID = $conversationID
                ORDER BY c_m.ConversationTimestamp";
            $res = $this->dbContext->ExecuteQuery($query);

            $results = array();
            while($row = $res->fetch_assoc()) {
                $results[] = $row;
            }
            exit(json_encode($results));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while retrieving conversations: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }

    // Switcha l'operazione richiesta lato client
    function Init(){
        $this->dbContext = new DBConnection();
        switch($_POST["action"]){
            case "insertNewMessage":
                self::InsertNewMessage();
            break;
            case "insertNewConversation":
                self::InsertNewConversation();
            break;
            case "getExistingConversation":
                self::GetExistingConversation();
            break;
            case "getConversations":
                self::GetConversations();
            break;
            case "getMessages":
                self::GetMessages();
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