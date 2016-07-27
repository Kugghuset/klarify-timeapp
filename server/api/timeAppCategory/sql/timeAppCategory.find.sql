/*
Finds all timeAppCategorys non-disabled timeAppCategorys
*/

SELECT
    [timeAppCategoryId]
  , [description]
  , [customerName]
  , [projectName]
  , [code]
  , [employeeName]
  , [timeAppEmployeeId]
  , [categoryId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategory]
WHERE [isDisabled] = 0
