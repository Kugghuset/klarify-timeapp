/*
Finds the timeAppDiscount at @timeAppDiscountId
*/

SELECT
    [timeAppDiscountId]
  , [customerName]
  , [projectName]
  , [discount]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppDiscount]
WHERE [timeAppDiscountId] = @timeAppDiscountId
  AND [isDisabled] = 0
