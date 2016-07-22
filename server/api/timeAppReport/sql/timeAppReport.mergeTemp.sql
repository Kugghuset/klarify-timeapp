/*
Merges the temp table into [dbo].[TimeAppReport].
*/

SET XACT_ABORT ON

BEGIN TRAN

INSERT INTO [dbo].[TimeAppReport] (
    [type]
  , [employeeName]
  , [date]
  , [customerName]
  , [projectName]
  , [comment]
  , [code]
  , [quantity]
  , [price]
  , [sum]
  , [employeeId]
  , [timeAppEmployeeId]
)
SELECT
    [type]
  , [employeeName]
  , [date]
  , [customerName]
  , [projectName]
  , [comment]
  , [code]
  , [quantity]
  , [price]
  , [sum]
  , [employeeId]
  , [timeAppEmployeeId]
FROM (
  MERGE [dbo].[TimeAppReport] AS [Target]
  USING (
    SELECT
        [type]
      , [employeeName]
      , [date]
      , [customerName]
      , [projectName]
      , [comment]
      , [code]
      , [quantity]
      , [price]
      , [sum]
      , [employeeId]
      , [timeAppEmployeeId]
    FROM [dbo].[{table_name}]
  ) AS [Source]

  /**
   * There are literaly no unique keys,
   * so matching on these values
   */
  ON
        [Target].[type] = [Source].[type]
    AND [Target].[employeeId] = [Source].[employeeId]
    AND [Target].[date] = [Source].[date]
    AND [Target].[customerName] = [Source].[customerName]
    AND [Target].[projectName] = [Source].[projectName]
    AND [Target].[comment] = [Source].[comment]
    AND [Target].[code] = [Source].[code]
    AND [Target].[price] = [Source].[price]

  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
        [type]
      , [employeeName]
      , [date]
      , [customerName]
      , [projectName]
      , [comment]
      , [code]
      , [quantity]
      , [price]
      , [sum]
      , [employeeId]
      , [timeAppEmployeeId]
    ) VALUES (
        [Source].[type]
      , [Source].[employeeName]
      , [Source].[date]
      , [Source].[customerName]
      , [Source].[projectName]
      , [Source].[comment]
      , [Source].[code]
      , [Source].[quantity]
      , [Source].[price]
      , [Source].[sum]
      , [Source].[employeeId]
      , [Source].[timeAppEmployeeId]
    )
  OUTPUT $action AS [Action], [Source].*
) AS [MergeOutput]
  WHERE [MergeOutput].[Action] = NULL

DROP TABLE [dbo].[{table_name}]

COMMIT TRAN
