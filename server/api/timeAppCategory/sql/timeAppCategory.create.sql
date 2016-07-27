/*
Creates a timeAppCategory to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppCategory
INSERT INTO [dbo].[TimeAppCategory] (
    [description]
  , [customerName]
  , [projectName]
  , [code]
  , [employeeName]
  , [employeeId]
  , [categoryId]
)
VALUES (
    @description
  , @customerName
  , @projectName
  , @code
  , @employeeName
  , @employeeId
  , @categoryId
)

SELECT @id = SCOPE_IDENTITY()

-- Select it
SELECT
    [timeAppCategoryId]
  , [description]
  , [customerName]
  , [projectName]
  , [code]
  , [employeeName]
  , [employeeId]
  , [categoryId]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppCategory]
  WHERE [timeAppCategoryId] = @id
