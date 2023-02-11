function(instance, properties, context) {
    const { Cell } = TonWeb.boc
    const { toNano } = TonWeb.utils
    const { data, triggerEvent, publishState } = instance
    const { reportDebugger } = context
    const { address, amount, valid_until } = properties
    
    const transaction = {
        validUntil: valid_until.getTime(),
        messages: [
            {
                address: address,
                amount: toNano(amount.toString()).toString(),
            }
        ]
    }
    
    publishState('transaction_pending', true)

    data.ton.sendTransaction(transaction).then(result => {
        publishState('transaction', result.boc)
        triggerEvent('sent')
    }).catch(data.utils.throwError).finally(() => {
    	publishState('transaction_pending', false)
    })
}