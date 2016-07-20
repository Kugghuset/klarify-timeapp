/*
Updates a user to db and selects it.

Note: the password is not updated this way.
*/

-- Update the user
UPDATE [dbo].[User]
SET
    [name] = @name
  , [email] = @email
  , [dateUpdated] = GETUTCDATE()
WHERE [userId] = @userId

-- Select it
SELECT
    [userId]
  , [name]
  , [email]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[User]
WHERE [userId] = @userId
