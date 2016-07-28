/*
Finds the timeAppCategory at @timeAppCategoryId
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
WHERE [timeAppCategoryId] = @timeAppCategoryId
  AND [isDisabled] = 0
