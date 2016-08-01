/*
Finds all timeAppCategorys non-disabled timeAppCategorys
*/

SELECT
    [timeAppCategoryId]
  , [categoryId]
  , [sum]
  , [probabilityPercentage]
  , [timeAppReportId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategory]
WHERE [isDisabled] = 0
