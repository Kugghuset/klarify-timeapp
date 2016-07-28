/*
Finds all timeAppCategorys non-disabled timeAppCategorys
*/

SELECT
    [timeAppCategoryId]
  , [categoryId]
  , [isGiven]
  , [totalValue]
  , [timeAppReportId]
  , [timeAppCategoryBlobId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategory]
WHERE [isDisabled] = 0
