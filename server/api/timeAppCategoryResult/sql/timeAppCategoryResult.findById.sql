/*
Finds the timeAppCategoryResult at @timeAppCategoryResultId
*/

SELECT
    [timeAppCategoryResultId]
  , [timeAppCategoryId]
  , [timeAppCategoryScoreId]
  , [timeAppReportId]
  , [colName]
  , [value]
  , [categoryId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryResult]
WHERE [timeAppCategoryResultId] = @timeAppCategoryResultId
  AND [isDisabled] = 0
