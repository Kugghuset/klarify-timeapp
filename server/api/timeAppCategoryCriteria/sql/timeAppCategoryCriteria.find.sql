/*
Finds all timeAppCategoryScores non-disabled timeAppCategoryScores
*/

SELECT
    [timeAppCategoryCriteriaId]
  , [colName]
  , [value]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryCriteria]
WHERE [isDisabled] = 0
