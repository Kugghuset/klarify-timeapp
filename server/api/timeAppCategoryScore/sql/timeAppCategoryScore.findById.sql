/*
Finds the timeAppCategoryScore at @timeAppCategoryScoreId
*/

SELECT
    [timeAppCategoryScoreId]
  , [colName]
  , [value]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryScore]
WHERE [timeAppCategoryScoreId] = @timeAppCategoryScoreId
  AND [isDisabled] = 0
