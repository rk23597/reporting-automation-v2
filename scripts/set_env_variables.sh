echo "get mail Subject.... "
mailSubject=$(cat mailSubject.txt)
echo "##teamcity[setParameter name='env.mailSubject' value='$mailSubject']"

echo "Reading reportStatusURL....."
reportStatusURL=$(cat report_status_URL.txt)
echo "##teamcity[setParameter name='env.reportStatusURL' value='$reportStatusURL']"
