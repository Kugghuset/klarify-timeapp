/*
Creates a timeAppCategory to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppCategory
INSERT INTO [dbo].[TimeAppCategory] (
    [categoryId]
  , [isGiven]
  , [totalValue]
  , [timeAppReportId]
  , [timeAppCategoryBlobId]
)
VALUES (
    @categoryId
  , @isGiven
  , @totalValue
  , @timeAppReportId
  , @timeAppCategoryBlobId
)

SELECT @id = SCOPE_IDENTITY()

-- Select it
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
  WHERE [timeAppCategoryId] = @id
