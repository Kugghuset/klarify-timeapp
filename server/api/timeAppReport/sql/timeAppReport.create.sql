/*
Creates a timeAppReport to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppReport
INSERT INTO [dbo].[TimeAppReport] (
    [type]
  , [employeeName]
  , [date]
  , [customerName]
  , [projectName]
  , [comment]
  , [code]
  , [quantity]
  , [price]
  , [sum]
  , [employeeId]
  , [categoryId]
  , [timeAppEmployeeId]
)
VALUES (
    @type
  , @employeeName
  , @date
  , @customerName
  , @projectName
  , @comment
  , @code
  , @quantity
  , @price
  , @sum
  , @employeeId
  , @categoryId
  , @timeAppEmployeeId
)

SELECT @id = SCOPE_IDENTITY()

-- Select it
SELECT
    [timeAppReportId]
  , [type]
  , [employeeName]
  , [date]
  , [customerName]
  , [projectName]
  , [comment]
  , [code]
  , [quantity]
  , [price]
  , [sum]
  , [employeeId]
  , [categoryId]
  , [timeAppEmployeeId]
  , [isUpdated]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppReport]
  WHERE [timeAppReportId] = @id
