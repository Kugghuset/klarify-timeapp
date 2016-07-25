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
CREATE TABLE [dbo].[__Fact_Merge__] ( timeAppReportId BigInt NULL )

/**
 * Perform the merge.
 */
MERGE [dbo].[_FactKugghuset] AS [Target]
USING (
  SELECT
      CASE
        WHEN [TAD].[discount] IS NOT NULL THEN [TAD].[discount]
        ELSE 0
      END AS [discount]
    , ROUND(CASE
        WHEN [TAD].[discount] IS NOT NULL THEN (1 - [TAD].[discount]) * [TAR].[quantity] * [TAR].[price]
        WHEN [TAR].[sum] IS NULL THEN 0
        ELSE [TAR].[quantity] * [TAR].[price]
      END, 2) AS [adjustedAmount]
    , [TAR].*
  FROM (
    SELECT *
    FROM [dbo].[TimeAppReport]
    WHERE [type] = 'Redovisning'
      AND [isUpdated] = 1
  ) AS [TAR]

  LEFT JOIN [dbo].[TimeAppDiscount] AS [TAD]
  ON [TAD].[customerName] = [TAR].[customerName]
) AS [Source]

/**
 * This must be made better as it produces duplicates.
 */
ON
      [Target].[Date] = [Source].[date]
  AND [Target].[Customer] = [Source].[customerName]
  AND [Target].[Project] = [Source].[projectName]
  AND [Target].[Hours] = [Source].[quantity]
  AND [Target].[EmployeeId] = [Source].[employeeId]

WHEN MATCHED AND (
      ([Target].[Comment] IS NULL OR [Target].[Comment] != [Source].[comment])
    OR [Target].[Code] != [Source].[code]
    OR [Target].[Hourly Price] != [Source].[price]
) THEN UPDATE SET
    [Target].[Comment] = [Source].[comment]
  , [Target].[Code] = [Source].[code]
  , [Target].[Hourly Price] = [Source].[price]
  , [Target].[Adjusted Amount] = [Source].[adjustedAmount]
  , [Target].[Discount] = [Source].[discount]

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
  )
/**
 * Insert [Source]'s timeAppReportIds into [dbo].[__Fact_Merge__]
 * to set actual rows with [isUpdated] = 0.
 */
OUTPUT [Source].[timeAppReportId] INTO [dbo].[__Fact_Merge__]
;

/**
 * Perform the output.
 */
UPDATE [dbo].[TimeAppReport] SET
    [isUpdated] = 0
  , [dateUpdated] = GETUTCDATE()
WHERE [timeAppReportId] IN (SELECT * FROM [dbo].[__FACT_MERGE__])

/**
 * Drop the temp table
 */
DROP TABLE [dbo].[__FACT_MERGE__]

COMMIT TRAN