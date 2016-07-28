/*
Updates a timeAppCategoryBlob to db and selects it.
*/

-- Update the timeAppCategoryBlob
UPDATE [dbo].[TimeAppCategoryBlob]
SET
    [timeAppReportId] = @timeAppReportId
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryBlobId] = @timeAppCategoryBlobId

-- Select it
SELECT
    [timeAppCategoryBlobId]
  , [timeAppReportId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryBlob]
WHERE [timeAppCategoryBlobId] = @timeAppCategoryBlobId
