/*
Disables the timeAppCategoryResult at @timeAppCategoryResultId
*/

UPDATE [dbo].[TimeAppCategoryResult]
SET
    [isDisabled] = 1
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryResultId] = @timeAppCategoryResultId