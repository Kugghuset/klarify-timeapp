/*
Creates a timeAppCategoryResult to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppCategoryResult
INSERT INTO [dbo].[TimeAppCategoryResult] (
    [timeAppCategoryScoreId]
  , [timeAppReportId]
  , [colName]
  , [value]
  , [categoryId]
)
VALUES (
    @timeAppCategoryScoreId
  , @timeAppReportId
  , @colName
  , @value
  , @categoryId
)

SELECT @id = SCOPE_IDENTITY()

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
  WHERE [timeAppCategoryResultId] = @id
