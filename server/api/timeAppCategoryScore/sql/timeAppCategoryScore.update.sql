/*
Updates a timeAppCategoryScore to db and selects it.
*/

-- Update the timeAppCategoryScore
UPDATE [dbo].[TimeAppCategoryScore]
SET
    [colName] = @colName
  , [value] = @value
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryScoreId] = @timeAppCategoryScoreId

-- Select it
SELECT
    [timeAppCategoryScoreId]
  , [colName]
  , [value]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryScore]
WHERE [timeAppCategoryScoreId] = @timeAppCategoryScoreId
