create PROCEDURE spExecSSIS(
@Folder NVARCHAR(100),
 @Project NVARCHAR(100),
 @Package NVARCHAR(100)

)
AS
BEGIN

	Declare @execution_id bigint
	EXEC [SSISDB].[catalog].[create_execution] @package_name=@Package, @execution_id=@execution_id OUTPUT, @folder_name=@Folder, @project_name=@Project, @use32bitruntime=False, @reference_id=2, @runinscaleout=False
	Select @execution_id [execution_id]
	DECLARE @var0 smallint = 1
	EXEC [SSISDB].[catalog].[set_execution_parameter_value] @execution_id,  @object_type=50, @parameter_name=N'LOGGING_LEVEL', @parameter_value=@var0
	EXEC [SSISDB].[catalog].[start_execution] @execution_id



END