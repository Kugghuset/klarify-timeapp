/*
Finds the timeAppCategoryResult at @timeAppCategoryResultId
*/

SELECT
    [timeAppCategoryResultId]
  , [isMatch]
  , [timeAppCategoryId]
  , [timeAppCategoryScoreId]
  , [timeAppReportId]
  , [colName]
  , [value]
  , [categoryId]
  , [timeAppCategoryBlobId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryResult]
WHERE [timeAppCategoryResultId] = @timeAppCategoryResultId
  AND [isDisabled] = 0
