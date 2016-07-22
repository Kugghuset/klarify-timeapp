/*
Disables the timeAppReport at @timeAppReportId
*/

UPDATE [dbo].[TimeAppReport]
SET
    [isDisabled] = 1
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppReportId] = @timeAppReportId