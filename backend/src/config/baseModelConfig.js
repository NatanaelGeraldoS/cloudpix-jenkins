const { DataTypes } = require("sequelize");

module.exports = {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users", // Foreign key to the users table
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    commonOptions: {
        paranoid: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
        defaultScope: {
            attributes: { exclude: ["created_at", "updated_at", "deleted_at"] },
        },
        scopes: {
            withAuditFields: {
                attributes: {
                    include: ["created_at", "updated_at", "deleted_at"],
                },
            },
        },
    },
};
