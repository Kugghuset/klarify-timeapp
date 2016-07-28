/*
Updates a timeAppCategory to db and selects it.
*/

-- Update the timeAppCategory
UPDATE [dbo].[TimeAppCategory]
SET
    [categoryId] = @categoryId§
  , [isGiven] = @isGiven
  , [totalValue] = @totalValue
  , [timeAppReportId] = @timeAppReportId
  , [timeAppCategoryBlobId] = @timeAppCategoryBlobId
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryId] = @timeAppCategoryId

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
WHERE [timeAppCategoryId] = @timeAppCategoryId
