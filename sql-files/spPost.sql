ALTER PROCEDURE spPost (
	@Url AS NVARCHAR(255), 
	@Body AS NVARCHAR(MAX)
)
AS
BEGIN
DECLARE @Object AS INT;
DECLARE @ResponseText AS VARCHAR(8000);


EXEC sp_OACreate 'MSXML2.XMLHTTP', @Object OUT;
EXEC sp_OAMethod @Object, 'open', NULL, 'post',@Url, 'false'

EXEC sp_OAMethod @Object, 'setRequestHeader', null, 'Content-Type', 'application/json'
EXEC sp_OAMethod @Object, 'send', null, @body
 
EXEC sp_OAMethod @Object, 'responseText', @ResponseText OUTPUT
--SELECT @ResponseText

EXEC sp_OADestroy @Object
END