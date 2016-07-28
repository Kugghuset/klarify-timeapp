/*
Disables the timeAppCategoryBlob at @timeAppCategoryBlobId
*/

UPDATE [dbo].[TimeAppCategoryBlob]
SET
    [isDisabled] = 1
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryBlobId] = @timeAppCategoryBlobId