/*
 strategy.js
 Author: Jim Cowart (http://freshbrewedcode.com/jimcowart)
 License: Dual licensed MIT (http://www.opensource.org/licenses/mit-license) & GPL (http://www.opensource.org/licenses/gpl-license)
 Version 0.0.1
 */
describe( "strategy.js", function() {
	describe( "when creating a new instance with lazyInit = true", function() {
		describe( "with NO strategies in use", function() {
			var obj = {
				name    : "Jimbabwe",
				doStuff : function( msg, cb ) {
					cb( "Hi, " + this.name + " - " + msg );
				}
			};
			var oldMethod;
			before( function() {
				oldMethod = obj.doStuff;
				obj.doStuff = new Strategy( {
					owner    : obj,
					prop     : "doStuff",
					context  : obj,
					lazyInit : true
				} );
			} );
			it( "should not replace the method yet", function() {
				expect( obj.doStuff ).to.be( oldMethod );
			} );
			it( "should return the expected value", function() {
				obj.doStuff( "here's your msg...", function( msg ) {
					expect( msg ).to.be( "Hi, Jimbabwe - here's your msg..." );
				} );
			} );
		} );

		describe( "with strategies in use", function() {
			var obj = {
				name    : "Jimbabwe",
				doStuff : function( msg, cb ) {
					cb( "Hi, " + this.name + " - " + msg );
				}
			};
			var oldMethod;
			before( function() {
				oldMethod = obj.doStuff;
				obj.doStuff = new Strategy( {
					owner    : obj,
					prop     : "doStuff",
					context  : obj,
					lazyInit : true
				} );
				obj.doStuff.useStrategy( {
					name : "test1",
					fn   : function( next, msg ) {
						next( "Yo dawg..." + msg );
					}
				} );
			} );
			it( "should replace the method", function() {
				expect( obj.doStuff ).to.not.be( oldMethod );
			} );
			it( "should be able to see original target on strategy instance", function() {
				expect( obj.doStuff.target() ).to.be( oldMethod );
			} );
			it( "should show a strategy in the array", function() {
				expect( obj.doStuff.strategies().length ).to.be( 1 );
			} );
			it( "should return the expected value", function() {
				it( "should return the expected value", function() {
					obj.doStuff( "here's your msg...", function( msg ) {
						expect( msg ).to.be( "Hi, Jimbabwe - Yo dawg...here's your msg..." );
					} );
				} );
			} );
		} );
	} );
	describe( "when resetting strategies", function() {
		var obj = {
			name    : "Jimbabwe",
			doStuff : function( msg, cb ) {
				cb( "Hi, " + this.name + " - " + msg );
			}
		};
		var oldMethod;
		before( function() {
			oldMethod = obj.doStuff;
			obj.doStuff = new Strategy( {
				owner   : obj,
				prop    : "doStuff",
				context : obj
			} );
			obj.doStuff.useStrategy( {
				name : "test1",
				fn   : function( next, msg ) {
					next( "Yo dawg..." + msg );
				}
			} );
			obj.doStuff.reset();
		} );
		it( "should replace the method", function() {
			expect( obj.doStuff ).to.not.be( oldMethod );
		} );
		it( "should be able to see original target on strategy instance", function() {
			expect( obj.doStuff.target() ).to.be( oldMethod );
		} );
		it( "should NOT show a strategy in the array", function() {
			expect( obj.doStuff.strategies().length ).to.be( 0 );
		} );
		it( "should return the expected value", function() {
			it( "should return the expected value", function() {
				obj.doStuff( "here's your msg...", function( msg ) {
					expect( msg ).to.be( "Hi, Jimbabwe - here's your msg..." );
				} );
			} );
		} );
	} );
	describe( "when providing a strategy-specific context", function() {
		var obj = {
			name    : "Jimbabwe",
			doStuff : function( msg, cb ) {
				cb( "Hi, " + this.name + " - " + msg );
			}
		};
		var objB = { name: "Your mom" };
		var oldMethod;
		before( function() {
			oldMethod = obj.doStuff;
			obj.doStuff = new Strategy( {
				owner   : obj,
				prop    : "doStuff",
				context : obj
			} );
			obj.doStuff.useStrategy( {
				name : "test1",
				fn   : function( next, msg ) {
					next( "Yo dawg..." + this.name + " says '" + msg + "'");
				},
				context: objB
			} );
		} );
		it( "should replace the method", function() {
			expect( obj.doStuff ).to.not.be( oldMethod );
		} );
		it( "should be able to see original target on strategy instance", function() {
			expect( obj.doStuff.target() ).to.be( oldMethod );
		} );
		it( "should show a strategy in the array", function() {
			expect( obj.doStuff.strategies().length ).to.be( 1 );
		} );
		it( "should return the expected value", function() {
			it( "should return the expected value", function() {
				obj.doStuff( "here's your msg...", function( msg ) {
					expect( msg ).to.be( "Hi, Jimbabwe - Yo dawg...Your mom says 'here's your msg...'" );
				} );
			} );
		} );
	} );
} );