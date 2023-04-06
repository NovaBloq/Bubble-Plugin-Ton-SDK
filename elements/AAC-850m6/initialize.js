function(instance, context) {
    const { Address, fromNano, BN } = TonWeb.utils
    const { toUserFriendlyAddress } = TonConnectSDK
    const { publishState, triggerEvent, data } = instance
    const { reportDebugger } = context
    const env = {
        '-3': 'testnet',
        '-239': 'mainnet'
    }

    const utils = {
        checkConnected: () => publishState('connected', data.ton.connected),

        populateAccountStates: (acc) => {
            if (data.ton.connected)
                try {
                    publishState('chain', env[acc.account.chain])
                    publishState('address', toUserFriendlyAddress(acc.account.address))
                    publishState('hex_address', acc.account.address)
                    publishState('connected', true)

                    const addr = new Address(acc.account.address)

                    instance.data[env[acc.account.chain]].getBalance(addr).then(balance => {
                        publishState('balance', fromNano(balance))
                        publishState('balance_nano', balance)
                    }).catch(utils.throwError)

                    triggerEvent('connected')
                } catch (e) { }
        },

        throwError: (e) => {
            publishState('error', e.message)
            reportDebugger(e.message)
            triggerEvent('error')
        },

        storeWalletProviders: (wallets) => {
            data.wproviders = new Map()
            wallets.forEach(wp => {
                data.wproviders.set(wp.name, wp)
            })

            publishState('wallet_providers', wallets.map(wp => wp.name))
        },

        getWalletState: (address, chain) => {
            const addr = new Address(address)

            instance.data[chain ? 'testnet' : 'mainnet'].provider.getWalletInfo(address).then(wstate => {
                publishState('gws_balance', fromNano(wstate.balance))
                publishState('gws_balance_nano', wstate.balance)
                publishState('gws_last_transaction_hash', wstate.last_transaction_id.hash)
                publishState('gws_last_transaction_time', wstate.last_transaction_id.lt)
                publishState('gws_account_state', wstate.account_state)
                triggerEvent('state_fetched')
            }).catch(utils.throwError)
        },

        getTransactions: (address, chain, limit) => {
            const addr = new Address(address)

            publishState('fetching_transactions', true)

            instance.data[chain ? 'testnet' : 'mainnet'].getTransactions(addr, limit || 10).then(transactions => {
                publishState('transactions', transactions.map(JSON.stringify))
                triggerEvent('transactions_fetched')
            }).catch(utils.throwError).finally(() => {
                publishState('fetching_transactions', false)
            })
        },

        callMethod: (mtype, address, method, params, chain) => {
            publishState('method_run', true)

            instance.data[chain ? 'testnet' : 'mainnet'].call(new Address(address), method, params ? JSON.parse(params) : undefined).then(response => {
                if (response.exit_code !== 0) {
                    const err = new Error(`Http provider parse response error ${JSON.stringify(response)}`, response)
                    return utils.throwError(err)
                }

                const values = []

                response.stack.map(pair => {
                    switch (pair[0]) {
                        case "num":
                            values.push(new BN(pair[1].replace(/0x/, ''), 16).toString())
                            break
                        default:
                            utils.throwError(new Error("Unknown type " + pair[0]))
                    }
                })
                publishState('method_response', values)
                triggerEvent('method_run')
            }).catch(utils.throwError).finally(() => {
                publishState('method_run', false)
            })
        }
    }

    instance.data.utils = utils
}