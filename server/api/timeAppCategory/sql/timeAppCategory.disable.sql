/*
Disables the timeAppCategory at @timeAppCategoryId
*/

UPDATE [dbo].[TimeAppCategory]
SET
    [isDisabled] = 1
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryId] = @timeAppCategoryId