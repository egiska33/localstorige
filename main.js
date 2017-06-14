/**
 * Created by egidijussivickas on 09/03/2017.
 */
var editing = false;

//susikuriam masyva su spalvu kodais kuriuos audosime avataru gamybai
var color = ['#bada55', '#B000B5', '#707020','#fb1','#1CE','#59A27A'];
// kintamaji j prilyginam 0 ir ji naudosime avataru gamyboje rinkdamiesi spalvas
var j = 0;



//JQuery scripto pradzia
$(document).ready(function () {

    refresh();


    //duomenu paemimas is formos
    $('button[type=submit]').click(function(event){
        event.preventDefault();

        var name = $('#name').val();
        var email = $('#email').val();
        var position = $('#position').val();

        //pasiimam nutraukos faila nunorydami kelia  kaip ji pasiselektinti
        var failas = $(event.target).closest('fieldset').find('input[type=file]')[0].files[0];

        //pasitikrinam ar failas pridetas ir jei pridetas ar jo tipas image
        if(typeof failas !== 'undefined' && failas.type.substring(0,6) === 'image/') {

            //kadangi salyga parode kad failas pridetas ir image tipo, tai galim ji konvertuoti
            var reader = new FileReader;

            //image konvertavimo i stringa funkcija
            reader.onload = function (event) {
                var base64 = event.target.result;


                var person = {
                    name: name,
                    email: email,
                    position: position,
                    avatar: base64
                };

                //susikuriam unikalu id
                id = Date.now();

                //patikriname ar redaguojame , ar nauji duomenys
                if (editing) {
                    id = editing;
                }

                if (person.name && person.email && person.position) {
                    localStorage.setItem(id, JSON.stringify(person));

                    editing = false;
                    refresh();
                    $('form')[0].reset();
                } else {
                    alert('Turi buti uzpildyti visi laukai');
                }


            };


            //sioje vietoje iskvieciame reader funkcija nuskaityti image failui ir ji pervesti i stringa
            reader.readAsDataURL(failas);


        } else {
            var person = {
                name: name,
                email: email,
                position: position,
                avatar: ''
            };

            //susikuriam unikalu id
            id = Date.now();

            //patikriname ar redaguojame , ar nauji duomenys
            if (editing) {
                id = editing;
            }

            if (person.name && person.email && person.position) {
                localStorage.setItem(id, JSON.stringify(person));

                editing = false;
                refresh();
                $('form')[0].reset();
            } else {
                alert('Turi buti uzpildyti visi laukai');
            }
        }


    });
    $(document).change('#filter', refresh);
});



// duomenu isvedimui pasidarome funkcija refresh
function refresh() {

    var table = $('table>tbody');
    table.empty();
    var i=0;
    var position = $('#filter').val();

    if(localStorage.length > 0) {
        for(var key in localStorage) {
            if(key != null && key !== 'undefine') {
                i++;

                var item = JSON.parse(localStorage.getItem(key));

                if(position === '' || position === item.position) {
                    var print = '<tr>' +
                        '<td>' + i + '</td>' +
                        '<td>' + item.name + '</td>' +
                        '<td>' + item.email + '</td>' +
                        '<td>' + item.position + '</td>';

                    if(item.avatar !== '') {
                        print += '<td>' + '<img class="avatar" src="' +item.avatar +'">' + '</td>';
                    } else {
                        print += '<td>' + '<div class="avatar" style="background-color:' + color[j] + ' "><span>' + item.name[0] + '</span></div> ' + '</td>';

                    }   print += '<td>' + '<span id="' + key + '" class="glyphicon glyphicon-pencil edit" aria-hidden="true"></span>' + ' ' + '<span id="' + key + '" class="glyphicon glyphicon-trash del" aria-hidden="true"></span> ' + '</td>' +
                        '</tr>';

                    table.append(print);

                    if (j < 5) {
                        j++;
                    } else {
                        j = 0;
                    }
                }
            }
        }
    }
    rebind();
}


// clicku klausimuisi susikuriame funkcija rebind, kad po kiekvieno duomeu perrasymo klausytusi clicku
function rebind() {
    $('.del').on('click', function () {

        // kadangi isvesdami dumenis prie siuksliadezes ir piestuko susikureme unikalu id, tai po clicko galime naudoti this.id ir gausime unikalu id
        localStorage.removeItem(this.id);
        refresh();

    });
    $('.edit').on('click', function () {
        var key = this.id;
        var contact = localStorage.getItem(key);
        contact = JSON.parse(contact);

        editing =  key;
        $('#name').val(contact.name);
        $('#email').val(contact.email);
        $('#position').val(contact.position);
    });

}