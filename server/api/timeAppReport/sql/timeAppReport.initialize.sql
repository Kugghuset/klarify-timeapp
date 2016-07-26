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
    , [price] Float NULL
    , [sum] Float NULL
    , [employeeId] BigInt NULL
    , [timeAppEmployeeId] BigInt NULL
    , [isUpdated] Bit DEFAULT 1 NULL
    , [dateCreated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [isDisabled] Bit DEFAULT 0 NULL -- Used for determining existance
  )
END

/********************************************************************
 * Ensures _FactKugghuset is up to par with what the system requires.
 ********************************************************************/

/**
 * Ensure [TimeAppReportId] exists on _FactKugghuset
 * by adding it if it doesn't exist.
 */
IF NOT EXISTS(SELECT * FROM sys.columns
              WHERE Name = N'TimeAppReportId'
                AND Object_ID = Object_ID(N'_FactKugghuset'))
BEGIN
  ALTER TABLE [dbo].[_FactKugghuset]
  ADD [TimeAppReportId] BigInt NULL
END

/**
 * Ensure [FactKugghusetID] exists on _FactKugghuset
 * by adding it if it doesn't exist.
 */
IF NOT EXISTS(SELECT * FROM sys.columns
              WHERE Name = N'FactKugghusetID'
                AND Object_ID = Object_ID(N'_FactKugghuset'))
BEGIN
  ALTER TABLE [dbo].[_FactKugghuset]
  ADD [FactKugghusetID] BigInt IDENTITY(1, 1) PRIMARY KEY NOT NULL
END
