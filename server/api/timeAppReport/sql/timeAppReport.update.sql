/*
Updates a timeAppReport to db and selects it.
*/

-- Update the timeAppReport
UPDATE [dbo].[TimeAppReport]
SET
    [type] = @type
  , [employeeName] = @employeeName
  , [date] = @date
  , [customerName] = @customerName
  , [projectName] = @projectName
  , [comment] = @comment
  , [code] = @code
  , [quantity] = @quantity
  , [price] = @price
  , [sum] = @sum
  , [employeeId] = @employeeId
  , [timeAppEmployeeId] = @timeAppEmployeeId
  , [isUpdated] = 1
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppReportId] = @timeAppReportId

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
  , [timeAppEmployeeId]
  , [isUpdated]
  , [dateCreated]
  , [dateUpdated]
  , [isDisabled]
FROM [dbo].[TimeAppReport]
WHERE [timeAppReportId] = @timeAppReportId
