/*
Merges the temp table into [dbo].[TimeAppEmployee].
*/

SET XACT_ABORT ON

BEGIN TRAN

/**
 * Try to update the table first,
 * setting the employeeId if found.
 */
UPDATE [dbo].[{table_name}]
SET [employeeId] = (
  SELECT TOP 1 [EmployeeId]
  FROM [dbo].[DimEmployee]
  WHERE [Employee] = [firstName]
)
WHERE [employeeId] IS NULL

/**
 * Perform the merge.
 */
INSERT INTO [dbo].[TimeAppEmployee] (
    [firstName]
  , [lastName]
  , [name]
  , [employeeId]
)
SELECT
    [firstName]
  , [lastName]
  , [name]
  , [employeeId]
FROM (
  MERGE [dbo].[TimeAppEmployee] AS [Target]
  USING (
    SELECT
        [firstName]
      , [lastName]
      , [name]
      , [employeeId]
    FROM [dbo].[{table_name}]
  ) AS [Source]

  /**
   * Really sketchy matching and won't work on bigger datasets
   * or for bigger companies.
   */
  ON [Target].[name] = [Source].[name]

  WHEN MATCHED AND (
       [Target].[firstName] != [Source].[firstName]
    OR [Target].[lastName] != [Source].[lastName]
    OR (
          [Source].[employeeId] IS NOT NULL
      AND (
            [Target].[employeeId] != [Source].[employeeId]
         OR [Target].[employeeId] IS NULL
      )
    )
  ) THEN UPDATE SET
      [Target].[firstName] = [Source].[firstName]
    , [Target].[lastName] = [Source].[lastName]
    , [Target].[name] = [Source].[name]
    , [Target].[employeeId] = [Source].[employeeId]
    , [Target].[dateUpdated] = GETUTCDATE()

  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
        [firstName]
      , [lastName]
      , [name]
      , [employeeId]
    ) VALUES (
        [Source].[firstName]
      , [Source].[lastName]
      , [Source].[name]
      , [Source].[employeeId]
    )
  OUTPUT $action AS [Action], [Source].*
) AS [MergeOutput]
  WHERE [MergeOutput].[Action] = NULL

DROP TABLE [dbo].[{table_name}]

COMMIT TRAN
