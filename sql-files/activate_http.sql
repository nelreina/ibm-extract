
EXEC master.dbo.sp_configure 'show advanced options', 1
RECONFIGURE
EXEC sp_configure 'Ole Automation Procedures', 1;
GO

RECONFIGURE;
GO