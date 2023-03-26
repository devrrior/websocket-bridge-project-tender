import amqp from "amqplib";

type ConnectFunctionReturnType = {
	channel: amqp.Channel;
	connection: amqp.Connection;
};

export default ConnectFunctionReturnType;
