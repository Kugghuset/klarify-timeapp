/*
Finds all timeAppCategoryBlobs non-disabled timeAppCategoryBlobs
*/

SELECT
    [timeAppCategoryBlobId]
  , [timeAppReportId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryBlob]
WHERE [isDisabled] = 0
