/*
Initializes the timeAppCategoryRule table
*/

IF (OBJECT_ID('TimeAppCategoryRule', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TimeAppCategoryRule] (
      [timeAppCategoryId] BigInt IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [description] VarChar(255) NULL
    , [customerName] VarChar(255) NULL -- Might be of relevance
    , [projectName] VarChar(255) NULL
    , [code] VarChar(255) NULL -- Might be used later
    , [employeeName] VarChar(512) NULL -- Mainly for debugging reasons
    , [employeeId] BigInt NULL
    , [categoryId] BigInt NULL -- Reference to [dbo].[DimCategory]
    , [dateCreated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [isDisabled] Bit DEFAULT 0 NULL -- Used for determining existance
  )
END
