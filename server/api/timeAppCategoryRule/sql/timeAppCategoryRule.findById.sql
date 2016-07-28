/*
Finds the timeAppCategoryRule at @timeAppCategoryId
*/

SELECT
    [timeAppCategoryId]
  , [description]
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
WHERE [timeAppCategoryId] = @timeAppCategoryId
  AND [isDisabled] = 0
