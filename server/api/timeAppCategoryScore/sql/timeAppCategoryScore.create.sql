/*
Creates a timeAppCategoryScore to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppCategoryScore
INSERT INTO [dbo].[TimeAppCategoryScore] (
    [colName]
  , [value]
)
VALUES (
    @colName
  , @value
)

SELECT @id = SCOPE_IDENTITY()

-- Select it
SELECT
    [timeAppCategoryScoreId]
  , [colName]
  , [value]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryScore]
  WHERE [timeAppCategoryScoreId] = @id
