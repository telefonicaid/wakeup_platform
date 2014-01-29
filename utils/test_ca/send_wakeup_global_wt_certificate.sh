curl -d 'ip=10.2.3.4&port=1234&mcc=214&mnc=07' -v -s -k --key TEST_CERTIFICATES/client.key --cert TEST_CERTIFICATES/client.crt https://localhost/global/wakeup/v1
