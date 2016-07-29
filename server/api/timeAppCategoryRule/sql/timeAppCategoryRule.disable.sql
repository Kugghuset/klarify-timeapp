/*
Disables the timeAppCategoryRule at @timeAppCategoryId
*/

UPDATE [dbo].[TimeAppCategoryRule]
SET
    [isDisabled] = 1
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryId] = @timeAppCategoryId