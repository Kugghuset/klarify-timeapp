/*
Updates a timeAppEmployee to db and selects it.
*/

-- Update the timeAppEmployee
UPDATE [dbo].[TimeAppEmployee]
SET
    [description] = @description
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppEmployeeId] = @timeAppEmployeeId

-- Select it
SELECT
    [timeAppEmployeeId]
  , [firstName]
  , [lastName]
  , [middleNames]
  , [employeeId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppEmployee]
WHERE [timeAppEmployeeId] = @timeAppEmployeeId
