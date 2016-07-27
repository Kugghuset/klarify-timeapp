;WITH cteClassifications AS (
  SELECT
      [Customer]
    , [Project]
    , [Code]
    , [CategoryID]
    , [EmployeeID]
  FROM [dbo].[FactKugghuset]
  WHERE [CategoryID] IS NOT NULL
    AND [EmployeeId] != 0
  GROUP BY
      [Customer]
    , [Project]
    , [Code]
    , [CategoryID]
    , [EmployeeID]
)

--INSERT INTO [dbo].[TimeAppCategory] (
--      [customerName]
--      ,[projectName]
--      ,[code]
--      ,[employeeName]
--      ,[employeeId]
--      ,[categoryId]
--)
SELECT
    [C].[Customer]
  , [C].[Project]
  , [C].[Code]
  , [E].[Employee]
  , [C].[EmployeeId]
  , [C].[CategoryId]
FROM cteClassifications AS [C]

LEFT JOIN [dbo].[DimEmployee] AS [E]
ON [E].[EmployeeId] = [C].[EmployeeId]

LEFT JOIN [dbo].[DimCategory] AS [Ca]
ON [Ca].[CategoryId] = [C].[CategoryId]
