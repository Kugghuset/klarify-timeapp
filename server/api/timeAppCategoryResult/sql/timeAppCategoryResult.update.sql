/*
Updates a timeAppCategoryResult to db and selects it.
*/

-- Update the timeAppCategoryResult
UPDATE [dbo].[TimeAppCategoryResult]
SET
    [timeAppCategoryId] = @timeAppCategoryId
  , [timeAppCategoryScoreId] = @timeAppCategoryScoreId
  , [timeAppReportId] = @timeAppReportId
  , [colName] = @colName
  , [value] = @value
  , [categoryId] = @categoryId
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryResultId] = @timeAppCategoryResultId

-- Select it
SELECT
    [timeAppCategoryResultId]
  , [timeAppCategoryId]
  , [timeAppCategoryScoreId]
  , [timeAppReportId]
  , [colName]
  , [value]
  , [categoryId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryResult]
WHERE [timeAppCategoryResultId] = @timeAppCategoryResultId
