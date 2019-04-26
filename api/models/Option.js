module.exports = {
    primaryKey: 'id',

    attributes: {
        id: {
            type: 'number',
            autoIncrement: true
        },

        name: {
            type: 'string',
            unique: true,
            required: true,
            columnType: 'varchar(191)'
        },

        val: {
            type: 'json',
            required: true
        },

        createdAt: {
            type: 'string',
            columnType: 'datetime',
            autoCreatedAt: true
        },

        updatedAt: {
            type: 'string',
            columnType: 'datetime',
            autoUpdatedAt: true
        },
    }
};
