function(instance, properties, context) {
    const { publishState : p} = instance
	const tx = JSON.parse(properties.transaction)
    const txid = tx['transaction_id']
    const inmsg = tx['in_msg']
    const outmsg = tx['out_msgs'][0] || {}
    
    // Tx base
    p('type', tx['@type'])
    p('data', tx['data'])
    p('fee', tx['fee'])
    p('other_fee', tx['other_fee'])
    p('storage_fee', tx['storage_fee'])
    p('time', tx['utime']*1000)
    p('hash', txid['hash'])
    p('logical_time', txid['lt'])
    
    // Tx msg In
    p('in_source', inmsg['source'])
    p('in_destination', inmsg['destination'])
    p('in_message', inmsg['message'])
    p('in_value', inmsg['value'])
    
    // Tx msg Out
    if (Object.keys(outmsg).length) p('is_tx_out', true)
    p('out_source', outmsg['source'])
    p('out_destination', outmsg['destination'])
    p('out_message', outmsg['message'])
    p('out_value', outmsg['value'])
}