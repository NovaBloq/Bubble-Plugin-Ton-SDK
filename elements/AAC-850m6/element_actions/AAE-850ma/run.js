function(instance, properties, context) {
    const { data, publishState, triggerEvent } = instance
    const { universal_link, bridge_link, wallet_provider } = properties
    
    data.wp = data.wproviders.get(wallet_provider)
    
    const walletConnectionSource = {
        universalLink: data.wp.universalLink,
        bridgeUrl: data.wp.bridgeUrl
    }

    const universalLink = data.ton.connect(walletConnectionSource)
    
    publishState('deeplink', universalLink)
    triggerEvent('deeplink_generated')
}