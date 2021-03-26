@echo off
REM generate keystore and json for Cordova Android apps
echo.
echo I seguenti file verranno creati o sovrascritti:
echo.
echo.- build.json
echo.- ^<filename^>.keystore
echo.- ^<filename^>.txt
echo.
SET /P NAME=Inserisci ^<filename^>: 
echo.

SET ALIAS="%NAME%-alias"

IF EXIST "%NAME%.keystore" (
    del /F /Q "%NAME%.keystore"
)
IF EXIST "%NAME%.txt" (
    del /F /Q "%NAME%.txt"
)
IF EXIST "build.json" (
    del /F /Q "build.json"
)

SET COMMONNAME=Giorgio Beggiora
SET ORGANIZATIONUNIT=Padova Mobile Team
SET ORGANIZATIONNAME=Sopra Steria S.p.A.
SET LOCALITYNAME=Padova
SET STATENAME=Italy
SET COUNTRYCODE=IT

FOR /F "tokens=* USEBACKQ" %%F IN (`openssl rand -base64 14`) DO (
SET KEYPASSWORD=%%F
)
FOR /F "tokens=* USEBACKQ" %%F IN (`openssl rand -base64 14`) DO (
SET STOREPASSWORD=%%F
)

REM https://docs.oracle.com/javase/8/docs/technotes/tools/windows/keytool.html
keytool -genkey -v -keystore "%NAME%.keystore" -storepass %STOREPASSWORD% -keypass %KEYPASSWORD% -alias %ALIAS% -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=%COMMONNAME%, OU=%ORGANIZATIONUNIT%, O=%ORGANIZATIONNAME%, L=%LOCALITYNAME%, S=%STATENAME%, C=%COUNTRYCODE%"

echo Fatto
echo.
echo [Memorizzazione di %NAME%.txt] in corso

FOR /F "tokens=* USEBACKQ" %%F IN (``) DO (
SET EXPORTCERT=%%F
)

> "%NAME%.txt" (
@echo STOREPASSWORD = %STOREPASSWORD%
@echo KEYPASSWORD   = %KEYPASSWORD%
@echo.
keytool -exportcert -keystore %NAME%.keystore -storepass %STOREPASSWORD% -list -v
)

echo Fatto
echo.
echo [Memorizzazione di build.json] in corso

> build.json (
@echo	{
@echo		"android": {
@echo			"release": {
@echo				"keystore": "%NAME%.keystore",
@echo				"storePassword": "%STOREPASSWORD%",
@echo				"alias": "%ALIAS%",
@echo				"password" : "%KEYPASSWORD%",
@echo				"keystoreType": "",
@echo				"packageType": "bundle"
@echo			}
@echo		}
@echo	}
)

echo Fatto
echo.

explorer /select,"%~dp0%NAME%.keystore"
