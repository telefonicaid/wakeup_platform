touch /tmp/TestingWakeupLoad
echo "Remove /tmp/TestingWakeupLoad to stop..."

C=0
while [ -e /tmp/TestingWakeupLoad ]; do
  curl -d 'ip=10.1.2.3&port=1234&netid=214-07' -k --key ../test_ca/TEST_CERTIFICATES/client.key --cert ../test_ca/TEST_CERTIFICATES/client.crt https://localhost/global/wakeup/v1 > /dev/null 2>&1 &
  let C=C+1
  sleep 0.01
done

echo ""
echo "Waiting for background processes to finish ..."
wait
echo ""
echo "=================================="
echo "Number of queries launched: $C"
