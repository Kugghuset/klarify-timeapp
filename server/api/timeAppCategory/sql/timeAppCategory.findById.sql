/*
Finds the timeAppCategory at @timeAppCategoryId
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
WHERE [timeAppCategoryId] = @timeAppCategoryId
  AND [isDisabled] = 0
