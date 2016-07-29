/*
Updates a timeAppCategory to db and selects it.
*/

-- Update the timeAppCategory
UPDATE [dbo].[TimeAppCategory]
SET
    [categoryId] = @categoryId§
  , [sum] = @sum
  , [probabilityPercentage] = @probabilityPercentage
  , [timeAppReportId] = @timeAppReportId
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryId] = @timeAppCategoryId

-- Select it
SELECT
    [timeAppCategoryId]
  , [categoryId]
  , [sum]
  , [probabilityPercentage]
  , [timeAppReportId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategory]
WHERE [timeAppCategoryId] = @timeAppCategoryId
