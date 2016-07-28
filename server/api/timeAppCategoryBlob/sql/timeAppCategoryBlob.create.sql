/*
Creates a timeAppCategoryBlob to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppCategoryBlob
INSERT INTO [dbo].[TimeAppCategoryBlob] (
    [timeAppReportId]
)
VALUES (
    @timeAppReportId
)

SELECT @id = SCOPE_IDENTITY()

-- Select it
SELECT
    [timeAppCategoryBlobId]
  , [timeAppReportId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryBlob]
  WHERE [timeAppCategoryBlobId] = @id
