//Funktio, joka suoritetaan kun html dokumentti on valmis
$(function () {
    //Funktio, jossa odotetaan, ennen kuin tuodaan seuraava elementti esille
    async function aloitusSlide() {
        //Aloitetaan odottamalla
        await new Promise(resolve => setTimeout(resolve, 1500));
        //Piilotetaan Finnkinon logo JQueryn avulla animoidusti
        $("#fk").fadeOut(1500);
        //Odotetaan
        await new Promise(resolve => setTimeout(resolve, 1500));
        //JQueryllä tuodaan header esille
        $("header").fadeIn(1500);
        //Odotetaan
        await new Promise(resolve => setTimeout(resolve, 2000));
        //JQueryllä tuodaan tekijä esille
        //Jotta, sain tekstin järkevästi tulemaan esille, sekä samaan aikaan liukumaan sisään vasemmalta...
        //...on mainittu, että fadeIn:n jälkeisen komennon ei tarvitse odottaa sen valmistumista
        $("#tehny").fadeIn({ queue: false, duration: 800 });
        $("#tehny").animate({ width: "100%" }, 800);
        //Odotetaan
        await new Promise(resolve => setTimeout(resolve, 850));
        //JQueryllä tuodaan valikko esille
        $("#valintojenm").slideDown(800);
    };
    //Kutsutaan funktio, kun sivu on valmis
    aloitusSlide();
    //JQueryyn rakennetulla ajax metodilla...
    $.ajax({
        //...osoitteesta...
        url: "https://www.finnkino.fi/xml/TheatreAreas/",
        //...haetaan dataa...
        method: 'GET',
        //...datan haun onnistuessa, kutsutaan funktio, jossa luetaan ja manipuloidaan haettua dataa
        success: function (data) {
            //Määritellään haettu data muuttujaan
            var teatteridata = data;
            //Testausta varten konsoli loki
            console.log(teatteridata);
            //Luodaan JQuery objekti haetulle datalle, jotta haettua dataa voidaan lukea sekä manipuloida JQueryn avulla
            var $teatterit = $(teatteridata);
            //Määritellään muuttuja, johon haetaan "TheatreAreas" tagi ja sen sisältö JQueryn avulla
            var teatterit = $teatterit.find('TheatreAreas');
            //"TheatreAreas" tagin sisältä haetaan kaikki "TheatreArea" tagit ja suoritetaan funktio jokaista kohden
            teatterit.children('TheatreArea').each(function () {
                //Määritellään yhteen muuttujaan sekä teatterin ID, että teatterin nimi
                let teatteri = $(this).find('ID').text() + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + $(this).find('Name').text();
                //Lisätään uusi vaihtoehto selektoriin, jossa on teatterin ID ja nimi
                $('#teatteriv').append("<option>" + teatteri + "</option>");
            })
        }
    })
});

//Määritellään selektori muuttujaan
var valintoja = document.getElementById("teatteriv");
//Kun selektorin valinta vaihtuu...
valintoja.addEventListener("change", function () {
    //...tyhjennetään vanha lista (ostoslistasta tutulla funktiolla)...
    function poistaKaikki() {
        function lapsetVittuun(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
        let lista = document.getElementById('lista');
        lapsetVittuun(lista);
    }
    poistaKaikki();
    //...määritellään valittu vaihtoehto muuttujaan...
    var valinta = document.getElementById("teatteriv").value;
    //...leikataan valitun vaihtoehdon alusta ID...
    var valintaid = valinta.substring(0, 4);
    //Konsoli loki testaukseen
    console.log(valintaid);
    //...sitten JQueryyn rakennetulla ajax metodilla...
    $.ajax({
        //...osoitteesta joka osittain määritellään valitun vaihtoehdon ID:n perusteella...
        url: "https://www.finnkino.fi/xml/Events/?area=${" + valintaid + "}/?listType=${NowInTheatres}",
        //...haetaan data...
        method: 'GET',
        //...datan haun onnistuessa, kutsutaan funktio, jossa luetaan ja manipuloidaan haettua dataa
        success: function (data) {
            //Määritellään haettu data muuttujaan
            var tieto = data;
            //Testausta varten konsoli loki
            console.log(tieto);
            //Luodaan JQuery objekti haetulle datalle, jotta haettua dataa voidaan lukea sekä manipuloida JQueryn avulla
            var $tieto = $(tieto);
            //Määritellään muuttuja, johon haetaan "Events" tagi ja sen sisältö JQueryn avulla
            var events = $tieto.find('Events');
            //"Events" tagin sisältä haetaan kaikki "Event" tagit ja suoritetaan funktio jokaista kohden
            events.children('Event').each(function () {
                //Funktiossa määritellään muuttuja, johon haetaan loopissa tämänhetkisen "Event" tagin alta "Title" tagin tekstisisältö (elokuvan nimi)
                let leffa = $(this).find('OriginalTitle').text();
                //Määritellään myös muuttuja tämänhetkisen "Event" tagin alla olevasta tagista leffan lyhyt info
                let leffaInfo = $(this).find('ShortSynopsis').text();
                //Määritellään myös muuttuja tämänhetkisen "Event" tagin alla olevasta tagista leffan kansikuva
                let leffaKuva = $(this).find('EventSmallImagePortrait').text();
                //Määritellään myös muuttuja tämänhetkisen "Event" tagin alla olevasta tagista leffan julkaisuaika Suomessa
                let leffaJulkaistu = $(this).find('dtLocalRelease').text();
                //Leikataan julkaisuaikaa niin että julkaisuaikaan jää ainoastaan vuosi ja kuukausi
                let leffaVuosiKk = leffaJulkaistu.substring(0, 10);
                //Testausta varten konsoli loki (kommentoitu pois, koska se täyttää konsolin)
                //console.log(leffa)
                //Lisätään HTML listaan, jonka id on "lista", li elementtien sisään, haettu elokuvan nimi, infoa leffasta... 
                //...leffan kansikuva ja p elementti jonka sisällä on leikattu leffan julkaisuaika
                //p elementtiä tullaan käyttämään listan sorttauksessa
                //Lisäksi tässä määritellään eri divit, joilla saadaan toiminnallisuutta ja tyylittelyä luotua
                $('#lista').append("<li id=\"lih\"><div id=\"leffaNimi\"><img src=\"" + leffaKuva + "\"><br>" + leffa + "</div><div id=\"leffaTiedot\" style=\"display:none\"><br>" + leffaInfo + "<br><br>Ensi-ilta:<p>" + leffaVuosiKk + "</p></div></li>");
            });
            //Määritellään muuttuja "sortataan", jolla sanotaan että sorttaus on käynnissä
            var sortataan = true;
            //Haetaan HTML dokumentista li elementit
            var li = document.getElementsByTagName("li");
            //Kun sorttaus on käynnissä
            while (sortataan) {
                //Otetaan sorttaus pois käynnistä
                sortataan = false;
                //For loopilla käydään kaikki li elementit yksitellen läpi
                for (var s = 0; s < (li.length - 1); s++) {
                    //Muuttuja, jolla sanotaan sortataanko käsittelyssä oleva li elementti
                    var sorttaus = false;
                    //Haetaan HTML dokumentista p elementit, koska halutaan sortata li:ssä olevan p:n sisällä olevan numeron mukaan
                    var p = document.getElementsByTagName("p");
                    //Jos käsittelyssä olevan li:ssä olevan p:n sisällä oleva numero on pienempi kuin seuraavan li:ssä olevan p:n numero...
                    if (p[s].innerHTML.toString().toLowerCase() > p[s + 1].innerHTML.toString().toLowerCase()) {
                        //...sortataan
                        sorttaus = true;
                        //Tarkistetaan uudestaan
                        break;
                    }
                }
                //Jos sortataan
                if (sorttaus) {
                    //...siirretään käsittelyssä oleva li ylöspäin
                    li[s].parentNode.insertBefore(li[s + 1], li[s]);
                    //Laitetaan sorttaus takaisin käyntiin
                    sortataan = true;
                }
            }
            //Funktio, joka muuttaa li elementit yksitellen näkyviksi tietyin aikavälein... 
            //...muuttamalla niiden id:tä ja sitä kautta css tyylittelyä
            async function tuoEsiin() {
                //For loop, jolla käydään kaikki li elementit yksitellen läpi
                for (var t = 0; t < (li.length); t++) {
                    //Määritellään nykyinen li elementti muuttujaan
                    var tämä = li[t];
                    //JQueryn fadeIn metodilla tuodaan nykyinen li elementti esille animoidusti
                    $(tämä).fadeIn(600);
                    //Odotetaan
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
            //Kutsutaan funktio, kun lista on haettu ja sortattu
            tuoEsiin();
            //Haetaan kaikki divit joissa id on "leffaNimi" ja jokaista kohden...
            document.querySelectorAll('#leffaNimi').forEach(leffa => {
                //...lisätään klikkauksen seuranta
                leffa.addEventListener("click", () => {
                    //Kun leffan nimeä klikkaa, JQueryn avulla haetaan käsittelyssä olevasta...
                    //...leffasta seuraavan divin, jonka id on "leffaTiedot" ja tuo sen esille animoidusti JQueryn avulla
                    $(leffa).next('#leffaTiedot').slideToggle();
                });
            });
            //Katsotaan onko elokuva/näytös esillä 2022
            //Haetaan kaikki p elementit ja jokaista kohden...
            document.querySelectorAll('p').forEach(aika => {
                //...ensin poistetaan - merkki, lukemisen helpottamiseksi...
                var aikaa = aika.innerHTML.replaceAll("-", "");
                //Konsoli loki testaukseen (kommentoitu pois, koska se täyttää konsolin)
                //console.log(aikaa)
                //...sitten määritellään uudet divit esityksessä oleville ja tulossa oleville...
                var tul = document.createElement("div");
                tul.setAttribute("id", "tulo");
                tul.innerHTML = "TULOSSA";
                var esi = document.createElement("div");
                esi.setAttribute("id", "esit");
                esi.innerHTML = "ESITYKSESSÄ";
                //Haetaan nykyhetki
                var nykyHetki = new Date();
                //Jostain syystä "nykyhetki" on 1 kk taaksepäin, joten lisätään kuukauteen 1
                nykyHetki.setMonth(nykyHetki.getMonth() + 1);
                //Lisätään myös päivään 1, jotta nähdään tänään esitykseen tulleet oikein
                nykyHetki.setDate(nykyHetki.getDate() + 1);
                //Määritellään vuosi, kk ja pv samaan järjestykseen datasta löytyvän päivämäärän kanssa...
                var nyt = nykyHetki.getFullYear() + "/" + nykyHetki.getMonth() + "/" + nykyHetki.getDate();
                //...poistetaan välistä turhat merkit...
                var nytheti = nyt.replaceAll("/", "");
                //Konsoli loki testaukseen (kommentoitu pois, koska se täyttää konsolin)
                //console.log(nytheti);
                //...jos julkaisupäivä aiemmin kuin "nykyhetki", eli huominen...
                if (aikaa < nytheti) {
                    //...käsittelyssä olevan p elementin vanhemman vanhempaan lisätään div, joka määrittelee elokuva/esityksen olevan esityksessä...
                    aika.parentElement.parentElement.appendChild(esi);
                }
                //...muutoin...
                else {
                    //...käsittelyssä olevan p elementin vanhemman vanhempaan lisätään div, joka määrittelee elokuvan/esityksen olevan tulossa
                    aika.parentElement.parentElement.appendChild(tul);
                }
            });
        }
    });
});

