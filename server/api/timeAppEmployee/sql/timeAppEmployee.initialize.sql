/*
Initializes the timeAppEmployee table
*/

IF (OBJECT_ID('TimeAppEmployee', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TimeAppEmployee] (
      [timeAppEmployeeId] BigInt IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [firstName] VarChar(255) NULL
    , [lastName] VarChar(255) NULL
    , [name] VarChar(512) NULL
    , [employeeId] BigInt NULL -- From DimEmployee.EmployeeID
    , [dateCreated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [isDisabled] Bit DEFAULT 0 NULL -- Used for determining existance
  )
END
