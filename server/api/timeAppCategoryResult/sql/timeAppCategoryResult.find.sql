/*
Finds all timeAppCategoryResults non-disabled timeAppCategoryResults
*/

SELECT
    [timeAppCategoryResultId]
  , [description]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryResult]
WHERE [isDisabled] = 0
