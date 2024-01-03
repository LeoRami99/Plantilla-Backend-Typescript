import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config";

class HolaMundoModel extends Model {
	public id!: number;
	public mensaje!: string;
}
HolaMundoModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		mensaje: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
	},
	{
		tableName: "hola_mundo",
		timestamps: false,
		sequelize: sequelize,
	}
);

export default HolaMundoModel;
