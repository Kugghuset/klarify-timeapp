/*
Updates a timeAppDiscount to db and selects it.
*/

-- Update the timeAppDiscount
UPDATE [dbo].[TimeAppDiscount]
SET
    [customerName] = @customerName
  , [projectName] = @projectName
  , [discount] = @discount
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppDiscountId] = @timeAppDiscountId

-- Select it
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
