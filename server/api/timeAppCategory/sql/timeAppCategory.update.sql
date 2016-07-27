/*
Updates a timeAppCategory to db and selects it.
*/

-- Update the timeAppCategory
UPDATE [dbo].[TimeAppCategory]
SET
    [description] = @description
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
WHERE [timeAppCategoryId] = @timeAppCategoryId
