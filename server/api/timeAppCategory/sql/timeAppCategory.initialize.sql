/*
Initializes the timeAppCategory table
*/

IF (OBJECT_ID('TimeAppCategory', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TimeAppCategory] (
      [timeAppCategoryId] BigInt IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [categoryId] BigInt NULL
    , [sum] Int DEFAULT 0
    , [probabilityPercentage] SmallInt NULL
    , [timeAppReportId] BigInt NULL
    , [dateCreated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [isDisabled] Bit DEFAULT 0 NULL -- Used for determining existance
  )
END
