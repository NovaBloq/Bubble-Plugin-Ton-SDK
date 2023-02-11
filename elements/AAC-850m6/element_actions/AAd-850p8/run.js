function(instance, properties, context) {
	const { address, chain } = properties
    const { getWalletState } = instance.data.utils
    
    getWalletState(address, chain)
}