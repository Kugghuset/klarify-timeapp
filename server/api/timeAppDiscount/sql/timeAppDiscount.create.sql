/*
Creates a timeAppDiscount to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppDiscount
INSERT INTO [dbo].[TimeAppDiscount] (
    [customerName]
  , [projectName]
  , [discount]
)
VALUES (
    @customerName
  , @projectName
  , @discount
)

SELECT @id = SCOPE_IDENTITY()

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
  WHERE [timeAppDiscountId] = @id
