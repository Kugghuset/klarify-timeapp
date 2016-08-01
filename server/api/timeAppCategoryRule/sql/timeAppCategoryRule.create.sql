/*
Creates a timeAppCategoryRule to db and selects it.
*/

DECLARE @id BigInt

-- Insert the timeAppCategoryRule
INSERT INTO [dbo].[TimeAppCategoryRule] (
    [description]
  , [timeAppReportId]
  , [customerName]
  , [projectName]
  , [code]
  , [employeeName]
  , [employeeId]
  , [categoryId]
)
VALUES (
    @description
  , @timeAppReportId
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
  , [timeAppReportId]
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
