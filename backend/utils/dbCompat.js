const isDepartmentSchemaError = (err) => {
    if (!err) return false;

    const message = String(err.sqlMessage || err.message || '').toLowerCase();
    return (
        err.code === 'ER_NO_SUCH_TABLE' ||
        err.code === 'ER_BAD_FIELD_ERROR' ||
        message.includes('tbl_departments') ||
        message.includes('department_id') ||
        message.includes('department_name') ||
        message.includes('unknown column')
    );
}

module.exports = {
    isDepartmentSchemaError,
}
