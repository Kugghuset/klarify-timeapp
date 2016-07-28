/*
Finds all timeAppReports where [isUpdated] = 1
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
  , [categoryId]
  , [timeAppEmployeeId]
  , [isUpdated]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppReport]
WHERE [type] = 'Redovisning'
  AND [isUpdated] = 1
  AND [isDisabled] = 0
