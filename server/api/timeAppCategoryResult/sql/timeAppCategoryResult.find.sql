/*
Finds all timeAppCategoryResults non-disabled timeAppCategoryResults
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
WHERE [isDisabled] = 0
