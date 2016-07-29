/*
Finds the timeAppCategoryCriteria at @timeAppCategoryCriteriaId
*/

SELECT
    [timeAppCategoryCriteriaId]
  , [colName]
  , [value]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryCriteria]
WHERE [timeAppCategoryCriteriaId] = @timeAppCategoryCriteriaId
  AND [isDisabled] = 0
