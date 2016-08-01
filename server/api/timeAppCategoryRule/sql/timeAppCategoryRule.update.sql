/*
Updates a timeAppCategoryRule to db and selects it.
*/

-- Update the timeAppCategoryRule
UPDATE [dbo].[TimeAppCategoryRule]
SET
    [description] = @description
  , [timeAppReportId] = @timeAppReportId
  , [customerName] = @customerName
  , [projectName] = @projectName
  , [code] = @code
  , [employeeName] = @employeeName
  , [employeeId] = @employeeId
  , [categoryId] = @categoryId
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppCategoryId] = @timeAppCategoryId

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
WHERE [timeAppCategoryId] = @timeAppCategoryId
