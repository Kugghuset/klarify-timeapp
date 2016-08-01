/*
Creates a timeAppCategory to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppCategory
INSERT INTO [dbo].[TimeAppCategory] (
    [categoryId]
  , [sum]
  , [probabilityPercentage]
  , [timeAppReportId]
)
VALUES (
    @categoryId
  , @sum
  , @probabilityPercentage
  , @timeAppReportId
)

SELECT @id = SCOPE_IDENTITY()

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
  WHERE [timeAppCategoryId] = @id
