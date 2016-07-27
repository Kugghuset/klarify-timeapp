/*
Finds the timeAppCategory at @timeAppCategoryId
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
WHERE [timeAppCategoryId] = @timeAppCategoryId
  AND [isDisabled] = 0
