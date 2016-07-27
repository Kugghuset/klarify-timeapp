/*
Disables the timeAppCategoryScore at @timeAppCategoryScoreId
*/

UPDATE [dbo].[TimeAppCategoryScore]
SET
    [isDisabled] = 1
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryScoreId] = @timeAppCategoryScoreId