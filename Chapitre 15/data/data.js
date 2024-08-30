var compagnies = 	[	
						{"code": "AA", "nom": "American Airlines", "pays": "Etats-Unis"},
						{"code": "AB", "nom": "Air Berlin", "pays": "Allemagne"},
						{"code": "AC", "nom": "Air Canada", "pays": "Canada"},
						{"code": "AF", "nom": "Air France", "pays": "France"},
						{"code": "AH", "nom": "Air Algérie", "pays": "Algérie"},
						{"code": "AN", "nom": "Andorra Airlines", "pays": "Andorre"},
						{"code": "AT", "nom": "Royal Air Maroc", "pays": "Maroc"},
						{"code": "AZ", "nom": "Alitalia", "pays": "Italie"},
						{"code": "BA", "nom": "British Airways", "pays": "Royaume-Uni"},
						{"code": "DX", "nom": "Danish Air Transport", "pays": "Danemark"},
						{"code": "DY", "nom": "Norwegian", "pays": "Norvège"},
						{"code": "FI", "nom": "Icelandair", "pays": "Islande"},
					];
var vols =  [
				{"pays": "France", "de": "CDG - Paris Charles de Gaulle", "vers": "TLS - Toulouse Blagnac", "origine": "Nord"},
				{"pays": "France", "de": "TLS - Toulouse Blagnac", "vers": "CDG - Paris Charles de Gaulle", "origine": "Nord"},
				{"pays": "France", "de": "CDG - Paris Charles de Gaulle", "vers": "MAD - Madrid Barajas", "origine": "Nord"},
				{"pays": "France", "de": "MAD - Madrid Barajas", "vers": "CDG - Paris Charles de Gaulle", "origine": "Sud"},
				{"pays": "Royaume-Uni", "de": "LHR - Londres Heathrow", "vers": "MAD - Madrid Barajas", "origine": "Nord"},
				{"pays": "Royaume-Uni", "de": "MAD - Madrid Barajas", "vers": "LHR - Londres Heathrow", "origine": "Sud"},
				{"pays": "Royaume-Uni", "de": "LHR - Londres Heathrow", "vers": "TLS - Toulouse Blagnac", "origine": "Nord"},
				{"pays": "Royaume-Uni", "de": "TLS - Toulouse Blagnac", "vers": "LHR - Londres Heathrow", "origine": "Nord"},
				{"pays": "Etats-Unis", "de": "JFK - New york John Fitzgerald Kennedy", "vers": "ZRH - Zurich Suisse", "origine": "Ouest"},
				{"pays": "Etats-Unis", "de": "ZRH - Zurich Suisse", "vers": "JFK - New york John Fitzgerald Kennedy", "origine": "Est"},
				{"pays": "Allemagne", "de": "BER - Berlin-Brandebourg", "vers": "DKR - Léopold Sédar Senghor - Dakar", "origine": "Nord"},
				{"pays": "Allemagne", "de": "DKR - Léopold Sédar Senghor - Dakar", "vers": "BER - Berlin-Brandebourg", "origine": "Sud"},
				{"pays": "Algérie", "de": "CDG - Paris Charles de Gaulle", "vers": "ORN -  Ahmed Ben Bella - Oran", "origine": "Nord"},
				{"pays": "Algérie", "de": "ORN -  Ahmed Ben Bella - Oran", "vers": "CDG - Paris Charles de Gaulle", "origine": "Sud"},
				{"pays": "Canada", "de": "YYZ - Leaster B. Pearson - Toronto", "vers": "VCE - Venise Marco Polo", "origine": "Ouest"},
				{"pays": "Canada", "de": "VCE - Venise Marco Polo", "vers": "YYZ - Leaster B. Pearson - Toronto", "origine": "Est"},
				{"pays": "Canada", "de": "YYZ - Leaster B. Pearson - Toronto", "vers": "TLS - Toulouse Blagnac", "origine": "Ouest"},
				{"pays": "Canada", "de": "TLS - Toulouse Blagnac", "vers": "YYZ - Leaster B. Pearson - Toronto", "origine": "Ouest"},
				{"pays": "Maroc", "de": "FEZ - Fès-Saïss - Maroc", "vers": "LUX - Luxembourg-Findel", "origine": "Sud"},
				{"pays": "Maroc", "de": "LUX - Luxembourg-Findel", "vers": "FEZ - Fès-Saïss - Maroc", "origine": "Nord"},
				{"pays": "Andorre", "de": "CDG - Paris Charles de Gaulle", "vers": "ALV - La Vella Andorra", "origine": "Nord"},
				{"pays": "Andorre", "de": "ALV - La Vella Andorra", "vers": "CDG - Paris Charles de Gaulle", "origine": "Sud"},
				{"pays": "Italie", "de": "FCO - Léonard de Vinci - Roma", "vers": "JFK - New york John Fitzgerald Kennedy", "origine": "Est"},
				{"pays": "Italie", "de": "JFK - New york John Fitzgerald Kennedy", "vers": "FCO - Léonard de Vinci - Roma", "origine": "Ouest"},
				{"pays": "Italie", "de": "FCO - Léonard de Vinci - Roma", "vers": "TLS - Toulouse Blagnac", "origine": "Est"},
				{"pays": "Italie", "de": "TLS - Toulouse Blagnac", "vers": "FCO - Léonard de Vinci - Roma", "origine": "Est"},
				{"pays": "Danemark", "de": "TLS - Toulouse Blagnac", "vers": "CPH - Copenhagen Airport", "origine": "Nord"},
				{"pays": "Danemark", "de": "CPH - Copenhagen Airport", "vers": "TLS - Toulouse Blagnac", "origine": "Nord"},
				{"pays": "Norvège", "de": "OSL - OSLO-Gardermoen", "vers": "MAD - Madrid Barajas", "origine": "Nord"},
				{"pays": "Norvège", "de": "MAD - Madrid Barajas", "vers": "OSL - OSLO-Gardermoen", "origine": "Sud"},
				{"pays": "Islande", "de": "RKV - Reykjavik - Keflavik", "vers": "TLS - Toulouse Blagnac", "origine": "Nord"},
				{"pays": "Islande", "de": "TLS - Toulouse Blagnac", "vers": "RKV - Reykjavik - Keflavik", "origine": "Nord"},
			];

var cibles	=	{
					Nord: "Sud",
					Est: "Ouest",
					Ouest: "Est",
					Sud: "Nord"
				};

var pistesAeroport = 	{
							decollage:{bout: {left: 327, top: 608}, roulage:{left: 521, top: 469}, fin: {left: 920, top: 200}, orientation: -36},
							atterrissage:{bout: {left: 435, top: 465}, roulage: {left: 560, top: 375}, fin: {left: 940, top: 110}, orientation: -36},
						};
