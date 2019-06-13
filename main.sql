#SELECT * FROM message;
#SELECT message.* FROM message INNER JOIN conversation ON message.conversation_id = conversation.id WHERE message.conversation_id = 1 ORDER BY message.created_at ASC;
#SELECT COUNT(id) FROM message WHERE conversation_id = 27;
#SELECT COUNT(*) FROM conversation;
#DELETE FROM conversation WHERE id IN (23, 24, 25);
SELECT * FROM conversation;
