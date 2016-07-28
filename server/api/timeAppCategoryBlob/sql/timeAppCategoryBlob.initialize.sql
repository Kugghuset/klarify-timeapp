/*
Initializes the timeAppCategoryBlob table
*/

IF (OBJECT_ID('TimeAppCategoryBlob', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TimeAppCategoryBlob] (
      [timeAppCategoryBlobId] BigInt IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [timeAppReportId] BigInt NULL
    , [dateCreated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [isDisabled] Bit DEFAULT 0 NULL -- Used for determining existance
  )
END
