/*
Creates a timeAppCategoryCriteria to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppCategoryCriteria
INSERT INTO [dbo].[TimeAppCategoryCriteria] (
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
    [timeAppCategoryCriteriaId]
  , [colName]
  , [value]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryCriteria]
  WHERE [timeAppCategoryCriteriaId] = @id
