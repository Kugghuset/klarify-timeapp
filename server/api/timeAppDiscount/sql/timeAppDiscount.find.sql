/*
Finds all timeAppDiscounts non-disabled timeAppDiscounts
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
WHERE [isDisabled] = 0
