/*
Creates a timeAppCategoryResult to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppCategoryResult
INSERT INTO [dbo].[TimeAppCategoryResult] (
    [isMatch]
  , [timeAppCategoryScoreId]
  , [timeAppReportId]
  , [colName]
  , [value]
  , [categoryId]
  , [timeAppCategoryBlobId]
)
VALUES (
    @isMatch
  , @timeAppCategoryScoreId
  , @timeAppReportId
  , @colName
  , @value
  , @categoryId
  , @timeAppCategoryBlobId
)

SELECT @id = SCOPE_IDENTITY()

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
  WHERE [timeAppCategoryResultId] = @id
