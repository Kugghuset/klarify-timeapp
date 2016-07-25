/*
Disables the timeAppDiscount at @timeAppDiscountId
*/

UPDATE [dbo].[TimeAppDiscount]
SET
    [isDisabled] = 1
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppDiscountId] = @timeAppDiscountId