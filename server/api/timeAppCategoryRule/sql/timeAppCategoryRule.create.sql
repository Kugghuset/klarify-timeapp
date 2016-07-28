/*
Creates a timeAppCategoryRule to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppCategoryRule
INSERT INTO [dbo].[TimeAppCategoryRule] (
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
FROM [dbo].[TimeAppCategoryRule]
  WHERE [timeAppCategoryId] = @id
