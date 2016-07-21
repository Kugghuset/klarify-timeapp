/*
Finds all timeAppEmployees non-disabled timeAppEmployees
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
WHERE [isDisabled] = 0
