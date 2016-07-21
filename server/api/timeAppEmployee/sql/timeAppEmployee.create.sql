/*
Creates a timeAppEmployee to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppEmployee
INSERT INTO [dbo].[TimeAppEmployee] (
    [firstName]
  , [lastName]
  , [name]
  , [employeeId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
)
VALUES (
    @firstName
  , @lastName
  , @name
  , @employeeId
  , @dateCreated
  , @dateUpdated
  , @isDisabled
)

SELECT @id = SCOPE_IDENTITY()

-- Select it
SELECT
    [timeAppEmployeeId]
  , [firstName]
  , [lastName]
  , [name]
  , [employeeId]
  , [dateCreated]
  , [dateUpdated]
FROM [dbo].[TimeAppEmployee]
  WHERE [timeAppEmployeeId] = @id
