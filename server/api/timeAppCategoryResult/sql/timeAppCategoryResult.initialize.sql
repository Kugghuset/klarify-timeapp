/*
Initializes the timeAppCategoryResult table
*/

IF (OBJECT_ID('TimeAppCategoryResult', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TimeAppCategoryResult] (
      [timeAppCategoryResultId] BigInt IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [timeAppCategoryId] BigInt NULL
    , [timeAppCategoryScoreId] BigInt NULL
    , [timeAppReportId] BigInt NULL
    , [colName] VarChar(255) NULL -- Stored to consist until recalculation
    , [value] Int DEFAULT 0 NULL -- Stored to consist until recalculation
    , [categoryId] BigInt NULL
    , [dateCreated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [isDisabled] Bit DEFAULT 0 NULL -- Used for determining existance
  )
END
