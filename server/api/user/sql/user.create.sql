/*
Creates a user to db and selects it.
*/

DECLARE @id BigInt

-- Insert the user
INSERT INTO [dbo].[User] (
    [name]
  , [email]
  , [password]
)
VALUES (
    @name
  , @email
  , @password
)

SELECT @id = SCOPE_IDENTITY()

-- Select it
SELECT
    [userId]
  , [name]
  , [email]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[User]
  WHERE [userId] = @id
