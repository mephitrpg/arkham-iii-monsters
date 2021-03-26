# generate keystore and json for Cordova Android apps
echo ""
echo "I seguenti file verranno creati o sovrascritti:"
echo ""
echo "- build.json"
echo "- <filename>.keystore"
echo "- <filename>.txt"
echo ""
read -p "Inserisci <filename>: " NAME
echo ""

ALIAS="$NAME-alias"

rm -f $NAME.keystore
rm -f $NAME.txt
rm -f build.json

COMMONNAME="Giorgio Beggiora"
ORGANIZATIONUNIT="Padova Mobile Team"
ORGANIZATIONNAME="Sopra Steria S.p.A."
LOCALITYNAME="Padova"
STATENAME="Italy"
COUNTRYCODE="IT"

STOREPASSWORD=$(openssl rand -base64 14)
KEYPASSWORD=$(openssl rand -base64 14)

# https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html
keytool -genkey -v -keystore $NAME.keystore -storepass $STOREPASSWORD -keypass $KEYPASSWORD -alias $ALIAS -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=$COMMONNAME, OU=$ORGANIZATIONUNIT, O=$ORGANIZATIONNAME, L=$LOCALITYNAME, S=$STATENAME, C=$COUNTRYCODE"

echo "Fatto"
echo ""
echo "[Memorizzazione di $NAME.txt] in corso"

EXPORTCERT=$(keytool -exportcert -keystore $NAME.keystore -storepass $STOREPASSWORD -list -v)

cat > $NAME.txt << EOM
STOREPASSWORD = $STOREPASSWORD
KEYPASSWORD   = $KEYPASSWORD
$EXPORTCERT
EOM

echo "Fatto"
echo ""
echo "[Memorizzazione di build.json] in corso"

cat > build.json << EOM
{
	"android": {
        "release": {
            "keystore": "$NAME.keystore",
            "storePassword": "$STOREPASSWORD",
            "alias": "$ALIAS",
            "password" : "$KEYPASSWORD",
            "keystoreType": "",
            "packageType": "bundle"
        }
    }
}
EOM

echo "Fatto"
echo ""

open -R $NAME.keystore
