/*
Merges data into [dbo].[FactKugghuset]

NOTE:
  - Creates duplicates as there is no way of getting completely unique rows as of yet (while still enjoying changes)
  - Table being merged into is _FactKugghuset instead of FactKugghuset
*/

SET XACT_ABORT ON

BEGIN TRAN

/**
 * Create temp table for outputting ids
 * of the rows used in the merge.
 */
CREATE TABLE [dbo].[__Fact_Merge__] ( [timeAppReportId] BigInt NULL )

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

/**
 * Create a temp table  for FactKugghuset
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
      , [CategoryID]
      , [EmployeeID]
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
  , [CategoryID]
  , [EmployeeID]
  , [FactKugghusetID]
  , [TimeAppReportId]
INTO [dbo].[__FactKugghuset__]
FROM [dbo].[_FactKugghuset]

/**
 * Try to populate old rows missing [TimeAppReportId]s
 * to supply a key for matching between the two tables.
 */
UPDATE [dbo].[__FactKugghuset__]
SET [TimeAppReportId] = (
  SELECT TOP 1 [timeAppReportId]
  FROM [dbo].[__TimeAppReport__] AS [TAR]
  WHERE 1=1
    AND [timeAppReportId] NOT IN (SELECT [TimeAppReportId]
                                  FROM [dbo].[__FactKugghuset__]
                                  WHERE [TimeAppReportId] IS NOT NULL)
    AND [dbo].[__FactKugghuset__].[Date] = [TAR].[date]
    AND [dbo].[__FactKugghuset__].[Customer] = [TAR].[customerName]
    AND [dbo].[__FactKugghuset__].[Project] = [TAR].[projectName]
    AND [dbo].[__FactKugghuset__].[Hours] = [TAR].[quantity]
    AND [dbo].[__FactKugghuset__].[EmployeeId] = [TAR].[EmployeeId]
)
WHERE [TimeAppReportId] IS NULL

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
WHEN MATCHED
  AND [Target].[RowNumber] = [Source].[RowNumber]
  AND (
      ([Target].[Comment] IS NULL OR [Target].[Comment] != [Source].[comment])
    OR [Target].[Code] != [Source].[code]
    OR [Target].[Hourly Price] != [Source].[price]
) THEN UPDATE SET
    [Target].[Comment] = [Source].[comment]
  , [Target].[Code] = [Source].[code]
  , [Target].[Hourly Price] = [Source].[price]
  , [Target].[Adjusted Amount] = [Source].[adjustedAmount]
  , [Target].[Discount] = [Source].[discount]

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
    , [Source].[timeAppReportId]
  )
/**
 * Insert [Source]'s timeAppReportIds into [dbo].[__Fact_Merge__]
 * to set actual rows with [isUpdated] = 0.
 */
OUTPUT [Source].[timeAppReportId] INTO [dbo].[__FACT_MERGE__]
; -- This semicolon is more important than life.

/**
 * Perform the merge into temp tables
 */
MERGE [dbo].[_FactKugghuset] AS [Target]
USING [dbo].[__FactKugghuset__] AS [Source]

ON [Target].[FactKugghusetID] = [Source].[FactKugghusetID]

WHEN MATCHED
  AND (
      ([Target].[Comment] IS NULL OR [Target].[Comment] != [Source].[Customer])
    OR [Target].[Code] != [Source].[Code]
    OR [Target].[Hourly Price] != [Source].[Hourly Price]
) THEN UPDATE SET
    [Target].[Comment] = [Source].[Customer]
  , [Target].[Code] = [Source].[Code]
  , [Target].[Hourly Price] = [Source].[Hourly Price]
  , [Target].[Adjusted Amount] = [Source].[Adjusted Amount]
  , [Target].[Discount] = [Source].[Discount]

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
    , [Source].[TimeAppReportId]
  )
; -- This semicolon is also more important than life.

/**
 * Perform the output.
 */
UPDATE [dbo].[TimeAppReport] SET
    [isUpdated] = 1
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppReportId] IN (SELECT * FROM [dbo].[__FACT_MERGE__])

/**
 * Clean up temp tables
 */
DROP TABLE [dbo].[__TimeAppReport__]
DROP TABLE [dbo].[__FactKugghuset__]
DROP TABLE [dbo].[__FACT_MERGE__]

COMMIT TRAN
