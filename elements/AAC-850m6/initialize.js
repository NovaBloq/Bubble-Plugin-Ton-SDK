function(instance, context) {
    const { Address, fromNano } = TonWeb.utils
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
                
                const rpcUrl = acc.account.chain === '-3' ? 'https://testnet.toncenter.com/api/v2/jsonRPC' : 'https://toncenter.com/api/v2/jsonRPC'
                const apiKey = acc.account.chain === '-3' ? data.twtt || '6a191ce9cc4eed5dd8297536b0de779922d3bcae40c2c9881abc952a6f66471e' : data.twmt || '1e142e2922be09ee3d2804446e176333faa2a61e861d4f33b2ad0a5f21bb2943'


                const ton = new TonWeb(new TonWeb.HttpProvider(rpcUrl, { apiKey: apiKey }))
                const addr = new Address(acc.account.address)

                //ton.getTransactions(addr).then(console.log).catch(console.log)
                ton.getBalance(addr).then(balance => {
                    publishState('balance', fromNano(balance))
                    publishState('balance_nano', balance)
                }).catch(utils.throwError)

                triggerEvent('connected')
            } catch (e) {}
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
            const rpcUrl = chain ? 'https://testnet.toncenter.com/api/v2/jsonRPC' : 'https://toncenter.com/api/v2/jsonRPC'
            const apiKey = chain ? data.twtt || '6a191ce9cc4eed5dd8297536b0de779922d3bcae40c2c9881abc952a6f66471e' : data.twmt || '1e142e2922be09ee3d2804446e176333faa2a61e861d4f33b2ad0a5f21bb2943'
            const ton = new TonWeb(new TonWeb.HttpProvider(rpcUrl, { apiKey: apiKey }))
            const addr = new Address(address)

            ton.provider.getWalletInfo(address).then(wstate => {
                publishState('gws_balance', fromNano(wstate.balance))
                publishState('gws_balance_nano', wstate.balance)
                publishState('gws_last_transaction_hash', wstate.last_transaction_id.hash)
                publishState('gws_last_transaction_time', wstate.last_transaction_id.lt)
                publishState('gws_account_state', wstate.account_state)
                triggerEvent('state_fetched')
            }).catch(utils.throwError)
        },

        getTransactions: (address, chain, limit) => {
            const rpcUrl = chain ? 'https://testnet.toncenter.com/api/v2/jsonRPC' : 'https://toncenter.com/api/v2/jsonRPC'
            const apiKey = chain ? data.twtt || '6a191ce9cc4eed5dd8297536b0de779922d3bcae40c2c9881abc952a6f66471e' : data.twmt || '1e142e2922be09ee3d2804446e176333faa2a61e861d4f33b2ad0a5f21bb2943'
            const ton = new TonWeb(new TonWeb.HttpProvider(rpcUrl, { apiKey: apiKey }))
            const addr = new Address(address)
            
            publishState('fetching_transactions', true)

            ton.getTransactions(addr, limit || 10).then(transactions => {
                publishState('transactions', transactions.map(JSON.stringify))
                triggerEvent('transactions_fetched')
            }).catch(utils.throwError).finally(() => {
            	publishState('fetching_transactions', false)
            })
        }
    }

    instance.data.utils = utils
}