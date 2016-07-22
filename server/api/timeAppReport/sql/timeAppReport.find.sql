/*
Finds all timeAppReports non-disabled timeAppReports
*/

SELECT
    [timeAppReportId]
  , [type]
  , [employeeName]
  , [date]
  , [customerName]
  , [projectName]
  , [comment]
  , [code]
  , [quantity]
  , [price]
  , [sum]
  , [employeeId]
  , [timeAppEmployeeId]
  , [isUpdated]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppReport]
WHERE [isDisabled] = 0
