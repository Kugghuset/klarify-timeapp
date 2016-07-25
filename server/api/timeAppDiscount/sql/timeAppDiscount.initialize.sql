/*
Initializes the timeAppDiscount table
*/

IF (OBJECT_ID('TimeAppDiscount', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[TimeAppDiscount] (
      [timeAppDiscountId] BigInt IDENTITY(1, 1) PRIMARY KEY NOT NULL
    , [customerName] VarChar(255) NULL
    , [projectName] VarChar(255) NULL
    , [discount] Float NULL
    , [dateCreated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [dateUpdated] DateTime2 DEFAULT GETUTCDATE() NULL
    , [isDisabled] Bit DEFAULT 0 NULL -- Used for determining existance
  )
END
