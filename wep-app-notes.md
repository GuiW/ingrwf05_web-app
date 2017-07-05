# Web App
## La différence entre une application native et une web app :
Pour une web app, on peut avoir 2 façon de faire :
- Site offline
- Webview

### Différence entre compilation et interprétation
Une application native est **compilée** et ne sera compatible qu'avec l'os qui utilisera le même langage que l'appli. On pourra donc exploiter au mieux les fonctionnalités de l'os.
Une fois l'applciation compilée, on a plus accès au code source.

Javascript est un langage interprété : Il est "lu" par le moteur javascript du nagivateur.
Les programmes compilés sont créer avec du code source compréhensible par l'être humain puis compilé en langage binaire. Une fois le programme compilé, on a plus accès au code source. 

En open source, on a le code source. Quand c'est compilé, on a uniquement l'exécutable.

Faire un code unique basé sur les standard du web puis on choisit si reste dans le domaine du web ou si on génère une application native (webview). **Cordova** est une couche javascript supplémentaire qu'on peut utiliser pour convertir une application web en native. Adobe a créé **PhoneGAD**.
