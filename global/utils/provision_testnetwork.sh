redis-cli hset operators '214-07' '{ "country": "Spain", "operator": "Telefónica Móviles España, SAU", "mccmnc": "214-07", "defaultNetwork": "networkTest" }'
redis-cli hset networks 'networkTest' '{ "host": "http://127.0.0.1:9000", "range": "10.0.0.0/8", "network": "214-07" }'

redis-cli hget networks 'networkTest'
redis-cli hget operators '214-07'