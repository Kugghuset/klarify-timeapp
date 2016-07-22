/*
Initializes the timeAppReport table
*/

IF (OBJECT_ID('TimeAppReport', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TimeAppReport] (
      [timeAppReportId] BigInt IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [type] VarChar(255) NULL
    , [employeeName] VarChar(512) NULL
    , [date] Date NULL
    , [customerName] VarChar(255) NULL
    , [projectName] VarChar(255) NULL
    , [comment] VarChar(MAX) NULL
    , [code] VarChar(255) NULL
    , [quantity] Float NULL
    , [price] Int NULL
    , [sum] Int NULL
    , [employeeId] BigInt NULL
    , [timeAppEmployeeId] BigInt NULL
    , [isUpdated] Bit DEFAULT 1 NULL
    , [dateCreated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [isDisabled] Bit DEFAULT 0 NULL -- Used for determining existance
  )
END
