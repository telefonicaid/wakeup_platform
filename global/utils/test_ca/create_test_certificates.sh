echo "Generating a test client/server certificates for wakeup platform ..."

CA_SUBJECT='/C=SP/ST=DummyState/L=DummyLocation/O=WakeUpPlatformOrg/CN=wakeupCA'
SERVER_SUBJECT='/C=SP/ST=DummyState/L=DummyLocation/O=WakeUpPlatformOrg/CN=wakeup.server.com'
CLIENT_SUBJECT='/C=SP/ST=DummyState/L=DummyLocation/O=WakeUpPlatformOrg/CN=client_test'

DEST='TEST_CERTIFICATES'
rm -rf $DEST
mkdir $DEST
cd $DEST

echo "Creating CA private key ..."
openssl genrsa -des3 -out ca.key 4096
echo "Creating CA certificate ..."
openssl req -new -x509 -days 365 -key ca.key -out ca.crt -subj $CA_SUBJECT

echo "Creating Server private key ..."
openssl genrsa -des3 -out server.key 1024
echo "Creating Server CSR ..."
openssl req -new -key server.key -out server.csr -subj $SERVER_SUBJECT
echo "Signing Server CSR and creating certificate ..."
openssl x509 -req -days 365 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt

echo "Creating Client private key ..."
openssl genrsa -des3 -out client.key 1024
echo "Creating Client CSR ..."
openssl req -new -key client.key -out client.csr -subj $CLIENT_SUBJECT
echo "Signing Client CSR and creating certificate ..."
openssl x509 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -out client.crt

echo "Removing server key password ..."
mv server.key server.key.org
openssl rsa -in server.key.org -out server.key

echo "Removing client key password ..."
mv client.key client.key.org
openssl rsa -in client.key.org -out client.key

echo "Generating a PKCS#12 for client certificate"
openssl pkcs12 -export -in client.crt -inkey client.key -out client.p12

cd ..
