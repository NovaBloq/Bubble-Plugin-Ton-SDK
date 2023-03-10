function(instance, properties, context) {
	const { mtype, contract_address, method_name, parameters, chain } = properties
    const { callMethod } = instance.data.utils
    callMethod(mtype, contract_address, method_name, parameters, chain)
}