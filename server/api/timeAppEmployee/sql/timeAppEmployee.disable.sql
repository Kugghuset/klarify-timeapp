/*
Disables the timeAppEmployee at @timeAppEmployeeId
*/

UPDATE [dbo].[TimeAppEmployee]
SET
    [isDisabled] = 1
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppEmployeeId] = @timeAppEmployeeId