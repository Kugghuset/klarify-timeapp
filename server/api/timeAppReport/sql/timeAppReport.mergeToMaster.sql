/*
Merges data into [dbo].[FactKugghuset]
*/

SET XACT_ABORT ON

BEGIN TRAN

/**
 * Create a temp table for TimeAppReport
 * containing a RowNumber column to reduce the risk of dupliate
 * rows to zero (hopefully).
 *
 * Also contains contains a discount row and an adjustedAmount row
 * to ease with calculations in the merge.
 */
SELECT
    ROW_NUMBER() OVER(
      PARTITION BY
          [TAR].[employeeId]
        , [TAR].[date]
        , [TAR].[customerName]
        , [TAR].[projectName]
        , [TAR].[comment]
        , [TAR].[code]
        , [TAR].[quantity]
        , [TAR].[price]
        ORDER BY [TAR].[date] ASC, [TAR].[employeeId] ASC
    ) AS [RowNumber]
  , CASE
      WHEN [TAD].[discount] IS NOT NULL THEN [TAD].[discount]
      ELSE 0
    END AS [discount]
  , ROUND(CASE
      WHEN [TAD].[discount] IS NOT NULL THEN (1 - [TAD].[discount]) * [TAR].[quantity] * [TAR].[price]
      WHEN [TAR].[sum] IS NULL THEN 0
      ELSE [TAR].[quantity] * [TAR].[price]
    END, 2) AS [adjustedAmount]
  , [TAR].[date]
  , [TAR].[customerName]
  , [TAR].[projectName]
  , [TAR].[comment]
  , [TAR].[code]
  , [TAR].[quantity]
  , [TAR].[price]
  , [TAR].[sum]
  , [TAR].[employeeId]
  , [TAR].[categoryId]
  , [timeAppReportId]
INTO [dbo].[__TimeAppReport__]
FROM (
  SELECT *
  FROM [dbo].[TimeAppReport]
  WHERE [type] = 'Redovisning'
    AND [isUpdated] = 1
) AS [TAR]

LEFT JOIN [dbo].[TimeAppDiscount] AS [TAD]
ON [TAD].[customerName] = [TAR].[customerName]

IF NOT EXISTS (SELECT * FROM [dbo].[__TimeAppReport__])
BEGIN
  DROP TABLE [dbo].[__TimeAppReport__]
END
ELSE
BEGIN

  /**
   * Create a temp table for FactKugghuset
   * containing a RowNumber column to reduce the risk of dupliate
   * rows to zero (hopefully).
   */
  SELECT
      ROW_NUMBER() OVER(
        PARTITION BY
          [Date]
        , [Customer]
        , [Project]
        , [Comment]
        , [Code]
        , [Hours]
        , [Hourly Price]
        , [Total Amount]
        , [Discount]
        , [Adjusted Amount]
        , [EmployeeID]
        , [CategoryID]
        ORDER BY [Date] ASC, [EmployeeId] ASC
      ) AS [RowNumber]
    , [Date]
    , [Customer]
    , [Project]
    , [Comment]
    , [Code]
    , [Hours]
    , [Hourly Price]
    , [Total Amount]
    , [Discount]
    , [Adjusted Amount]
    , [EmployeeID]
    , [CategoryID]
    , [FactKugghusetId]
    , CASE
        WHEN [TimeAppReportId] IS NOT NULL THEN [TimeAppReportId]
        ELSE  (
          SELECT TOP 1 [timeAppReportId]
          FROM [dbo].[__TimeAppReport__] AS [TAR]
          WHERE 1=1
            AND [timeAppReportId] NOT IN (SELECT [TimeAppReportId]
                                          FROM [dbo].[FactKugghuset]
                                          WHERE [TimeAppReportId] IS NOT NULL)
            AND [dbo].[FactKugghuset].[Date] = [TAR].[date]
            AND [dbo].[FactKugghuset].[Customer] = [TAR].[customerName]
            AND [dbo].[FactKugghuset].[Project] = [TAR].[projectName]
            AND [dbo].[FactKugghuset].[Hours] = [TAR].[quantity]
            AND [dbo].[FactKugghuset].[EmployeeId] = [TAR].[EmployeeId]
        )
      END AS [TimeAppReportId]
  INTO [dbo].[__FactKugghuset__]
  FROM [dbo].[FactKugghuset]

  /********************************************
   * Perform the merge between the temp tables
   * where the RowNumber column exists.
   ********************************************/
  MERGE [dbo].[__FactKugghuset__] AS [Target]
  USING [dbo].[__TimeAppReport__] AS [Source]

  /**
   * Matches on TimeAppReportId and RowNumber to ensure no duplicates exists.
   */
  ON [Target].[TimeAppReportId] = [Source].[timeAppReportId]
    AND ([Target].[RowNumber] IS NOT NULL AND [Target].[RowNumber] = [Source].[RowNumber])

  /**
   * When there is a match but some fields have changed,
   * update the values
   */
  WHEN MATCHED AND (
        ([Target].[Comment] IS NULL OR [Target].[Comment] != [Source].[comment])
      OR [Target].[Code] != [Source].[code]
      OR [Target].[Hourly Price] != [Source].[price]
      OR ISNULL([Target].[CategoryID], -1) != ISNULL([Source].[categoryId], -1)
  ) THEN UPDATE SET
      [Target].[Comment] = [Source].[comment]
    , [Target].[Code] = [Source].[code]
    , [Target].[Hourly Price] = [Source].[price]
    , [Target].[Adjusted Amount] = [Source].[adjustedAmount]
    , [Target].[Discount] = [Source].[discount]
    , [Target].[CategoryId] = [Source].[categoryId]

  /**
   * When there isn't a match,
   * insert a new row.
   */
  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
        [Date]
      , [Customer]
      , [Project]
      , [Comment]
      , [Code]
      , [Hours]
      , [Hourly Price]
      , [Total Amount]
      , [Discount]
      , [Adjusted Amount]
      , [EmployeeID]
      , [CategoryID]
      , [TimeAppReportId]
    ) VALUES (
        [Source].[date]
      , [Source].[customerName]
      , [Source].[projectName]
      , [Source].[comment]
      , [Source].[code]
      , [Source].[quantity]
      , [Source].[price]
      , [Source].[sum]
      , [Source].[discount]
      , [Source].[adjustedAmount]
      , [Source].[employeeId]
      , [Source].[categoryId]
      , [Source].[timeAppReportId]
    )
  ; -- This semicolon is more important than life.

  /**
   * Perform the merge into temp tables
   */
  MERGE [dbo].[FactKugghuset] AS [Target]
  USING [dbo].[__FactKugghuset__] AS [Source]

  ON [Target].[FactKugghusetId] = [Source].[FactKugghusetId]

  WHEN MATCHED
    AND (
        ([Target].[Comment] IS NULL OR [Target].[Comment] != [Source].[Comment])
      OR [Target].[Code] != [Source].[Code]
      OR [Target].[Hourly Price] != [Source].[Hourly Price]
      OR [Target].[TimeAppReportId] IS NULL
      OR ISNULL([Target].[CategoryID], -1) != ISNULL([Source].[CategoryID], -1)
    ) THEN UPDATE SET
        [Target].[Comment] = [Source].[Comment]
      , [Target].[Code] = [Source].[Code]
      , [Target].[Hourly Price] = [Source].[Hourly Price]
      , [Target].[Adjusted Amount] = [Source].[Adjusted Amount]
      , [Target].[Discount] = [Source].[Discount]
      , [Target].[TimeAppReportId] = [Source].[TimeAppReportId]
      , [Target].[CategoryID] = [Source].[CategoryID]

  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
        [Date]
      , [Customer]
      , [Project]
      , [Comment]
      , [Code]
      , [Hours]
      , [Hourly Price]
      , [Total Amount]
      , [Discount]
      , [Adjusted Amount]
      , [EmployeeID]
      , [CategoryID]
      , [TimeAppReportId]
    ) VALUES (
        [Source].[Date]
      , [Source].[Customer]
      , [Source].[Project]
      , [Source].[Comment]
      , [Source].[Code]
      , [Source].[Hours]
      , [Source].[Hourly Price]
      , [Source].[Total Amount]
      , [Source].[Discount]
      , [Source].[Adjusted Amount]
      , [Source].[EmployeeID]
      , [Source].[CategoryID]
      , [Source].[TimeAppReportId]
    )
  ; -- This semicolon is also more important than life.

  /**
   * Set [isUpdated] = 0 on all TimeAppReports in the merge(s).
   */
  UPDATE [dbo].[TimeAppReport] SET
      [isUpdated] = 0
    , [dateUpdated] = GETUTCDATE()
  WHERE [timeAppReportId] IN (SELECT [timeAppReportId] FROM [dbo].[__TimeAppReport__])

  /**
   * Clean up temp tables
   */
  DROP TABLE [dbo].[__TimeAppReport__]
  DROP TABLE [dbo].[__FactKugghuset__]
END
COMMIT TRAN
