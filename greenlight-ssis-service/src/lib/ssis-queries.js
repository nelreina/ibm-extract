exports.executionStatus = `
  SELECT TOP 16
	e.execution_id,
	e.package_name,
	e.status,
	status_desc = CASE e.status
						WHEN 1 THEN 'Created'
						WHEN 2 THEN 'Running'
						WHEN 3 THEN 'Cancelled'
						WHEN 4 THEN 'Failed'
						WHEN 5 THEN 'Pending'
						WHEN 6 THEN 'Ended Unexpectedly'
						WHEN 7 THEN 'Succeeded'
						WHEN 8 THEN 'Stopping'
						WHEN 9 THEN 'Completed'
					END,
	e.start_time,
	e.end_time,
	elapsed_time_min = datediff(SECOND, e.start_time, e.end_time)
  FROM
    [SSISDB].catalog.executions e
  WHERE
    e.project_name = '{{ssisProject}}'

  AND
    e.execution_id = ISNULL({{executionId}}, e.execution_id)
  ORDER BY 
    e.execution_id DESC
`;

exports.eventErrors = `
SELECT 
	event_message_id,
	message_time,
	message,
	package_name,
	event_name,
	message_source_name,
	execution_path
FROM 
	SSISDB.catalog.event_messages em 
WHERE 
	em.operation_id = {{executionId}} and
	em.event_name = 'OnError'
ORDER BY 
	em.event_message_id DESC
`;
