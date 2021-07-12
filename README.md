# peer-pass
A service facilitating in connecting peers together.

![peer-pass call flow diagram](./peer-pass.png)

## API
The API documentation can be found at:  
https://peer-pass.com

There are 2 endpoints:
- /api/peer/submit
- /api/peer/retrieve

The submit endpoint is used to submit an offer or answer SDP for a fellow peer to then retrieve.

The retrieve endpoint is used to pick up an offer or answer SDP that a fellow peer has submitted.