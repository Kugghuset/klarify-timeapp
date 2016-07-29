/*
Updates a timeAppCategoryCriteria to db and selects it.
*/

-- Update the timeAppCategoryCriteria
UPDATE [dbo].[TimeAppCategoryCriteria]
SET
    [colName] = @colName
  , [value] = @value
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryCriteriaId] = @timeAppCategoryCriteriaId

-- Select it
SELECT
    [timeAppCategoryCriteriaId]
  , [colName]
  , [value]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategoryCriteria]
WHERE [timeAppCategoryCriteriaId] = @timeAppCategoryCriteriaId
