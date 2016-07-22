
SELECT
    [TAE].[timeAppEmployeeId]
  , [TAE].[firstName]
  , [TAE].[lastName]
  , [TAE].[name]
  , [TAE].[employeeId]
  , [TAE].[dateCreated]
  , [TAE].[dateUpdated]
  , [TAE].[isDisabled]
FROM [dbo].[TimeAppEmployee] AS [TAE]

INNER JOIN [dbo].[{table_name}] AS [_temp]
ON
    [_temp].[firstName] = [TAE].[firstName]
AND [_temp].[lastName] = [TAE].[lastName]
AND [_temp].[name] = [TAE].[name]

DROP TABLE [dbo].[{table_name}]
