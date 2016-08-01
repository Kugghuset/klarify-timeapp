/*
Disables the timeAppCategoryCriteria at @timeAppCategoryCriteriaId
*/

UPDATE [dbo].[TimeAppCategoryCriteria]
SET
    [isDisabled] = 1
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryCriteriaId] = @timeAppCategoryCriteriaId