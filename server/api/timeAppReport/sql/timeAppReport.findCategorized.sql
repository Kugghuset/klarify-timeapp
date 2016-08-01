SELECT
    [TAR].[timeAppReportId]
  , [TAR].[type]
  , [TAR].[date]
  , [TAR].[customerName]
  , [TAR].[projectName]
  , [TAR].[code]
  , [TAR].[employeeName]
  , [TAR].[employeeId]
  , [TAR].[categoryId]
  , [TAC].[timeAppCategoryId] AS [timeAppCategory.timeAppCategoryId]
  , [TAC].[categoryId] AS [timeAppCategory.categoryId]
  , [C].[Category] AS [timeAppCategory.categoryName]
  , [TAC].[probabilityPercentage] AS [timeAppCategory.probabilityPercentage]
FROM [dbo].[TimeAppReport] AS [TAR]

INNER JOIN [dbo].[TimeAppCategory] AS [TAC]
ON [TAC].[timeAppReportId] = [TAR].[timeAppReportId]

LEFT JOIN [dbo].[DimCategory] AS [C]
ON [C].[CategoryId] = [TAC].[categoryId]

WHERE [TAR].[isDisabled] = 0
  AND [TAR].[type] = 'Redovisning'
  AND [TAC].[probabilityPercentage] < 100
  {and_where}
