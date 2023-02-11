function(instance, properties, context) {
	const { TonConnect, toUserFriendlyAddress, CHAIN } = TonConnectSDK
    const { data, publishState, triggerEvent } = instance
    const { reportDebugger } = context
    const { manifest_url, tonweb_testnet_token, tonweb_mainnet_token } = properties
    
    data.twtt = tonweb_testnet_token
    data.twmt = tonweb_mainnet_token
    
    const ton = new TonConnect({ manifestUrl: manifest_url })
    
    ton.getWallets().then(data.utils.storeWalletProviders).catch(data.utils.throwError)
    
    ton.restoreConnection().then(() => {
        data.utils.populateAccountStates(ton)
    }).catch(data.utils.throwError)
    
    const unsubscribe = ton.onStatusChange(data.utils.populateAccountStates, data.utils.throwError)
    
    data.ton = ton
}