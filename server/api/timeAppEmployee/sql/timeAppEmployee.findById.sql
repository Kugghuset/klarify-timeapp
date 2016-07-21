/*
Finds the timeAppEmployee at @timeAppEmployeeId
*/

SELECT
    [timeAppEmployeeId]
  , [firstName]
  , [lastName]
  , [name]
  , [employeeId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppEmployee]
WHERE [timeAppEmployeeId] = @timeAppEmployeeId
  AND [isDisabled] = 0
