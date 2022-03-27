/* API call without error */
var getAPI = function ( url ) {
    return new Promise( function ( resolution, rejection ) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if ( xhr.readyState === 4 ) {
                if ( xhr.status === 200 ) {
                    resolution( xhr.responseText );
                } else {
                    rejection ( xhr );
                }
            }
        };
        xhr.open( "GET", url, true );
        xhr.send( null );
    } );
};

/* Play a sound (allows you to play several sounds at once) */
/* https://jsfiddle.net/pknsg809/2/ */
function play_F( file ) {
    var audio = document.createElement( 'audio' );
    audio.src = file;
    document.body.appendChild( audio );
    audio.play();

    audio.onended = function () {
        this.parentNode.removeChild( this );
    }
}

/* VueJS */
var app = new Vue( {
    el: '.line',
    data: {
        popup: false,
        state: 'startup',
        menu_pokemon: {
            pokemons: [],
            menu_actif: 0,
            page_active: 0,
            nombre_max: 0,
            page_prec: null,
            page_suiv: null
        },
        pokemon: {
            nom: null,
            image: null,
            stats: null,
            types: null,
            id:null,
            moves:null
        },
    },
    methods: {
        camera( direction ) {
            if ( direction == "left" ) {
                document.querySelector( ".pokedex" ).classList.remove( "open-right" );
                document.querySelector( ".pokedex" ).classList.add( "open-left" );
            } else if ( direction == "right" ) {
                document.querySelector( ".pokedex" ).classList.remove( "open-left" );
                document.querySelector( ".pokedex" ).classList.add( "open-right" );
            } else {
                document.querySelector( ".pokedex" ).classList.remove( "open-left" );
                document.querySelector( ".pokedex" ).classList.remove( "open-right" );
            }
        },
        /* Pokemon Search function */
        getPokemons() {
            
            let save_state = this.state;
            getAPI( 'https://pokeapi.co/api/v2/pokemon?limit=4&offset=' + ( this.menu_pokemon.page_active * 4 ) ).then( ( res ) => {
                let res_JSON = JSON.parse( res );
                /* Retrieve values ​​*/
                this.menu_pokemon.pokemons = res_JSON.results;
                this.menu_pokemon.page_prec = res_JSON.previous;
                this.menu_pokemon.page_suiv = res_JSON.next;
                this.getPokemon();
                /* save current STATE */
                this.state = save_state;
            } );
        },
        /* get Pokemon info in the List */
        getPokemon() {
            let save_state = this.state;
            this.state = 'loading';
            let current_pokemon_name = this.menu_pokemon.pokemons[ this.menu_pokemon.menu_actif ].name;
            getAPI( 'https://pokeapi.co/api/v2/pokemon/' + current_pokemon_name ).then( ( res ) => {
                let res_JSON = JSON.parse( res );
                /* Retrieve values ​​*/
                this.pokemon.nom = res_JSON.name;
                this.pokemon.image = res_JSON.sprites.other[ 'home' ].front_default;
                this.pokemon.stats = res_JSON.stats;
                this.pokemon.types = res_JSON.types;
                this.pokemon.id = res_JSON.id;
                this.pokemon.moves = res_JSON.moves;
                /* save current STATE */
                this.state = save_state;
            } );
        },

        getPokemonSearch(e) {
            let current_pokemon_name = e.target.value;
            getAPI( 'https://pokeapi.co/api/v2/pokemon/' + current_pokemon_name ).then( ( res ) =>  {
                    let res_JSON = JSON.parse( res );
                    /* Retrieve values ​​*/
                    this.pokemon.nom = res_JSON.name;
                    this.pokemon.image = res_JSON.sprites.other[ 'home' ].front_default;
                    this.pokemon.stats = res_JSON.stats;
                    this.pokemon.types = res_JSON.types;
                    this.pokemon.id = res_JSON.id;
                    this.pokemon.moves = res_JSON.moves;
                    /* STATE change */
                    this.state = 'pokemon'; 
            } );      
        },
            /* Show pokemon in a different state*/
            showSkills() {
                this.getPokemon();
                this.state = 'pokemonSkills';
            },
                /* Pokemon List Loading function*/
       
                opening() {
                    if ( !document.querySelector( ".pokedex" ).classList.contains( "open" ) && !document.querySelector( ".pokedex" ).classList.contains( "close" ) ) {
                        this.state = 'startup';
                        document.querySelector( ".pokedex" ).classList.add( "close" )
                        /* Sound */
                        play_F( '/mp3/boot.mp3' );
                        /* Lights */
                        setTimeout( function () {
                            document.querySelector( ".led-red" ).classList.add( 'alight' );
                        }, 2700 );
                        setTimeout( function () {
                            document.querySelector( ".led-blue" ).classList.add( 'alight' );
                            document.querySelector( ".led-red" ).classList.remove( 'alight' );
                        }, 5500 );
                        /* Movement */
                        setTimeout( () => {
                            this.state = 'pokemons';
                            this.getPokemons();
                            /* Turn on the Pokedex */
                            document.querySelector( ".pokedex" ).classList.add( "alight" );
                            document.querySelector( '.pokedex' ).classList.remove( "close" );
                        }, 5500 );
                        document.querySelector( '.pokedex' ).classList.add( "open" );
                    }
                },
        
                closing() {
                    if ( document.querySelector( ".pokedex" ).classList.contains( "open" ) && document.querySelector( ".pokedex" ).classList.contains( "alight" ) && !document.querySelector( ".pokedex" ).classList.contains( "close" ) ) {
        
                        this.camera( 'reset' );
        
                        this.state = 'off';
                        document.querySelector( ".pokedex" ).classList.remove( "open" );
                        document.querySelector( ".pokedex" ).classList.add( "close" )
                        
                        /* Lights */
                        setTimeout( function () {
                            document.querySelector( ".led-red" ).classList.add( 'alight' );
                        }, 0 );
                        setTimeout( function () {
                            document.querySelector( ".led-blue" ).classList.remove( 'alight' );
                            document.querySelector( ".led-red" ).classList.remove( 'alight' );
                        }, 800 );
                        /* Sounds and movements */
                        setTimeout( () => {
                            this.state = 'init';
                            play_F( '/mp3/off.mp3' );
                            document.querySelector( ".pokedex" ).classList.remove( "alight" );
                            document.querySelector( ".pokedex" ).classList.remove( "close" );
                        }, 500 );
                    }
                },
        
        /* Press the power button */
        power() {
            if ( document.querySelector( ".pokedex" ).classList.contains( "open" ) && document.querySelector( ".pokedex" ).classList.contains( "alight" ) && !document.querySelector( ".pokedex" ).classList.contains( "close" ) ) {
                /* If the Pokedex is open and turned on */
                this.state = 'off';
                document.querySelector( ".pokedex" ).classList.add( "close" )
                
                /* Lights */
                setTimeout( function () {
                    document.querySelector( ".led-red" ).classList.remove( 'alight' );
                }, 0 );
                setTimeout( function () {
                    document.querySelector( ".led-blue" ).classList.remove( 'alight' );
                }, 500 );
                /* Sounds and movements */
                setTimeout( () => {
                    this.state = 'init';
                    play_F( '/mp3/off.mp3' );
                    document.querySelector( ".pokedex" ).classList.remove( "alight" );
                    document.querySelector( ".pokedex" ).classList.remove( "close" );
                }, 500 );
            }
        },
        press( touch ) {
            
            /* Do nothing if the Pokedex is off */
            if ( document.querySelector( ".pokedex" ).classList.contains( "alight" ) ) {

                if ( touch == 'ok' ) {
                    
                    /* OK */
                    /* If we are on the main menu */
                    if ( this.state == 'pokemons' ) {
                        this.state = 'pokemon';
                        
                        this.getPokemon();
                        play_F( '/mp3/bip.mp3' );
                    } else if ( this.state == 'pokemon' ) {
                        play_F( '/mp3/error.mp3' );
                    }

                } else if ( touch == 'return' ) {
                    /* RETURN */
                    /* If we are on the main menu */
                    if ( this.state == 'pokemons' ) {
                        play_F( '/mp3/error.mp3'  );
                    } else if ( this.state == 'pokemon' ) {
                        this.state = 'pokemons';
                        play_F( '/mp3/bip.mp3' );
                    }
                } else {
                    play_F( '/mp3/bip.mp3' );
                }
            }
        },
        press_joystick( direction ) {

            if ( direction === 'top' ) {
                
               /* HIGH */
                /* Nothing works if the Pokedex is off */
                if ( document.querySelector( ".pokedex" ).classList.contains( "alight" ) ) {
                    if ( this.state == 'pokemons' ) {
                        
                        if ( this.menu_pokemon.menu_actif > 0 ) {
                            play_F( '/mp3/tast.mp3' );
                            this.menu_pokemon.menu_actif--;
                            this.getPokemon();
                        } else {
                            /* Change page if possible */
                            if ( this.menu_pokemon.page_prec != null ) {
                                play_F( '/mp3/tast.mp3' );
                                this.menu_pokemon.page_active--;
                                this.getPokemons();
                                this.menu_pokemon.menu_actif = 3;
                            } else {
                                play_F( '/mp3/error.mp3' );
                            }
                        }
                    }
                }
                document.querySelector( ".joystick" ).classList.add( 'joystick-angle-top' );

            } else if ( direction === 'bottom' ) {
                /* LOW */
                /* Nothing works if the Pokedex is off */
                if ( document.querySelector( ".pokedex" ).classList.contains( "alight" ) ) {

                    if ( this.state == 'pokemons' ) {
                        if ( this.menu_pokemon.menu_actif < 3 ) {
                            play_F( '/mp3/tast.mp3' );
                            this.menu_pokemon.menu_actif++;
                            this.getPokemon();
                        } else {
                            /* Change page if possible */
                            if ( this.menu_pokemon.page_suiv != null ) {
                                play_F( '/mp3/tast.mp3' );
                                this.menu_pokemon.page_active++;
                                this.getPokemons();
                                this.menu_pokemon.menu_actif = 0;
                            } else {
                                play_F( '/mp3/error.mp3' );
                            }
                        }
                    }
                }
                document.querySelector( ".joystick" ).classList.add( 'joystick-angle-bottom' );

            } else if ( direction === 'left' ) {
                /* LEFT */
                /* Nothing works if the Pokedex is off */
                if ( document.querySelector( ".pokedex" ).classList.contains( "alight" ) ) {
                    if ( this.state == 'pokemons' ) {
                        
                        if ( this.menu_pokemon.menu_actif > 0 ) {
                            play_F( '/mp3/tast.mp3' );
                            this.menu_pokemon.menu_actif--;
                            this.getPokemon();
                        } else {
                            /* Change page if possible */
                            if ( this.menu_pokemon.page_prec != null ) {
                                play_F( '/mp3/tast.mp3' );
                                this.menu_pokemon.page_active--;
                                this.getPokemons();
                                this.menu_pokemon.menu_actif = 3;
                            } else {
                                play_F( '/mp3/error.mp3' );
                            }
                        }
                    }
                }
                document.querySelector( ".joystick" ).classList.add( 'joystick-angle-left' );
            } else if ( direction === 'right' ) {
                /* RIGHT */
                /* Nothing works if the Pokedex is off */
                if ( document.querySelector( ".pokedex" ).classList.contains( "alight" ) ) {
                    if ( this.state == 'pokemons' ) {
                        if ( this.menu_pokemon.menu_actif < 3 ) {
                            play_F( '/mp3/tast.mp3' );
                            this.menu_pokemon.menu_actif++;
                            this.getPokemon();
                        } else {
                            /* Change page if possible */
                            if ( this.menu_pokemon.page_suiv != null ) {
                                play_F( '/mp3/tast.mp3' );
                                this.menu_pokemon.page_active++;
                                this.getPokemons();
                                this.menu_pokemon.menu_actif = 0;
                            } else {
                                play_F( '/mp3/error.mp3' );
                            }
                        }
                    }
                }
                document.querySelector( ".joystick" ).classList.add( 'joystick-angle-right' );
            } else {
                /* Release or exit button */
                document.querySelector( ".joystick" ).classList.remove( 'joystick-angle-top' );
                document.querySelector( ".joystick" ).classList.remove( 'joystick-angle-bottom' );
                document.querySelector( ".joystick" ).classList.remove( 'joystick-angle-left' );
                document.querySelector( ".joystick" ).classList.remove( 'joystick-angle-right' );
            }
        }
    }
} );
