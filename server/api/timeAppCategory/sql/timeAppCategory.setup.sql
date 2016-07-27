;WITH cteClassifications AS (
  SELECT
      [Customer]
    , [Project]
    , [CategoryID]
    , [EmployeeID]
  FROM [dbo].[FactKugghuset]
  WHERE [CategoryID] IS NOT NULL
  GROUP BY
      [Customer]
    , [Project]
    , [CategoryID]
    , [EmployeeID]
)

--INSERT INTO [dbo].[TimeAppCategory] (
--    [customerName]
--  , [projectName]
--  , [employeeName]
--)
SELECT
    [C].[Customer]
  , [C].[Project]
  , [Ca].[Category]
  , [E].[Employee]
  , [C].[CategoryId]
  , [C].[EmployeeId]
FROM cteClassifications AS [C]

LEFT JOIN [dbo].[DimEmployee] AS [E]
ON [E].[EmployeeId] = [C].[EmployeeId]

LEFT JOIN [dbo].[DimCategory] AS [Ca]
ON [Ca].[CategoryId] = [C].[CategoryId]
