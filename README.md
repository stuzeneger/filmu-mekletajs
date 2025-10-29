#Palaišanas instrukcija:

1. Klonēt repozitoriju https://github.com/stuzeneger/filmu-mekletajs (vai izpakot arhīvu)
2. Backend PHP instalācija:
2.1.  Direktorijā backend no komandrindas palaist 
```sh
composer install
```
2.2.  Pārdēvēt .env.example uz .env un ielikt savu OMDb API atslēgu: OMDB_API_KEY=JŪSU_ATSLĒGA
3. Frontend VUE instalācija:
3.2.  Komandrindā palaist
```sh
npm install
```
3.3. Komandrindā palaist
```sh
npm run dev 
```
kas palaidīs dev serveri uz http://localhost:5173/ 

#Testi:
PHP unit testus palaišana no komandrindas:
Windows:
```sh
phpunit --bootstrap vendor/autoload.php tests
```
Linux
```sh
 ./vendor/bin/phpunit --bootstrap vendor/autoload.php tests
```

Vite unit testu palaišana:
```sh
npm run tests
``` 
vai ar labo peles izvēlni pa tiešo no PHPStorm

Acceptance testu palaišana no komandrindas
```sh
npx playwright test tests/e2e/app.spec.ts
``` 