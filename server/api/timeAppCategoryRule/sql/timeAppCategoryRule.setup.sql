;WITH cteClassifications AS (
  SELECT
      [Customer]
    , [Project]
    , [Code]
    , [EmployeeID]
    , [CategoryID]
    , CASE
        WHEN [TimeAppReportId] IS NOT NULL THEN [TimeAppReportId]
        ELSE  (
          SELECT TOP 1 [timeAppReportId]
          FROM [dbo].[TimeAppReport] AS [TAR]
          WHERE 1=1
            AND [timeAppReportId] NOT IN (SELECT [TimeAppReportId]
                                          FROM [dbo].[FactKugghuset]
                                          WHERE [TimeAppReportId] IS NOT NULL)
            AND [dbo].[FactKugghuset].[Customer] = [TAR].[customerName]
            AND [dbo].[FactKugghuset].[Project] = [TAR].[projectName]
            AND [dbo].[FactKugghuset].[EmployeeId] = [TAR].[EmployeeId]
        )
      END AS [TimeAppReportId]
  FROM [dbo].[FactKugghuset]

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


-- ;WITH cteClassifications AS (
--   SELECT
--       [Customer]
--     , [Project]
--     , [Code]
--     , [CategoryID]
--     , [EmployeeID]
--     , [TimeAppReportId]
--   FROM [dbo].[FactKugghuset]
--   WHERE [CategoryID] IS NOT NULL
--     AND [EmployeeId] != 0
--   GROUP BY
--       [Customer]
--     , [Project]
--     , [Code]
--     , [CategoryID]
--     , [EmployeeID]
--     , [TimeAppReportId]
-- )

-- INSERT INTO [dbo].[TimeAppCategoryRule] (
--       [customerName]
--     , [projectName]
--     , [code]
--     , [employeeName]
--     , [employeeId]
--     , [categoryId]
--     , [TimeAppReportId]
-- )
-- SELECT
--     [C].[Customer]
--   , [C].[Project]
--   , [C].[Code]
--   , [E].[Employee]
--   , [C].[EmployeeId]
--   , [C].[CategoryId]
--   , [C].[TimeAppReportId]
-- FROM cteClassifications AS [C]

-- LEFT JOIN [dbo].[DimEmployee] AS [E]
-- ON [E].[EmployeeId] = [C].[EmployeeId]

-- LEFT JOIN [dbo].[DimCategory] AS [Ca]
-- ON [Ca].[CategoryId] = [C].[CategoryId]
