/*
Finds all timeAppCategoryScores non-disabled timeAppCategoryScores
*/

SELECT
    [timeAppCategoryScoreId]
  , [colName]
  , [value]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryScore]
WHERE [isDisabled] = 0
