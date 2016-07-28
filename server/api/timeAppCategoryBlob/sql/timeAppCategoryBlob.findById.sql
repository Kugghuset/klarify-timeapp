/*
Finds the timeAppCategoryBlob at @timeAppCategoryBlobId
*/

SELECT
    [timeAppCategoryBlobId]
  , [timeAppReportId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryBlob]
WHERE [timeAppCategoryBlobId] = @timeAppCategoryBlobId
  AND [isDisabled] = 0
