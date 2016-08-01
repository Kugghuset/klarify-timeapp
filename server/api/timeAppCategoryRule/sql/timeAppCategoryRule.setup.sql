;WITH cteClassifications AS (
  SELECT
      [Customer]
    , [Project]
    , [Code]
    , [CategoryID]
    , [EmployeeID]
    , [TimeAppReportId]
  FROM [dbo].[_FactKugghuset]
  WHERE [CategoryID] IS NOT NULL
    AND [EmployeeId] != 0
  GROUP BY
      [Customer]
    , [Project]
    , [Code]
    , [CategoryID]
    , [EmployeeID]
    , [TimeAppReportId]
)

INSERT INTO [dbo].[TimeAppCategoryRule] (
      [customerName]
    , [projectName]
    , [code]
    , [employeeName]
    , [employeeId]
    , [categoryId]
    , [TimeAppReportId]
)
SELECT
    [C].[Customer]
  , [C].[Project]
  , [C].[Code]
  , [E].[Employee]
  , [C].[EmployeeId]
  , [C].[CategoryId]
  , [C].[TimeAppReportId]
FROM cteClassifications AS [C]

LEFT JOIN [dbo].[DimEmployee] AS [E]
ON [E].[EmployeeId] = [C].[EmployeeId]

LEFT JOIN [dbo].[DimCategory] AS [Ca]
ON [Ca].[CategoryId] = [C].[CategoryId]
