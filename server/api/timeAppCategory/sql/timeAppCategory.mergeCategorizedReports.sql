/**
 * Merges [dbo].[{table_name}] into [dbo].[TimeAppCategory] and updates
 * [dbo].[TimeAppReport] with given categoryId.
 */

SET XACT_ABORT ON

BEGIN TRAN

/**
 * Only perform the merge if there actually is a table to merge from.
 */
IF (OBJECT_ID('{table_name}', 'U') IS NOT NULL)
BEGIN

  /**
  * Merge [dbo].[{table_name}] into [TimeAppCategory].
  */
  MERGE [dbo].[TimeAppCategory] AS [Target]
  USING [dbo].[{table_name}] AS [Source]

  ON [Target].[timeAppReportId] = [Source].[timeAppReportId]

  WHEN MATCHED AND (
    -- Somehow the categoryIds doesn't match.
    ISNULL([Target].[categoryId], -1) != ISNULL([Source].[categoryId], -1)
    OR [Target].[sum] != [Source].[sum]
    OR [Target].[probabilityPercentage] != [Source].[probabilityPercentage]
  ) THEN UPDATE SET
      [Target].[categoryId] = [Source].[categoryId]
    , [Target].[sum] = [Source].[sum]
    , [Target].[probabilityPercentage] = [Source].[probabilityPercentage]
    , [Target].[dateUpdated] = GETUTCDATE()

  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
      [categoryId]
    , [sum]
    , [probabilityPercentage]
    , [timeAppReportId]
    ) VALUES (
      [Source].[categoryId]
    , [Source].[sum]
    , [Source].[probabilityPercentage]
    , [Source].[timeAppReportId]
    )
  ; -- This semicolon is more important than life.

  MERGE [dbo].[TimeAppReport] AS [Target]
  USING [dbo].[{table_name}] AS [Source]

  ON [Target].[timeAppReportId] = [Source].[timeAppReportId]

  WHEN MATCHED AND (
    -- Somehow the categoryIds doesn't match.
    ISNULL([Target].[categoryId], -1) != ISNULL([Source].[categoryId], -1)
  ) THEN UPDATE SET
      [Target].[categoryId] = [Source].[categoryId]
    , [Target].[isUpdated] = 1
    , [Target].[dateUpdated] = GETUTCDATE()
  ; -- This semicolon is also more important than life.
  /**
  * Drop the temp table as it's finished now.
  */
  DROP TABLE [dbo].[{table_name}]

END

COMMIT TRAN
