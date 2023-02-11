function(instance, properties, context) {
	const { data, triggerEvent } = instance
    
    data.ton.disconnect().then(data.utils.checkConnected)
    
    triggerEvent('disconnected')
}