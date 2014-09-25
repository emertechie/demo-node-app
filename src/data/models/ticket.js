module.exports = function(sequelize, DataTypes) {

    return sequelize.define("Ticket", {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        // number: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false }, // should really be an integer
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        assignedTo: { type: DataTypes.STRING }
    });
};