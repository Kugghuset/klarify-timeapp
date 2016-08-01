/*
Finds all timeAppCategorys non-disabled timeAppCategorys
*/

SELECT
    [timeAppCategoryId]
  , [description]
  , [timeAppReportId]
  , [customerName]
  , [projectName]
  , [code]
  , [employeeName]
  , [employeeId]
  , [categoryId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryRule]
WHERE [isDisabled] = 0
