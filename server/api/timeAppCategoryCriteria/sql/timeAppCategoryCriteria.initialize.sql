/*
Initializes the timeAppCategoryCriteria table
*/

IF (OBJECT_ID('TimeAppCategoryCriteria', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TimeAppCategoryCriteria] (
      [timeAppCategoryCriteriaId] BigInt IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [colName] VarChar(255) NULL
    , [value] Int DEFAULT 0 NULL
    , [dateCreated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [isDisabled] Bit DEFAULT 0 NULL -- Used for determining existance
  )
END
