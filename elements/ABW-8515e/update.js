function(instance, properties, context) {
	const { toNano, fromNano } = TonWeb.utils
    const { value, convert } = properties
    const { publishState: p } = instance
    
    const converter = {
    	'To TON': fromNano,
        'To nanoTON': toNano
    }
    
    try {
    	p('result', converter[convert](value))
    } catch (e) {}
}