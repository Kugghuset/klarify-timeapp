/*
Updates a timeAppCategoryResult to db and selects it.
*/

-- Update the timeAppCategoryResult
UPDATE [dbo].[TimeAppCategoryResult]
SET
    [isMatch] = @isMatch
  , [timeAppCategoryId] = @timeAppCategoryId
  , [timeAppCategoryScoreId] = @timeAppCategoryScoreId
  , [timeAppReportId] = @timeAppReportId
  , [colName] = @colName
  , [value] = @value
  , [categoryId] = @categoryId
  , [timeAppCategoryBlobId] = @timeAppCategoryBlobId
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryResultId] = @timeAppCategoryResultId

-- Select it
SELECT
    [timeAppCategoryResultId]
  , [isMatch]
  , [timeAppCategoryId]
  , [timeAppCategoryScoreId]
  , [timeAppReportId]
  , [colName]
  , [value]
  , [categoryId]
  , [timeAppCategoryBlobId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryResult]
WHERE [timeAppCategoryResultId] = @timeAppCategoryResultId
